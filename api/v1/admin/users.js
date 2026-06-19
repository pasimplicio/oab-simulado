// GET /api/v1/admin/users — lista usuários com assinatura (admin only)
import { supabaseAdmin, setCors, ok, fail, getAuthUser } from '../../_lib/server.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const sb = supabaseAdmin();
  const user = await getAuthUser(req, sb);
  if (!user) return fail(res, 401, 'ERR_UNAUTH', 'Não autenticado');

  const { data: profile } = await sb.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return fail(res, 403, 'ERR_FORBIDDEN', 'Acesso negado');

  const page  = Math.max(1, parseInt(req.query.page  || '1'));
  const limit = Math.min(100, parseInt(req.query.limit || '50'));
  const search = (req.query.q || '').trim();
  const status = req.query.status || 'all';

  let query = sb
    .from('users')
    .select(`
      id, email, name, picture, role, created_at,
      subscriptions (plano, status, acesso_manual, acesso_manual_obs, valido_ate, stripe_customer_id)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search) query = query.ilike('email', `%${search}%`);

  const { data, error, count } = await query;
  if (error) return fail(res, 500, 'ERR_DB', error.message);

  // Filtro por status de assinatura (feito em memória pois vem de relação)
  const filtered = status === 'all' ? data : data.filter(u => {
    const sub = u.subscriptions?.[0];
    if (status === 'active')  return sub?.status === 'active' && !sub?.acesso_manual;
    if (status === 'manual')  return sub?.acesso_manual === true;
    if (status === 'expired') return sub?.status !== 'active' && !sub?.acesso_manual;
    return true;
  });

  return ok(res, {
    users: filtered.map(u => ({
      id:      u.id,
      email:   u.email,
      name:    u.name,
      picture: u.picture,
      role:    u.role,
      since:   u.created_at,
      subscription: u.subscriptions?.[0] || null,
    })),
    meta: { total: count, page, limit },
  });
}
