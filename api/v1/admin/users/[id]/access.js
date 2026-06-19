// PATCH /api/v1/admin/users/[id]/access — toggle acesso_manual (admin only)
import { supabaseAdmin, setCors, ok, fail, getAuthUser } from '../../../../../_lib/server.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const sb = supabaseAdmin();
  const adminUser = await getAuthUser(req, sb);
  if (!adminUser) return fail(res, 401, 'ERR_UNAUTH', 'Não autenticado');

  const { data: profile } = await sb.from('users').select('role').eq('id', adminUser.id).single();
  if (profile?.role !== 'admin') return fail(res, 403, 'ERR_FORBIDDEN', 'Acesso negado');

  const targetId = req.query.id;
  if (!targetId) return fail(res, 400, 'ERR_MISSING_ID', 'ID do usuário ausente');

  const { acesso_manual, acesso_manual_obs } = req.body || {};
  if (typeof acesso_manual !== 'boolean') {
    return fail(res, 400, 'ERR_INVALID', 'acesso_manual deve ser boolean');
  }

  const { data, error } = await sb
    .from('subscriptions')
    .update({
      acesso_manual,
      acesso_manual_obs: acesso_manual ? (acesso_manual_obs || '') : null,
    })
    .eq('user_id', targetId)
    .select()
    .single();

  if (error) return fail(res, 500, 'ERR_DB', error.message);
  return ok(res, { updated: data });
}
