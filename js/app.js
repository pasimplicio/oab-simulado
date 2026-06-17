/**
 * Motor do Simulado OAB (estilo FGV) — geração, aplicação e correção.
 * Depende de config.js (SIMULADO_CONFIG) e questions.js (QUESTOES).
 */

/* ─── Normalização de disciplinas ─────────────────────────────────────────
 * O banco scraped (QUESTOES_OAB) usa nomes sem acentos.
 * O config usa nomes canônicos com acentos. Esta tabela faz a conversão.
 */
const DISC_NORM = {
  "Etica Profissional":                  "Ética Profissional",
  "Direito Tributario":                  "Direito Tributário",
  "Direito Previdenciario":              "Direito Previdenciário",
  "Direito da Crianca e do Adolescente": "Direito da Criança e do Adolescente",
};
function normDisc(d) { return DISC_NORM[d] || d; }

/* ─── Banco unificado ──────────────────────────────────────────────────── */
function bancoCompleto() {
  const base = (typeof QUESTOES !== "undefined" && Array.isArray(QUESTOES)) ? QUESTOES : [];
  const oab  = (typeof QUESTOES_OAB !== "undefined" && Array.isArray(QUESTOES_OAB))
    ? QUESTOES_OAB.map(q => ({
        ...q,
        disciplina: normDisc(q.disciplina),
        topico: normDisc(q.topico || q.disciplina),
      }))
    : [];
  return [...base, ...oab];
}

/* ─── Utilitários ──────────────────────────────────────────────────────── */
function embaralhar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function questoesPorDisciplina() {
  const mapa = {};
  bancoCompleto().forEach(q => {
    (mapa[q.disciplina] = mapa[q.disciplina] || []).push(q);
  });
  return mapa;
}

function gerarSimulado(total = SIMULADO_CONFIG.totalQuestoes) {
  const porDisc = questoesPorDisciplina();
  const selecionadas = [];
  const usados = new Set();

  SIMULADO_CONFIG.distribuicao.forEach(({ disciplina, peso }) => {
    const pool = embaralhar(porDisc[disciplina] || []);
    pool.slice(0, peso).forEach(q => { selecionadas.push(q); usados.add(q.id); });
  });

  if (selecionadas.length < total) {
    const resto = embaralhar(bancoCompleto().filter(q => !usados.has(q.id)));
    for (const q of resto) {
      if (selecionadas.length >= total) break;
      selecionadas.push(q); usados.add(q.id);
    }
  }

  const ordemDisc = {};
  SIMULADO_CONFIG.distribuicao.forEach((d, i) => (ordemDisc[d.disciplina] = i));
  selecionadas.sort((a, b) => (ordemDisc[a.disciplina] ?? 99) - (ordemDisc[b.disciplina] ?? 99));

  return selecionadas.slice(0, total).map((q, idx) => prepararQuestao(q, idx + 1));
}

function prepararQuestao(q, numero) {
  const letras = SIMULADO_CONFIG.alternativas;
  const pares = letras.map(L => ({ texto: q.alternativas[L], correta: L === q.correta, origem: L }));
  const embaralhadas = embaralhar(pares);
  const novasAlt = {};
  let novaCorreta = null;
  const mapaComentario = {};
  embaralhadas.forEach((p, i) => {
    const L = letras[i];
    novasAlt[L] = p.texto;
    mapaComentario[L] = q.comentario ? (q.comentario[p.origem] || "") : "";
    if (p.correta) novaCorreta = L;
  });
  return {
    numero,
    id: q.id,
    disciplina: q.disciplina,
    topico: q.topico,
    dificuldade: q.dificuldade,
    enunciado: q.enunciado,
    alternativas: novasAlt,
    correta: novaCorreta,
    fundamento: q.fundamento || "",
    comentario: mapaComentario,
    pegadinha: q.pegadinha || null,
  };
}

/* ─── Estado ──────────────────────────────────────────────────────────── */
const Estado = {
  questoes: [],
  respostas: {},
  revisao: new Set(),
  modoProva: false,
  atual: 0,
  finalizado: false,
  inicio: null,
  cronInterval: null,
  tempoRestante: 0,
};

