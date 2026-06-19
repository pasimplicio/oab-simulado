// js/auth.js — autenticação via Supabase + gate de acesso por assinatura

// ─── Sessão ───────────────────────────────────────────────────────────────────
async function getSession() {
  const { data: { session } } = await _supabase.auth.getSession();
  return session;
}

async function getUser() {
  const session = await getSession();
  return session ? session.user : null;
}

// ─── Check de acesso (chama API — decisão no servidor) ───────────────────────
async function checkAccess() {
  const session = await getSession();
  if (!session) return { hasAccess: false, reason: 'not_logged_in' };

  const res = await fetch('/api/v1/user/me', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return { hasAccess: false, reason: 'api_error' };
  const { data, error } = await res.json();
  if (error || !data) return { hasAccess: false, reason: 'api_error' };
  return data;
}

// ─── Login / Logout ──────────────────────────────────────────────────────────
async function loginWithGoogle(redirectTo) {
  const { error } = await _supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || (window.location.origin + '/index.html'),
    },
  });
  if (error) console.error('[auth] login error:', error.message);
}

async function logoutUser() {
  await _supabase.auth.signOut();
  window.location.href = 'index.html';
}

// ─── Guard para simulado.html ─────────────────────────────────────────────────
// Retorna true se acesso liberado; redireciona e retorna false caso contrário.
async function requireAccess() {
  const result = await checkAccess();
  if (!result.hasAccess) {
    const reason = result.reason === 'not_logged_in' ? 'login=1' : 'sem-acesso=1';
    window.location.replace('index.html?' + reason);
    return false;
  }
  return true;
}
