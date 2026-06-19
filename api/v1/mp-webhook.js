// POST /api/v1/mp-webhook — webhook Mercado Pago (PIX aprovado → ativa assinatura)
import { MercadoPagoConfig, Payment } from 'mercadopago';
import crypto from 'crypto';
import { ativarAssinaturaPorPagamento } from '../_lib/server.js';

export const config = { api: { bodyParser: false } };

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

      const r = await ativarAssinaturaPorPagamento(pix);
      if (r.ativado) console.log(`[MP Webhook] Plano ${r.plano} ativado até ${r.validoAte}`);
      else console.warn('[MP Webhook] não ativou:', r.motivo);
    }
  } catch (err) {
    console.error('[MP Webhook] Erro:', err?.message || err);
  }
}
