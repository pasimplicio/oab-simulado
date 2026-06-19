// POST /api/v1/checkout/session — cria sessão Stripe Checkout
import Stripe from 'stripe';
import { supabaseAdmin, setCors, ok, fail, getAuthUser } from '../../../_lib/server.js';

const PRICE_MAP = {
  mensal:      process.env.STRIPE_PRICE_MENSAL,
  trimestral:  process.env.STRIPE_PRICE_TRIMESTRAL,
  semestral:   process.env.STRIPE_PRICE_SEMESTRAL,
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sb     = supabaseAdmin();
  const user   = await getAuthUser(req, sb);
  if (!user) return fail(res, 401, 'ERR_UNAUTH', 'Não autenticado');

  const { plano } = req.body || {};
  const priceId   = PRICE_MAP[plano];
  if (!priceId) return fail(res, 400, 'ERR_INVALID_PLAN', 'Plano inválido');

  // Busca ou cria customer Stripe
  const { data: sub } = await sb
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  let customerId = sub?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
    customerId = customer.id;
    await sb.from('subscriptions').update({ stripe_customer_id: customerId }).eq('user_id', user.id);
  }

  const origin = process.env.ALLOWED_ORIGIN || 'https://oabsimulado.sistemaspsdev.com.br';
  const session = await stripe.checkout.sessions.create({
    customer:            customerId,
    mode:                'subscription',
    payment_method_types: ['card'],
    line_items:          [{ price: priceId, quantity: 1 }],
    success_url:         `${origin}/simulado.html?checkout=ok`,
    cancel_url:          `${origin}/index.html?planos=1`,
    locale:              'pt-BR',
    metadata:            { user_id: user.id, plano },
  });

  return ok(res, { url: session.url });
}