/* ─── Cronômetro ──────────────────────────────────────────────────────── */
function formatarTempo(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(seg).padStart(2,"0")}`;
}

function iniciarCronometro() {
  Estado.tempoRestante = SIMULADO_CONFIG.duracaoMinutos * 60;
  const el = $("#cronometro");
  if (el) el.textContent = formatarTempo(Estado.tempoRestante);
  clearInterval(Estado.cronInterval);
  Estado.cronInterval = setInterval(() => {
    Estado.tempoRestante--;
    const cel = $("#cronometro");
    if (cel) {
      cel.textContent = formatarTempo(Estado.tempoRestante);
      cel.className = "cronometro";
      if (Estado.tempoRestante <= 300)       cel.classList.add("critico");
      else if (Estado.tempoRestante <= 1800) cel.classList.add("atencao");
    }
    if (Estado.tempoRestante === 1800) alert("⏱ Atenção: faltam 30 minutos para o fim da prova!");
    if (Estado.tempoRestante === 300)  alert("⚠️ Atenção: faltam apenas 5 minutos!");
    if (Estado.tempoRestante <= 0) { clearInterval(Estado.cronInterval); if (!Estado.finalizado) finalizar(); }
  }, 1000);
}

function pararCronometro() {
  clearInterval(Estado.cronInterval);
  Estado.cronInterval = null;
}

/* ─── Minimapa ────────────────────────────────────────────────────────── */
function renderMinimapa() {
  const cont = $("#minimapa");
  if (!cont) return;
  cont.innerHTML = Estado.questoes
    .map(q => `<span class="dot dot-vazio" data-num="${q.numero}" title="Q${q.numero} · ${q.disciplina}"></span>`)
    .join("");
  cont.querySelectorAll(".dot").forEach(dot => {
    dot.addEventListener("click", () => {
      const num = Number(dot.dataset.num);
      if (Estado.modoProva && !Estado.finalizado) {
        Estado.atual = num - 1;
        renderModoProva();
        window.scrollTo(0, 0);
      } else {
        const el = document.getElementById(`q${num}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function atualizarMinimapa() {
  const cont = $("#minimapa");
  if (!cont) return;
  Estado.questoes.forEach(q => {
    const dot = cont.querySelector(`[data-num="${q.numero}"]`);
    if (!dot) return;
    const resp = Estado.respostas[q.numero];
    dot.className = "dot";
    if (Estado.finalizado) {
      if (!resp)               dot.classList.add("dot-branco");
      else if (resp === q.correta) dot.classList.add("dot-correta");
      else                     dot.classList.add("dot-errada");
    } else {
      dot.classList.add(resp ? "dot-resp" : "dot-vazio");
    }
    if (Estado.revisao.has(q.numero))                     dot.classList.add("dot-flag");
    if (Estado.modoProva && Estado.atual === q.numero - 1) dot.classList.add("dot-atual");
  });
}

/* ─── Renderização ────────────────────────────────────────────────────── */
const $ = sel => document.querySelector(sel);
const cor = disc => SIMULADO_CONFIG.cores[disc] || "#475569";

function badge(disc) {
  return `<span class="badge" style="background:${cor(disc)}">${disc}</span>`;
}

function dificuldadeLabel(d) {
  return { facil: "Fácil", media: "Média", dificil: "Difícil" }[d] || d;
}

function renderQuestao(q, opts = {}) {
  const { revelar = false } = opts;
  const letras = SIMULADO_CONFIG.alternativas;
  const marcada = Estado.respostas[q.numero];
  const flagAtivo = Estado.revisao.has(q.numero);

  const alts = letras.map(L => {
    const sel = marcada === L ? "selecionada" : "";
    let estado = "";
    if (revelar) {
      if (L === q.correta)   estado = "correta";
      else if (marcada === L) estado = "incorreta";
    }
    const travada = (revelar && marcada) ? " travada" : "";
    return `
      <li class="alternativa ${sel} ${estado}${travada}" data-num="${q.numero}" data-letra="${L}">
        <span class="letra">${L}</span>
        <span class="texto">${q.alternativas[L]}</span>
      </li>`;
  }).join("");

  let comentario = "";
  if (revelar) {
    const acertou = marcada === q.correta;
    const temComentario = q.comentario && Object.values(q.comentario).some(Boolean);
    const itens = temComentario
      ? letras.map(L => `<li class="${L === q.correta ? "ok" : "no"}"><b>${L})</b> ${q.comentario[L]}</li>`).join("")
      : "";
    comentario = `
      <div class="comentario">
        <p class="resultado ${acertou ? "acerto" : marcada ? "erro" : "branco"}">
          ${acertou ? "✓ Você acertou" : marcada ? "✗ Você errou" : "○ Em branco"} —
          gabarito: <b>${q.correta}</b>
        </p>
        ${q.fundamento ? `<p class="fundamento"><b>Fundamento:</b> ${q.fundamento}</p>` : ""}
        ${temComentario ? `<ul class="distratores">${itens}</ul>` : ""}
        ${q.pegadinha ? `<p class="pegadinha"><b>Pegadinha da banca:</b> ${q.pegadinha}</p>` : ""}
      </div>`;
  }

  return `
    <article class="questao" id="q${q.numero}">
      <header>
        <span class="numero">Questão ${q.numero}</span>
        ${badge(q.disciplina)}
        <span class="topico">${q.topico} · ${dificuldadeLabel(q.dificuldade)}</span>
        <button class="btn-flag ${flagAtivo ? "ativo" : ""}" data-flag="${q.numero}" title="Marcar para revisão">🚩</button>
      </header>
      <p class="enunciado">${q.enunciado}</p>
      <ul class="alternativas">${alts}</ul>
      ${comentario}
    </article>`;
}

