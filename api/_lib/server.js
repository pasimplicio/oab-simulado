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
