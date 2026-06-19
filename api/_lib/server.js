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

  const md   = pix.metadata || {};
  let userId = md.user_id || md.userId;
  let plano  = md.plano;

  // Fallback: external_reference é retornado pelo MP sem transformar as chaves (metadata às vezes some/transforma)
  if ((!userId || !plano) && typeof pix.external_reference === 'string') {
    const [refUser, refPlano] = pix.external_reference.split('|');
    userId = userId || refUser;
    plano  = plano  || refPlano;
  }

  if (!userId || !plano)      return { ativado: false, motivo: 'sem_user_ou_plano' };
  if (!DIAS_PLANO[plano])     return { ativado: false, motivo: 'plano_invalido:' + plano };

  const dias      = DIAS_PLANO[plano];
  const validoAte = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
  const base = {
    user_id:    userId,
    plano,
    status:     'active',
    valido_ate: validoAte,
    updated_at: new Date().toISOString(),
  };

  const sb = supabaseAdmin();
  // Tenta gravar com mp_payment_id; se a coluna não existir, refaz sem ela (não bloqueia a liberação)
  let { error } = await sb.from('subscriptions')
    .upsert({ ...base, mp_payment_id: pix.id?.toString() }, { onConflict: 'user_id' });
  if (error) {
    const retry = await sb.from('subscriptions').upsert(base, { onConflict: 'user_id' });
    error = retry.error;
  }

  if (error) return { ativado: false, motivo: error.message };
  return { ativado: true, validoAte, plano };
}
