// Google OAuth 2.0 Client ID
// Configure em: https://console.cloud.google.com/apis/credentials
// Adicione sua origem Vercel em "Authorized JavaScript origins"
const GOOGLE_CLIENT_ID = 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';

const AUTH_KEY = 'oab_auth_user';

function getUser() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)); } catch (e) { return null; }
}

function setUser(u) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(u));
}

function logoutUser() {
  sessionStorage.removeItem(AUTH_KEY);
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  window.location.href = 'index.html';
}

// Callback do Google Identity Services após login bem-sucedido
function handleCredentialResponse(response) {
  const raw = response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(raw));
  setUser({ name: payload.name, email: payload.email, picture: payload.picture });
  window.location.href = 'simulado.html';
}

function initGoogleAuth(btnContainerId) {
  if (!window.google || !google.accounts) return;
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  if (btnContainerId) {
    google.accounts.id.renderButton(
      document.getElementById(btnContainerId),
      { theme: 'outline', size: 'large', text: 'signin_with', width: 280, locale: 'pt-BR' }
    );
  }
}

function requireAuth() {
  if (!getUser()) {
    window.location.replace('index.html?login=1');
  }
}