function bindAlternativas(container) {
  container.querySelectorAll(".alternativa").forEach(el => {
    el.addEventListener("click", () => {
      if (Estado.finalizado) return;
      if (el.classList.contains("travada")) return;
      const num = Number(el.dataset.num);
      const letra = el.dataset.letra;
      // Modo livre: bloqueia trocar resposta já revelada
      if (!Estado.modoProva && Estado.respostas[num]) return;
      Estado.respostas[num] = letra;
      const q = Estado.questoes.find(x => x.numero === num);
      const art = container.querySelector(`#q${num}`);
      if (art) {
        const revelar = !Estado.modoProva; // feedback imediato no modo livre
        art.outerHTML = renderQuestao(q, { revelar });
        bindAlternativas(container);
        bindFlags(container);
      }
      atualizarProgresso();
      atualizarMinimapa();
    });
  });
}

function bindFlags(container) {
  container.querySelectorAll(".btn-flag").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const num = Number(btn.dataset.flag);
      if (Estado.revisao.has(num)) Estado.revisao.delete(num);
      else Estado.revisao.add(num);
      btn.classList.toggle("ativo", Estado.revisao.has(num));
      atualizarMinimapa();
    });
  });
}

function atualizarProgresso() {
  const resp = Object.keys(Estado.respostas).length;
  const tot = Estado.questoes.length;
  const bar = $("#progresso-bar");
  if (bar) bar.style.width = `${(resp / tot) * 100}%`;
  const txt = $("#progresso-txt");
  if (txt) txt.textContent = `${resp} / ${tot} respondidas`;
}

/* ─── Correção e estatísticas ─────────────────────────────────────────── */
function corrigir() {
  let acertos = 0;
  const porDisc = {};
  Estado.questoes.forEach(q => {
    const d = (porDisc[q.disciplina] = porDisc[q.disciplina] || { total: 0, certas: 0 });
    d.total++;
    if (Estado.respostas[q.numero] === q.correta) { acertos++; d.certas++; }
  });
  return { acertos, total: Estado.questoes.length, porDisc };
}

function renderResultado() {
  const { acertos, total, porDisc } = corrigir();
  const aprovado = acertos >= SIMULADO_CONFIG.notaCorte;
  const segundosGastos = Estado.inicio ? Math.round((Date.now() - Estado.inicio) / 1000) : null;

  const linhas = SIMULADO_CONFIG.distribuicao
    .filter(d => porDisc[d.disciplina])
    .map(d => {
      const s = porDisc[d.disciplina];
      const pct = Math.round((s.certas / s.total) * 100);
      return `
        <tr>
          <td>${badge(d.disciplina)}</td>
          <td class="center">${s.certas}/${s.total}</td>
          <td>
            <div class="mini-bar"><span style="width:${pct}%;background:${cor(d.disciplina)}"></span></div>
            <small>${pct}%</small>
          </td>
        </tr>`;
    }).join("");

  const revisar = SIMULADO_CONFIG.distribuicao
    .filter(d => porDisc[d.disciplina] && porDisc[d.disciplina].certas / porDisc[d.disciplina].total < 0.6)
    .map(d => {
      const erradas = Estado.questoes
        .filter(q => q.disciplina === d.disciplina && Estado.respostas[q.numero] !== q.correta)
        .map(q => `Q${q.numero} (${q.topico})`).join(", ");
      return `<li><b>${d.disciplina}:</b> revise — ${erradas}</li>`;
    }).join("");

  const tempoStr = segundosGastos != null ? formatarTempo(segundosGastos) : null;

  return `
    <div class="resultado-card ${aprovado ? "aprovado" : "reprovado"}">
      <h2>${aprovado ? "✓ Aprovado na 1ª fase (simulado)" : "✗ Abaixo da nota de corte"}</h2>
      <p class="nota">${acertos} <span>/ ${total} pontos</span></p>
      <p class="corte">Nota de corte: ${SIMULADO_CONFIG.notaCorte} pontos (50%)${tempoStr ? ` · tempo: ${tempoStr}` : ""}</p>
    </div>
    <h3>Desempenho por disciplina</h3>
    <table class="tabela-desempenho">
      <thead><tr><th>Disciplina</th><th>Acertos</th><th>Aproveitamento</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    ${revisar
      ? `<h3>Mapa de revisão</h3><ul class="mapa-revisao">${revisar}</ul>`
      : `<p class="parabens">Excelente! Nenhuma disciplina abaixo de 60%.</p>`}`;
}

