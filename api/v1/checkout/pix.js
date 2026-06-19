// POST /api/v1/checkout/pix — gera pagamento PIX via Mercado Pago
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin, setCors, ok, fail, getAuthUser } from '../../_lib/server.js';

const PLANOS = {
  mensal:     { valor: 19.90, dias: 30,  descricao: 'Simulado OAB/FGV — Plano Mensal' },
  trimestral: { valor: 49.90, dias: 90,  descricao: 'Simulado OAB/FGV — Plano Trimestral' },
  semestral:  { valor: 79.90, dias: 180, descricao: 'Simulado OAB/FGV — Plano Semestral' },
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const sb   = supabaseAdmin();
  const user = await getAuthUser(req, sb);
  if (!user) return fail(res, 401, 'ERR_UNAUTH', 'Não autenticado');

  const { plano } = req.body || {};
  const cfg = PLANOS[plano];
  if (!cfg) return fail(res, 400, 'ERR_INVALID_PLAN', 'Plano inválido');

  if (!process.env.MP_ACCESS_TOKEN) {
    return fail(res, 500, 'ERR_CONFIG', 'MP_ACCESS_TOKEN não configurado');
  }

  const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  const payment = new Payment(client);

  const nome = (user.user_metadata?.full_name || user.email || '').split(' ');

  const pix = await payment.create({
    body: {
      transaction_amount: cfg.valor,
      description:        cfg.descricao,
      payment_method_id:  'pix',
      payer: {
        email:      user.email,
        first_name: nome[0] || 'Aluno',
        last_name:  nome.slice(1).join(' ') || 'OAB',
      },
      metadata: { user_id: user.id, plano },
      external_reference: `${user.id}|${plano}`,
    },
  });

  return ok(res, {
    id:             pix.id,
    qr_code:        pix.point_of_interaction?.transaction_data?.qr_code,
    qr_code_base64: pix.point_of_interaction?.transaction_data?.qr_code_base64,
    valor:          cfg.valor,
    plano,
    dias:           cfg.dias,
  });
}
