// GET /api/v1/ping — keep-alive do Supabase.
// Chamado pelo Vercel Cron diariamente: faz uma query trivial no banco para
// registrar atividade e impedir que o projeto (plano Free) seja pausado por inatividade.
import { supabaseAdmin, setCors } from '../_lib/server.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Se CRON_SECRET estiver configurado, exige o header que a Vercel Cron envia.
  // (Vercel injeta automaticamente "Authorization: Bearer <CRON_SECRET>" nas chamadas de cron.)
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ data: null, error: { code: 'ERR_UNAUTH', message: 'Não autorizado' } });
    }
  }

  try {
    const sb = supabaseAdmin();
    // Query mínima só para tocar o banco e resetar o contador de inatividade.
    const { error } = await sb.from('users').select('id').limit(1);
    if (error) throw error;
    return res.status(200).json({ data: { ok: true, ts: new Date().toISOString() }, error: null });
  } catch (e) {
    return res.status(500).json({ data: null, error: { code: 'ERR_PING', message: e.message } });
  }
}
