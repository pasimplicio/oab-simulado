// GET /api/v1/user/me — retorna perfil + status de acesso
import { supabaseAdmin, setCors, ok, fail, getAuthUser, hasActiveAccess } from '../../_lib/server.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const sb = supabaseAdmin();
  const user = await getAuthUser(req, sb);
  if (!user) return fail(res, 401, 'ERR_UNAUTH', 'Não autenticado');

  const { data: sub } = await sb
    .from('subscriptions')
    .select('plano, status, acesso_manual, acesso_manual_obs, valido_ate')
    .eq('user_id', user.id)
    .single();

  const { data: profile } = await sb
    .from('users')
    .select('name, picture, role')
    .eq('id', user.id)
    .single();

  const access = hasActiveAccess(sub);

  return ok(res, {
    id:      user.id,
    email:   user.email,
    name:    profile?.name || user.user_metadata?.full_name,
    picture: profile?.picture || user.user_metadata?.avatar_url,
    role:    profile?.role || 'user',
    hasAccess: access,
    reason: access
      ? (sub?.acesso_manual ? 'manual_access' : 'active_subscription')
      : 'no_access',
    subscription: sub
      ? { plano: sub.plano, status: sub.status, valido_ate: sub.valido_ate, acesso_manual: sub.acesso_manual }
      : null,
  });
}
