/**
 * Amostra grátis (isca) — mini-simulado sem login.
 * Mostra APENAS o gabarito (acertou/errou + alternativa correta).
 * O comentário/fundamento é reservado ao acesso pago (upsell).
 * Limite de rodadas grátis controlado por localStorage.
 */
(function () {
  "use strict";

  const N = 5;          // questões por rodada
  const LIMITE = 3;     // rodadas grátis permitidas
  const ROUNDS_KEY = "oab_amostra_rounds";

  // top-level const não vira propriedade de window; acessa como global puro
  const CFG = (typeof SIMULADO_CONFIG !== "undefined") ? SIMULADO_CONFIG : {};
  const BANCO = (typeof QUESTOES !== "undefined") ? QUESTOES : [];
  const letras = CFG.alternativas || ["A", "B", "C", "D"];

  // ── Controle de limite ────────────────────────────────────────────────────
  function getRounds() {
    try { return parseInt(localStorage.getItem(ROUNDS_KEY) || "0", 10) || 0; }
    catch (_) { return 0; }
  }
  function setRounds(n) {
    try { localStorage.setItem(ROUNDS_KEY, String(n)); } catch (_) {}
  }
  function limiteAtingido() { return getRounds() >= LIMITE; }

  // ── Utils ─────────────────────────────────────────────────────────────────
  function embaralhar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function cor(disc) { return (CFG.cores && CFG.cores[disc]) || "#0891b2"; }
  function badge(disc) {
    return `<span class="badge" style="background:${cor(disc)}">${escapeHtml(disc)}</span>`;
  }
  function dificuldadeLabel(d) {
    return { facil: "Fácil", media: "Média", dificil: "Difícil" }[d] || d;
  }

  // Embaralha alternativas e remapeia gabarito (espelha prepararQuestao do app.js)
  function prepararQuestao(q, numero) {
    const pares = letras.map(L => ({ texto: q.alternativas[L], correta: L === q.correta, origem: L }));
    const ordenadas = embaralhar(pares);
    const novasAlt = {};
    let novaCorreta = null;
    ordenadas.forEach((p, i) => {
      const L = letras[i];
      novasAlt[L] = p.texto;
      if (p.correta) novaCorreta = L;
    });
    return {
      numero,
      disciplina: q.disciplina,
      topico: q.topico,
      dificuldade: q.dificuldade,
      enunciado: q.enunciado,
      alternativas: novasAlt,
      correta: novaCorreta,
    };
  }

  function selecionar() {
    const banco = BANCO.filter(
      q => q && q.alternativas && ["A", "B", "C", "D"].includes(q.correta) && q.alternativas[q.correta]
    );
    const porDisc = {};
    embaralhar(banco).forEach(q => { if (!porDisc[q.disciplina]) porDisc[q.disciplina] = q; });
    let escolhidas = embaralhar(Object.values(porDisc)).slice(0, N);
    if (escolhidas.length < N) {
      const resto = embaralhar(banco).filter(q => !escolhidas.includes(q));
      escolhidas = escolhidas.concat(resto.slice(0, N - escolhidas.length));
    }
    return escolhidas.map((q, i) => prepararQuestao(q, i + 1));
  }

  const Estado = { questoes: [], respostas: {}, acertos: 0, contabilizada: false };

  // ── Render ──────────────────────────────────────────────────────────────--
  function renderQuestao(q) {
    const marcada = Estado.respostas[q.numero];
    const revelar = !!marcada;
    const alts = letras.map(L => {
      const selecionada = marcada === L ? "selecionada" : "";
      let estado = "", icone = "";
      if (revelar) {
        if (L === q.correta) {
          estado = "correta";
          icone = '<span class="feedback-icon ok" aria-hidden="true">&#10003;</span>';
        } else if (marcada === L) {
          estado = "incorreta";
          icone = '<span class="feedback-icon no" aria-hidden="true">&#10005;</span>';
        }
      }
      const travada = revelar ? " travada" : "";
      return `
        <li class="alternativa ${selecionada} ${estado}${travada}" data-num="${q.numero}" data-letra="${L}" tabindex="0">
          <span class="letra">${L}</span>
          <span class="texto">${escapeHtml(q.alternativas[L])}</span>
          ${icone}
        </li>`;
    }).join("");

    // Somente o GABARITO — comentário fica reservado ao acesso pago (upsell)
    let gabarito = "";
    if (revelar) {
      const acertou = marcada === q.correta;
      gabarito = `
        <div class="comentario">
          <p class="resultado ${acertou ? "acerto" : "erro"}">
            ${acertou ? "Você acertou" : "Você errou"} — gabarito: <b>${escapeHtml(q.correta)}</b>
          </p>
          <p class="feedback-rapido">🔒 Comentário, fundamento legal e pegadinha da banca disponíveis no acesso completo.</p>
        </div>`;
    }

    return `
      <article class="questao" id="q${q.numero}">
        <header>
          <span class="numero">Questão ${q.numero}</span>
          ${badge(q.disciplina)}
          <span class="topico">${escapeHtml(q.topico)} - ${dificuldadeLabel(q.dificuldade)}</span>
        </header>
        <p class="enunciado">${escapeHtml(q.enunciado)}</p>
        <ul class="alternativas">${alts}</ul>
        ${gabarito}
      </article>`;
  }

  function render() {
    document.getElementById("amostra-lista").innerHTML =
      Estado.questoes.map(renderQuestao).join("");
    atualizarProgresso();
  }

  function responder(num, letra) {
    if (Estado.respostas[num]) return; // já respondida — trava
    const q = Estado.questoes.find(x => x.numero === num);
    if (!q || !q.alternativas[letra]) return;
    Estado.respostas[num] = letra;
    if (letra === q.correta) Estado.acertos++;
    render();
    document.getElementById("q" + num)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function atualizarProgresso() {
    const respondidas = Object.keys(Estado.respostas).length;
    const total = Estado.questoes.length;
    const txt = document.getElementById("amostra-progresso");
    if (txt) txt.textContent = `${respondidas} / ${total} respondidas`;

    if (respondidas < total) return;

    // Rodada concluída — contabiliza uma vez
    if (!Estado.contabilizada) {
      Estado.contabilizada = true;
      setRounds(getRounds() + 1);
    }
    mostrarPaywall(total);
  }

  function mostrarPaywall(total) {
    const paywall = document.getElementById("amostra-paywall");
    const score = document.getElementById("amostra-score");
    const btnRe = document.getElementById("btn-amostra-reiniciar");
    const pct = Math.round((Estado.acertos / total) * 100);

    if (score) score.textContent = `Você acertou ${Estado.acertos} de ${total} (${pct}%).`;

    if (limiteAtingido()) {
      if (btnRe) btnRe.classList.add("hidden");
      const aviso = document.getElementById("amostra-limite");
      if (aviso) {
        aviso.textContent = "Você usou todas as suas amostras grátis. Assine para continuar treinando.";
        aviso.classList.remove("hidden");
      }
    } else {
      const restam = LIMITE - getRounds();
      if (btnRe) {
        btnRe.classList.remove("hidden");
        btnRe.textContent = `Tentar outras questões (${restam} restante${restam !== 1 ? "s" : ""})`;
      }
    }

    if (paywall && paywall.classList.contains("hidden")) {
      paywall.classList.remove("hidden");
      paywall.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function renderBloqueado() {
    const lista = document.getElementById("amostra-lista");
    if (lista) {
      lista.innerHTML = `
        <section class="card" style="text-align:center;">
          <span class="hero-badge">Limite atingido</span>
          <h2>Você já usou suas amostras grátis</h2>
          <p class="lead">
            Esperamos que tenha gostado da prévia! Para continuar treinando com mais de
            <b>2.000 questões</b>, prova completa, cronômetro e correção comentada, é só assinar.
          </p>
        </section>`;
    }
    const paywall = document.getElementById("amostra-paywall");
    const score = document.getElementById("amostra-score");
    const btnRe = document.getElementById("btn-amostra-reiniciar");
    if (score) score.textContent = "Limite de amostras grátis atingido.";
    if (btnRe) btnRe.classList.add("hidden");
    if (paywall) paywall.classList.remove("hidden");
  }

  function novaRodada() {
    Estado.questoes = selecionar();
    Estado.respostas = {};
    Estado.acertos = 0;
    Estado.contabilizada = false;
    document.getElementById("amostra-paywall")?.classList.add("hidden");
    render();
  }

  function init() {
    // Botões fixos sempre conectados
    document.getElementById("btn-amostra-reiniciar")?.addEventListener("click", () => {
      if (limiteAtingido()) { renderBloqueado(); return; }
      novaRodada();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    if (limiteAtingido()) {
      renderBloqueado();
      return;
    }

    document.getElementById("amostra-lista").addEventListener("click", e => {
      const li = e.target.closest(".alternativa");
      if (!li) return;
      responder(Number(li.dataset.num), li.dataset.letra);
    });

    novaRodada();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
