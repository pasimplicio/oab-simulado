// GET /api/v1/admin/metrics — métricas financeiras e de usuários (admin only)
import { supabaseAdmin, setCors, ok, fail, getAuthUser } from '../../_lib/server.js';

const PRECO = { mensal: 19.9, trimestral: 39.9, semestral: 69.9 };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return fail(res, 405, 'ERR_METHOD', 'Método não permitido');

  const sb = supabaseAdmin();
  const user = await getAuthUser(req, sb);
  if (!user) return fail(res, 401, 'ERR_UNAUTH', 'Não autenticado');

  const { data: profile } = await sb.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return fail(res, 403, 'ERR_FORBIDDEN', 'Acesso negado');

  const [usersRes, subsRes, sessionsRes] = await Promise.all([
    sb.from('users').select('id', { count: 'exact', head: true }),
    sb.from('subscriptions').select('status, plano, acesso_manual, valido_ate'),
    sb.from('simulado_sessions').select('id', { count: 'exact', head: true }),
  ]);

  const subs = subsRes.data || [];
  const now  = new Date();

  const ativos   = subs.filter(s => s.status === 'active' && s.valido_ate && new Date(s.valido_ate) > now);
  const manual   = subs.filter(s => s.acesso_manual);
  const expirado = subs.filter(s => s.status === 'canceled' || (s.status !== 'active' && !s.acesso_manual));

  const mrr = ativos.reduce((sum, s) => {
    const p = PRECO[s.plano] || 0;
    if (s.plano === 'trimestral') return sum + p / 3;
    if (s.plano === 'semestral')  return sum + p / 6;
    return sum + p;
  }, 0);

  return ok(res, {
    total_usuarios:      usersRes.count || 0,
    assinaturas_ativas:  ativos.length,
    acesso_manual:       manual.length,
    expirados:           expirado.length,
    simulados_realizados: sessionsRes.count || 0,
    mrr_estimado:        Math.round(mrr * 100) / 100,
  });
}
