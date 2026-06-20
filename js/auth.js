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

// Espera a sessão hidratar do localStorage (no celular pode demorar alguns
// instantes após abrir/voltar para a aba).
async function getSessionResiliente(tentativas = 16, intervalo = 200) {
  for (let i = 0; i < tentativas; i++) {
    const { data } = await _supabase.auth.getSession();
    if (data.session) return data.session;
    await new Promise(r => setTimeout(r, intervalo));
  }
  return null;
}

// ─── Check de acesso (chama API — decisão no servidor) ───────────────────────
async function checkAccess() {
  let session = await getSessionResiliente();
  if (!session) return { hasAccess: false, reason: 'not_logged_in' };

  for (let tentativa = 0; tentativa < 3; tentativa++) {
    try {
      const res = await fetch('/api/v1/user/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      // 401 = token expirado. Comum no celular ao voltar do background, quando
      // o auto-refresh ainda não rodou. Força o refresh e tenta de novo —
      // NUNCA tratar isso como "sem assinatura" (mandava o assinante p/ planos).
      if (res.status === 401) {
        const { data } = await _supabase.auth.refreshSession();
        if (data?.session) { session = data.session; continue; }
        return { hasAccess: false, reason: 'not_logged_in' };
      }

      if (res.ok) {
        const { data, error } = await res.json();
        if (!error && data) return data;
      }
    } catch (_) { /* rede instável — re-tenta */ }
    await new Promise(r => setTimeout(r, 600));
  }
  // Não foi possível confirmar (rede/servidor). Não é "sem acesso".
  return { hasAccess: false, reason: 'api_error' };
}

// ─── Login / Logout ──────────────────────────────────────────────────────────
async function loginWithGoogle() {
  const { data, error } = await _supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth-callback',
      skipBrowserRedirect: true,
    },
  });
  if (error) throw new Error(error.message);

  const left = Math.round((screen.width  - 500) / 2);
  const top  = Math.round((screen.height - 650) / 2);
  const popup = window.open(
    data.url, 'oab-login',
    `width=500,height=650,left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
  if (!popup) throw new Error('Popup bloqueado. Permita popups para este site e tente novamente.');

  return new Promise((resolve) => {
    let done = false;

    const finish = async (popupJaFechado) => {
      if (done) return;
      done = true;
      sub.unsubscribe();
      clearInterval(poll);
      if (!popupJaFechado && !popup.closed) popup.close();
      // A sessão pode levar um instante para hidratar do localStorage após o popup
      let session = null;
      for (let i = 0; i < 8; i++) {
        session = (await _supabase.auth.getSession()).data.session;
        if (session) break;
        await new Promise(r => setTimeout(r, 250));
      }
      resolve(session);
    };

    const { data: { subscription: sub } } = _supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) finish(false);
    });

    const poll = setInterval(() => { if (popup.closed) finish(true); }, 500);
  });
}

async function logoutUser() {
  await _supabase.auth.signOut();
  window.location.href = '/';
}

// ─── Login / Cadastro por e-mail e senha ──────────────────────────────────────
async function loginWithEmail(email, senha) {
  const { data, error } = await _supabase.auth.signInWithPassword({
    email: (email || '').trim(),
    password: senha,
  });
  if (error) throw error;
  return data.session;
}

async function signUpWithEmail(nome, email, senha) {
  const { data, error } = await _supabase.auth.signUp({
    email: (email || '').trim(),
    password: senha,
    options: { data: { full_name: (nome || '').trim() } },
  });
  if (error) throw error;
  // Com "Confirm email" desligado, a sessão já vem pronta (acesso imediato).
  // Se estiver ligado, session vem null → o chamador trata pedindo confirmação.
  return data.session;
}

// Envia o e-mail de recuperação de senha (link leva para /redefinir-senha)
async function resetPassword(email) {
  const { error } = await _supabase.auth.resetPasswordForEmail((email || '').trim(), {
    redirectTo: window.location.origin + '/redefinir-senha',
  });
  if (error) throw error;
}

// Define a nova senha (chamado na página /redefinir-senha, dentro da sessão de recovery)
async function atualizarSenha(novaSenha) {
  const { error } = await _supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
}

// Gera um avatar (data URI SVG) com as iniciais do nome — usado quando o
// usuário entrou por e-mail/senha e não tem foto de perfil (Google).
function avatarIniciais(nome, email) {
  const base = ((nome || '').trim() || (email || '').trim() || '?');
  const partes = base.split(/\s+/).filter(Boolean);
  let ini = (partes[0] ? partes[0][0] : '') + (partes.length > 1 ? partes[partes.length - 1][0] : '');
  ini = (ini || base[0] || '?').toUpperCase();
  let h = 0;
  for (let i = 0; i < base.length; i++) h = base.charCodeAt(i) + ((h << 5) - h);
  const bg = `hsl(${Math.abs(h) % 360}, 60%, 45%)`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" fill="${bg}"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#fff" ` +
    `font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="28" font-weight="700">${ini}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Traduz mensagens de erro do Supabase para PT-BR amigável
function traduzirErroAuth(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('invalid login credentials'))        return 'E-mail ou senha incorretos.';
  if (m.includes('user already registered') ||
      m.includes('already been registered'))          return 'Este e-mail já está cadastrado. Faça login.';
  if (m.includes('password should be at least'))      return 'A senha deve ter pelo menos 6 caracteres.';
  if (m.includes('unable to validate email') ||
      m.includes('invalid email'))                    return 'E-mail inválido.';
  if (m.includes('email not confirmed'))              return 'Confirme seu e-mail antes de entrar.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Aguarde um instante e tente novamente.';
  if (m.includes('network') || m.includes('failed to fetch')) return 'Falha de conexão. Verifique sua internet.';
  return msg || 'Não foi possível concluir. Tente novamente.';
}

// ─── Guard para simulado.html ─────────────────────────────────────────────────
// Retorna true se acesso liberado; redireciona e retorna false caso contrário.
async function requireAccess() {
  const result = await checkAccess();
  if (!result.hasAccess) {
    const reason = result.reason === 'not_logged_in' ? 'login=1' : 'sem-acesso=1';
    window.location.replace('/?' + reason);
    return false;
  }
  return true;
}