/* ─── Fluxos de tela ──────────────────────────────────────────────────── */
function iniciarSimulado() {
  Estado.questoes    = gerarSimulado();
  Estado.respostas   = {};
  Estado.revisao     = new Set();
  Estado.modoProva   = $("#chk-modo-prova").checked;
  Estado.atual       = 0;
  Estado.finalizado  = false;
  Estado.inicio      = Date.now();

  $("#tela-inicio").classList.add("hidden");
  $("#tela-resultado").classList.add("hidden");
  $("#tela-prova").classList.remove("hidden");

  renderMinimapa();

  if (Estado.modoProva) renderModoProva();
  else renderListaCompleta();

  atualizarProgresso();
  atualizarMinimapa();
  iniciarCronometro();
  window.scrollTo(0, 0);
}

function renderListaCompleta() {
  const cont = $("#lista-questoes");
  cont.innerHTML = Estado.questoes.map(q => renderQuestao(q)).join("");
  bindAlternativas(cont);
  bindFlags(cont);
  $("#nav-modo-prova").classList.add("hidden");
  $("#btn-finalizar").classList.remove("hidden");
}

function renderModoProva() {
  const cont = $("#lista-questoes");
  const q = Estado.questoes[Estado.atual];
  cont.innerHTML = renderQuestao(q);
  bindAlternativas(cont);
  bindFlags(cont);
  $("#nav-modo-prova").classList.remove("hidden");
  $("#mp-pos").textContent = `${Estado.atual + 1} / ${Estado.questoes.length}`;
  $("#mp-anterior").disabled = Estado.atual === 0;
  const ultima = Estado.atual === Estado.questoes.length - 1;
  $("#mp-proxima").classList.toggle("hidden", ultima);
  $("#btn-finalizar").classList.toggle("hidden", !ultima);
  atualizarMinimapa();
}

function finalizar() {
  Estado.finalizado = true;
  pararCronometro();
  $("#tela-prova").classList.add("hidden");
  $("#tela-resultado").classList.remove("hidden");
  $("#resultado-conteudo").innerHTML = renderResultado();
  atualizarMinimapa();
  $("#gabarito-conteudo").innerHTML = Estado.questoes
    .map(q => renderQuestao(q, { revelar: true }))
    .join("");
  window.scrollTo(0, 0);
}

function reiniciar() {
  pararCronometro();
  Estado.finalizado  = false;
  Estado.questoes    = [];
  Estado.respostas   = {};
  Estado.revisao     = new Set();
  $("#tela-resultado").classList.add("hidden");
  $("#tela-inicio").classList.remove("hidden");
  $("#gabarito-conteudo").innerHTML = "";
  window.scrollTo(0, 0);
}

/* ─── Tema claro/escuro ───────────────────────────────────────────────── */
function toggleTema() {
  const light = document.body.classList.toggle("light");
  const btn = $("#btn-tema");
  if (btn) btn.textContent = light ? "🌙" : "☀️";
  localStorage.setItem("tema", light ? "light" : "dark");
}

/* ─── Inicialização ───────────────────────────────────────────────────── */
function preencherInfoInicio() {
  $("#info-exame").textContent = SIMULADO_CONFIG.exame;
  $("#info-banca").textContent = SIMULADO_CONFIG.banca;
  $("#info-total").textContent = SIMULADO_CONFIG.totalQuestoes;
  $("#info-banco").textContent = bancoCompleto().length;

  const tbody = $("#tabela-distribuicao tbody");
  tbody.innerHTML = SIMULADO_CONFIG.distribuicao
    .map(d =>
      `<tr><td>${badge(d.disciplina)}</td><td class="center">${d.peso}</td>
       <td class="center">${Math.round((d.peso / SIMULADO_CONFIG.totalQuestoes) * 100)}%</td></tr>`
    ).join("");
}

if (typeof document !== "undefined")
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("tema") === "light") {
    document.body.classList.add("light");
    const btn = $("#btn-tema");
    if (btn) btn.textContent = "🌙";
  }

  preencherInfoInicio();
  $("#btn-iniciar").addEventListener("click", iniciarSimulado);
  $("#btn-finalizar").addEventListener("click", finalizar);
  $("#btn-reiniciar").addEventListener("click", reiniciar);
  $("#btn-tema").addEventListener("click", toggleTema);
  $("#mp-anterior").addEventListener("click", () => {
    if (Estado.atual > 0) { Estado.atual--; renderModoProva(); }
  });
  $("#mp-proxima").addEventListener("click", () => {
    if (Estado.atual < Estado.questoes.length - 1) { Estado.atual++; renderModoProva(); }
  });
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = { gerarSimulado, prepararQuestao, embaralhar };
}
