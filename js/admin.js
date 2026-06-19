// js/admin.js — lógica do painel administrativo

let _token = null;
let _users  = [];
let _editingId = null;

// ─── Bootstrap ───────────────────────────────────────────────────────────────
(async function init() {
  const session = await _supabase.auth.getSession().then(r => r.data.session);
  if (!session) return redirect('index.html?login=1');
  _token = session.access_token;

  const res  = await apiFetch('/api/v1/user/me');
  if (!res?.data || res.data.role !== 'admin') return redirect('index.html');

  populateAdminHeader(res.data);
  await Promise.all([loadMetrics(), loadUsers()]);
  document.getElementById('admin-app').style.display = '';
  document.getElementById('admin-loading').style.display = 'none';
})();

// ─── API helper ──────────────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const r = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${_token}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  return r.json();
}

function redirect(url) {
  window.location.replace(url);
}

// ─── Header ──────────────────────────────────────────────────────────────────
function populateAdminHeader(user) {
  const av = document.getElementById('admin-avatar');
  const nm = document.getElementById('admin-nome');
  if (av) av.src = user.picture || '';
  if (nm) nm.textContent = user.name?.split(' ')[0] || user.email;
}

// ─── Métricas ────────────────────────────────────────────────────────────────
async function loadMetrics() {
  const res = await apiFetch('/api/v1/admin/metrics');
  if (!res?.data) return;
  const m = res.data;
  setText('m-total',     m.total_usuarios);
  setText('m-ativos',    m.assinaturas_ativas);
  setText('m-manual',    m.acesso_manual);
  setText('m-mrr',       `R$ ${m.mrr_estimado.toFixed(2).replace('.', ',')}`);
  setText('m-simulados', m.simulados_realizados);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ─── Usuários ────────────────────────────────────────────────────────────────
async function loadUsers(page = 1) {
  const search = document.getElementById('search-email')?.value || '';
  const status = document.getElementById('filter-status')?.value || 'all';
  const params = new URLSearchParams({ page, limit: 50, q: search, status });
  const res    = await apiFetch(`/api/v1/admin/users?${params}`);
  if (!res?.data) return;
  _users = res.data.users;
  renderUsers(_users);
}

function renderUsers(users) {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">Nenhum usuário encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => {
    const sub   = u.subscription;
    const badge = statusBadge(sub);
    const manual = sub?.acesso_manual;
    return `
      <tr>
        <td>
          <div class="admin-user-cell">
            ${u.picture ? `<img src="${u.picture}" class="user-avatar" alt="" />` : '<span class="user-avatar-placeholder">?</span>'}
            <div>
              <div class="admin-user-name">${esc(u.name || '—')}</div>
              <div class="admin-user-email">${esc(u.email)}</div>
            </div>
          </div>
        </td>
        <td>${sub?.plano ? cap(sub.plano) : '—'}</td>
        <td>${badge}</td>
        <td>
          <label class="toggle-switch" title="${manual ? 'Revogar acesso manual' : 'Liberar acesso manual'}">
            <input type="checkbox" ${manual ? 'checked' : ''} onchange="abrirModalAcesso('${u.id}', ${!manual})" />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </td>
        <td class="admin-obs">${sub?.acesso_manual_obs ? esc(sub.acesso_manual_obs) : ''}</td>
        <td class="admin-date">${formatDate(u.since)}</td>
      </tr>`;
  }).join('');
}

function statusBadge(sub) {
  if (!sub) return '<span class="badge badge-none">Sem plano</span>';
  if (sub.acesso_manual) return '<span class="badge badge-manual">Manual</span>';
  const map = {
    active:    '<span class="badge badge-active">Ativo</span>',
    trialing:  '<span class="badge badge-active">Trial</span>',
    canceled:  '<span class="badge badge-canceled">Cancelado</span>',
    past_due:  '<span class="badge badge-due">Inadimplente</span>',
    none:      '<span class="badge badge-none">Sem plano</span>',
  };
  return map[sub.status] || `<span class="badge badge-none">${sub.status}</span>`;
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

// ─── Modal de acesso manual ──────────────────────────────────────────────────
function abrirModalAcesso(userId, novoValor) {
  _editingId = userId;
  const user = _users.find(u => u.id === userId);
  const modal = document.getElementById('modal-acesso');
  document.getElementById('modal-acesso-titulo').textContent =
    novoValor ? 'Liberar acesso manual' : 'Revogar acesso manual';
  document.getElementById('modal-acesso-desc').textContent =
    novoValor
      ? `Liberar acesso a ${esc(user?.email || userId)} sem assinatura paga.`
      : `Revogar acesso manual de ${esc(user?.email || userId)}.`;
  const obsField = document.getElementById('modal-obs-wrapper');
  if (obsField) obsField.style.display = novoValor ? '' : 'none';
  document.getElementById('modal-obs').value = user?.subscription?.acesso_manual_obs || '';
  modal.dataset.novoValor = novoValor ? '1' : '0';
  modal.classList.remove('hidden');
}

function fecharModalAcesso() {
  document.getElementById('modal-acesso').classList.add('hidden');
  _editingId = null;
  loadUsers();
}

async function confirmarAcesso() {
  if (!_editingId) return;
  const novoValor = document.getElementById('modal-acesso').dataset.novoValor === '1';
  const obs       = document.getElementById('modal-obs').value.trim();

  const res = await apiFetch(`/api/v1/admin/users/${_editingId}/access`, {
    method: 'PATCH',
    body: JSON.stringify({ acesso_manual: novoValor, acesso_manual_obs: obs }),
  });

  if (res?.error) {
    alert('Erro: ' + res.error.message);
  } else {
    fecharModalAcesso();
    await Promise.all([loadMetrics(), loadUsers()]);
  }
}

// ─── Filtros e busca ─────────────────────────────────────────────────────────
function setupFiltros() {
  document.getElementById('search-email')?.addEventListener('input', debounce(() => loadUsers(), 400));
  document.getElementById('filter-status')?.addEventListener('change', () => loadUsers());
  document.getElementById('btn-refresh')?.addEventListener('click', () => loadUsers());
  document.getElementById('modal-acesso-cancelar')?.addEventListener('click', fecharModalAcesso);
  document.getElementById('modal-acesso-confirmar')?.addEventListener('click', confirmarAcesso);
  document.getElementById('modal-acesso')?.addEventListener('click', e => { if (e.target === e.currentTarget) fecharModalAcesso(); });
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

document.addEventListener('DOMContentLoaded', setupFiltros);
