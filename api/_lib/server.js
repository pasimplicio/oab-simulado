// api/_lib/server.js — helpers compartilhados entre todas as functions
import { createClient } from '@supabase/supabase-js';

export function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function setCors(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
}

export function ok(res, data) {
  return res.status(200).json({ data, error: null });
}

export function fail(res, status, code, message) {
  return res.status(status).json({ data: null, error: { code, message } });
}

export async function getAuthUser(req, sb) {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const { data: { user }, error } = await sb.auth.getUser(token);
  return error ? null : user;
}

export function hasActiveAccess(sub) {
  if (!sub) return false;
  if (sub.acesso_manual) return true;
  return sub.status === 'active' && sub.valido_ate && new Date(sub.valido_ate) > new Date();
}

const DIAS_PLANO = { mensal: 30, trimestral: 90, semestral: 180 };

// Ativa a assinatura a partir de um pagamento Mercado Pago aprovado.
// Idempotente (upsert por user_id) — pode ser chamada pelo webhook e pelo polling.
export async function ativarAssinaturaPorPagamento(pix) {
  if (!pix || pix.status !== 'approved') return { ativado: false, motivo: 'nao_aprovado' };

  const md     = pix.metadata || {};
  const userId = md.user_id || md.userId;
  const plano  = md.plano;
  if (!userId || !plano) return { ativado: false, motivo: 'metadata_incompleto' };

  const dias      = DIAS_PLANO[plano] || 30;
  const validoAte = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();

  const sb = supabaseAdmin();
  const { error } = await sb.from('subscriptions').upsert({
    user_id:       userId,
    plano,
    status:        'active',
    valido_ate:    validoAte,
    mp_payment_id: pix.id?.toString(),
    updated_at:    new Date().toISOString(),
  }, { onConflict: 'user_id' });

  if (error) return { ativado: false, motivo: error.message };
  return { ativado: true, validoAte, plano };
}
