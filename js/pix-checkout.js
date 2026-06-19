// js/pix-checkout.js — modal de checkout PIX (Mercado Pago)

(function () {
  let _pollingTimer = null;
  let _countdownTimer = null;

  // ── Injeta HTML do modal na página ───────────────────────────────────────────
  function injetarModal() {
    if (document.getElementById('pix-modal')) return;
    const el = document.createElement('div');
    el.innerHTML = `
      <div id="pix-modal" class="pix-modal hidden" role="dialog" aria-modal="true" aria-label="Pagamento PIX">
        <div class="pix-modal-box">
          <button class="pix-modal-close" id="pix-fechar" type="button" aria-label="Fechar">✕</button>

          <!-- Estado: gerando -->
          <div id="pix-state-loading" class="pix-state">
            <div class="pix-spinner"></div>
            <p>Gerando código PIX…</p>
          </div>

          <!-- Estado: aguardando pagamento -->
          <div id="pix-state-pendente" class="pix-state hidden">
            <div class="pix-header">
              <span class="pix-badge">PIX</span>
              <div>
                <h2 id="pix-titulo" class="pix-titulo"></h2>
                <p id="pix-valor" class="pix-valor"></p>
              </div>
            </div>

            <p class="pix-instrucao">Escaneie o QR Code ou copie o código abaixo</p>

            <div class="pix-qr-wrap">
              <img id="pix-qr-img" src="" alt="QR Code PIX" class="pix-qr-img" />
            </div>

            <div class="pix-copy-wrap">
              <input id="pix-codigo" class="pix-codigo-input" type="text" readonly />
              <button id="pix-copiar" class="btn primary" type="button">Copiar</button>
            </div>
            <p id="pix-copy-ok" class="pix-copy-ok hidden">✓ Código copiado!</p>

            <div class="pix-footer">
              <span class="pix-timer-label">Expira em</span>
              <span id="pix-countdown" class="pix-countdown">30:00</span>
              <span class="pix-aguardando">Aguardando pagamento…</span>
            </div>
          </div>

          <!-- Estado: aprovado -->
          <div id="pix-state-aprovado" class="pix-state hidden">
            <div class="pix-success-icon">✓</div>
            <h2>Pagamento confirmado!</h2>
            <p>Seu acesso está sendo ativado. Aguarde…</p>
          </div>

          <!-- Estado: expirado/falha -->
          <div id="pix-state-erro" class="pix-state hidden">
            <div class="pix-error-icon">✕</div>
            <h2 id="pix-erro-titulo">Pagamento não confirmado</h2>
            <p id="pix-erro-msg">O código PIX expirou. Tente novamente.</p>
            <button id="pix-tentar-novamente" class="btn primary" type="button">Tentar novamente</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el.firstElementChild);

    document.getElementById('pix-fechar').addEventListener('click', fecharModal);
    document.getElementById('pix-copiar').addEventListener('click', copiarCodigo);
    document.getElementById('pix-tentar-novamente').addEventListener('click', function () {
      if (window._pixPlanoAtual) abrirPixCheckout(window._pixPlanoAtual);
    });
    document.getElementById('pix-modal').addEventListener('click', function (e) {
      if (e.target === this) fecharModal();
    });
  }

  // ── Exibição de estados ───────────────────────────────────────────────────────
  function mostrarEstado(estado) {
    ['loading', 'pendente', 'aprovado', 'erro'].forEach(function (s) {
      document.getElementById('pix-state-' + s).classList.toggle('hidden', s !== estado);
    });
  }

  function fecharModal() {
    pararTimers();
    document.getElementById('pix-modal').classList.add('hidden');
  }

  function pararTimers() {
    if (_pollingTimer)   { clearInterval(_pollingTimer);   _pollingTimer   = null; }
    if (_countdownTimer) { clearInterval(_countdownTimer); _countdownTimer = null; }
  }

  // ── Copia o código PIX ────────────────────────────────────────────────────────
  function copiarCodigo() {
    const input = document.getElementById('pix-codigo');
    navigator.clipboard.writeText(input.value).then(function () {
      const ok = document.getElementById('pix-copy-ok');
      ok.classList.remove('hidden');
      setTimeout(function () { ok.classList.add('hidden'); }, 3000);
    });
  }

  // ── Countdown ─────────────────────────────────────────────────────────────────
  function iniciarCountdown(segundos) {
    let restantes = segundos;
    atualizarCountdown(restantes);
    _countdownTimer = setInterval(function () {
      restantes -= 1;
      atualizarCountdown(restantes);
      if (restantes <= 0) {
        pararTimers();
        mostrarEstado('erro');
        document.getElementById('pix-erro-titulo').textContent = 'Código PIX expirado';
        document.getElementById('pix-erro-msg').textContent = 'O tempo de pagamento encerrou. Gere um novo código.';
      }
    }, 1000);
  }

  function atualizarCountdown(seg) {
    const m = String(Math.floor(seg / 60)).padStart(2, '0');
    const s = String(seg % 60).padStart(2, '0');
    const el = document.getElementById('pix-countdown');
    if (el) el.textContent = m + ':' + s;
  }

  // ── Polling de status ─────────────────────────────────────────────────────────
  function iniciarPolling(paymentId) {
    _pollingTimer = setInterval(async function () {
      try {
        const session = await _supabase.auth.getSession().then(function (r) { return r.data.session; });
        const res = await fetch('/api/v1/checkout/pix-status/' + paymentId, {
          headers: session ? { Authorization: 'Bearer ' + session.access_token } : {},
        });
        const { data } = await res.json();
        if (data?.status === 'approved') {
          pararTimers();
          mostrarEstado('aprovado');
          setTimeout(function () { window.location.href = 'simulado.html'; }, 2500);
        } else if (data?.status === 'cancelled' || data?.status === 'rejected') {
          pararTimers();
          mostrarEstado('erro');
          document.getElementById('pix-erro-titulo').textContent = 'Pagamento recusado';
          document.getElementById('pix-erro-msg').textContent = 'O pagamento foi cancelado ou recusado. Tente novamente.';
        }
      } catch (_) { /* retry silencioso */ }
    }, 5000);
  }

  // ── API principal ─────────────────────────────────────────────────────────────
  window.abrirPixCheckout = async function (plano) {
    injetarModal();
    pararTimers();
    window._pixPlanoAtual = plano;

    const modal = document.getElementById('pix-modal');
    modal.classList.remove('hidden');
    mostrarEstado('loading');

    try {
      const session = await _supabase.auth.getSession().then(function (r) { return r.data.session; });
      if (!session) { fecharModal(); return; }

      const res = await fetch('/api/v1/checkout/pix', {
        method:  'POST',
        headers: { Authorization: 'Bearer ' + session.access_token, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plano }),
      });
      const { data, error } = await res.json();
      if (error || !data?.qr_code) throw new Error(error?.message || 'Erro ao gerar PIX');

      // Preenche UI
      const nomes = { mensal: 'Plano Mensal', trimestral: 'Plano Trimestral', semestral: 'Plano Semestral' };
      document.getElementById('pix-titulo').textContent = nomes[plano] || plano;
      document.getElementById('pix-valor').textContent  = 'R$ ' + data.valor.toFixed(2).replace('.', ',');
      document.getElementById('pix-qr-img').src         = 'data:image/png;base64,' + data.qr_code_base64;
      document.getElementById('pix-codigo').value       = data.qr_code;
      document.getElementById('pix-copy-ok').classList.add('hidden');

      mostrarEstado('pendente');
      iniciarCountdown(30 * 60);
      iniciarPolling(data.id);
    } catch (e) {
      mostrarEstado('erro');
      document.getElementById('pix-erro-titulo').textContent = 'Erro ao gerar PIX';
      document.getElementById('pix-erro-msg').textContent    = e.message || 'Tente novamente.';
    }
  };
})();
