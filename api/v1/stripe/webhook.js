// POST /api/v1/stripe/webhook — recebe eventos Stripe e atualiza subscriptions
import Stripe from 'stripe';
import { supabaseAdmin } from '../../_lib/server.js';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const PLANO_MAP = {
  [process.env.STRIPE_PRICE_MENSAL]:      'mensal',
  [process.env.STRIPE_PRICE_TRIMESTRAL]:  'trimestral',
  [process.env.STRIPE_PRICE_SEMESTRAL]:   'semestral',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig    = req.headers['stripe-signature'];
  const body   = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const sb = supabaseAdmin();

  async function upsertSub(stripeSub) {
    const customerId = stripeSub.customer;
    const priceId    = stripeSub.items?.data?.[0]?.price?.id;
    const plano      = PLANO_MAP[priceId] || null;
    const status     = stripeSub.status;
    const valido_ate = stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000).toISOString()
      : null;

    // Descobre o user_id pelo stripe_customer_id
    const { data: sub } = await sb
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!sub?.user_id) return;

    await sb.from('subscriptions').update({
      stripe_sub_id: stripeSub.id,
      plano,
      status,
      valido_ate,
    }).eq('user_id', sub.user_id);
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await upsertSub(event.data.object);
      break;

    case 'customer.subscription.deleted': {
      const stripeSub = event.data.object;
      const { data: sub } = await sb
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', stripeSub.customer)
        .single();
      if (sub?.user_id) {
        await sb.from('subscriptions').update({ status: 'canceled', valido_ate: null })
          .eq('user_id', sub.user_id);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const { data: sub } = await sb
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', invoice.customer)
        .single();
      if (sub?.user_id) {
        await sb.from('subscriptions').update({ status: 'past_due' }).eq('user_id', sub.user_id);
      }
      break;
    }
  }

  res.status(200).json({ received: true });
}
