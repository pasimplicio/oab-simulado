// POST /api/v1/mp-webhook — webhook Mercado Pago (PIX aprovado → ativa assinatura)
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

const DIAS_PLANO = { mensal: 30, trimestral: 90, semestral: 180 };

function validarAssinatura(xSignature, xRequestId, dataId, secret) {
  if (!xSignature || !secret) return !secret; // se sem secret, aceita tudo
  const parts = {};
  xSignature.split(',').forEach(p => {
    const [k, v] = p.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  });
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;
  const template = `id:${dataId ?? ''};request-id:${xRequestId ?? ''};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(template).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'));
  } catch { return false; }
}

async function lerBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk.toString('utf-8'); });
    req.on('end',  () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.status(200).send('OK'); // responde imediatamente para o MP não retentar

  if (req.method !== 'POST') return;

  try {
    const rawBody = await lerBody(req);
    let body;
    try { body = JSON.parse(rawBody); } catch { return; }

    const secret  = process.env.MP_WEBHOOK_SECRET || '';
    const dataId  = body?.data?.id?.toString();
    const valido  = validarAssinatura(
      req.headers['x-signature'],
      req.headers['x-request-id'],
      dataId,
      secret
    );
    if (!valido) { console.warn('[MP Webhook] Assinatura inválida'); return; }

    if ((body.type === 'payment' || body.action === 'payment.updated') && dataId) {
      const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
      const payment = new Payment(client);
      const pix     = await payment.get({ id: Number(dataId) });

      console.log(`[MP Webhook] payment ${dataId} status: ${pix.status}`);
      if (pix.status !== 'approved') return;

      const userId = pix.metadata?.user_id;
      const plano  = pix.metadata?.plano;
      if (!userId || !plano) { console.warn('[MP Webhook] metadata incompleto'); return; }

      const dias      = DIAS_PLANO[plano] || 30;
      const validoAte = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();

      const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } });

      const { error } = await sb.from('subscriptions').upsert({
        user_id:    userId,
        plano,
        status:     'active',
        valido_ate: validoAte,
        mp_payment_id: pix.id?.toString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (error) console.error('[MP Webhook] Erro ao ativar:', error);
      else console.log(`[MP Webhook] Plano ${plano} ativado para user ${userId} até ${validoAte}`);
    }
  } catch (err) {
    console.error('[MP Webhook] Erro:', err?.message || err);
  }
}
