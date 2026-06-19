// GET /api/v1/checkout/pix-status/[id] — consulta status do pagamento PIX
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { setCors, ok, fail } from '../../../_lib/server.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const { id } = req.query;
  if (!id) return fail(res, 400, 'ERR_MISSING_ID', 'ID do pagamento não informado');

  if (!process.env.MP_ACCESS_TOKEN) return fail(res, 500, 'ERR_CONFIG', 'MP_ACCESS_TOKEN não configurado');

  const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  const payment = new Payment(client);
  const pix     = await payment.get({ id: Number(id) });

  return ok(res, { status: pix.status });
}
