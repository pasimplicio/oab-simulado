/**
 * Motor do Simulado OAB (estilo FGV) — geração, aplicação e correção.
 * Depende de config.js (SIMULADO_CONFIG) e questions.js (QUESTOES).
 */

/* ---------------------- banco unificado ---------------------- */
// Combina o banco autoral (QUESTOES) com o banco scraped (QUESTOES_OAB), se disponível.
// QUESTOES_OAB é definido em questions_oab.js, carregado opcionalmente.
function bancoCompleto() {
  const base = Array.isArray(typeof QUESTOES !== "undefined" ? QUESTOES : []) ? QUESTOES : [];
  const oab  = (typeof QUESTOES_OAB !== "undefined" && Array.isArray(QUESTOES_OAB)) ? QUESTOES_OAB : [];
  return [...base, ...oab];
}

/* ---------------------- utilidades ---------------------- */
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
  bancoCompleto().forEach((q) => {
    (mapa[q.disciplina] = mapa[q.disciplina] || []).push(q);
  });
  return mapa;
}

/**
 * Monta um simulado respeitando a distribuição-alvo por disciplina.
 * Para cada disciplina sorteia min(peso, disponíveis). Se faltarem questões
 * para fechar o total (80), completa com o restante do banco, sem repetir.
 * Em seguida, ordena por disciplina (como na prova real, em blocos).
 */
function gerarSimulado(total = SIMULADO_CONFIG.totalQuestoes) {
  const porDisc = questoesPorDisciplina();
  const selecionadas = [];
  const usados = new Set();

  SIMULADO_CONFIG.distribuicao.forEach(({ disciplina, peso }) => {
    const pool = embaralhar(porDisc[disciplina] || []);
    pool.slice(0, peso).forEach((q) => {
      selecionadas.push(q);
      usados.add(q.id);
    });
  });

  // Completar (ou cortar) para bater o total exato.
  if (selecionadas.length < total) {
    const resto = embaralhar(bancoCompleto().filter((q) => !usados.has(q.id)));
    for (const q of resto) {
      if (selecionadas.length >= total) break;
      selecionadas.push(q);
      usados.add(q.id);
    }
  }

  // Ordena por ordem das disciplinas da config (blocos) e embaralha alternativas.
  const ordemDisc = {};
  SIMULADO_CONFIG.distribuicao.forEach((d, i) => (ordemDisc[d.disciplina] = i));
  selecionadas.sort((a, b) => ordemDisc[a.disciplina] - ordemDisc[b.disciplina]);

  return selecionadas.slice(0, total).map((q, idx) => prepararQuestao(q, idx + 1));
}

/** Embaralha as alternativas mantendo o vínculo com a letra correta. */
function prepararQuestao(q, numero) {
  const letras = SIMULADO_CONFIG.alternativas; // [A,B,C,D]
  const pares = letras.map((L) => ({ texto: q.alternativas[L], correta: L === q.correta, origem: L }));
  const embaralhadas = embaralhar(pares);
  const novasAlt = {};
  let novaCorreta = null;
  const mapaComentario = {};
  embaralhadas.forEach((p, i) => {
    const L = letras[i];
    novasAlt[L] = p.texto;
    mapaComentario[L] = q.comentario[p.origem];
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
    fundamento: q.fundamento,
    comentario: mapaComentario,
    pegadinha: q.pegadinha || null,
  };
}

/* ---------------------- estado da aplicação ---------------------- */
const Estado = {
  questoes: [],
  respostas: {},     // numero -> letra
  modoProva: false,
  atual: 0,          // índice no modo prova
  finalizado: false,
  inicio: null,
};

/* ---------------------- renderização ---------------------- */
const $ = (sel) => document.querySelector(sel);
const cor = (disc) => SIMULADO_CONFIG.cores[disc] || "#475569";

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

  const alts = letras
    .map((L) => {
      const sel = marcada === L ? "selecionada" : "";
      let estado = "";
      if (revelar) {
        if (L === q.correta) estado = "correta";
        else if (marcada === L) estado = "incorreta";
      }
      return `
        <li class="alternativa ${sel} ${estado}" data-num="${q.numero}" data-letra="${L}">
          <span class="letra">${L}</span>
          <span class="texto">${q.alternativas[L]}</span>
        </li>`;
    })
    .join("");

  let comentario = "";
  if (revelar) {
    const acertou = marcada === q.correta;
    const temComentario = q.comentario && Object.values(q.comentario).some(Boolean);
    const itens = temComentario
      ? letras
          .map((L) => `<li class="${L === q.correta ? "ok" : "no"}"><b>${L})</b> ${q.comentario[L]}</li>`)
          .join("")
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
      </header>
      <p class="enunciado">${q.enunciado}</p>
      <ul class="alternativas">${alts}</ul>
      ${comentario}
    </article>`;
}

function bindAlternativas(container) {
  container.querySelectorAll(".alternativa").forEach((el) => {
    el.addEventListener("click", () => {
      if (Estado.finalizado) return;
      const num = Number(el.dataset.num);
      const letra = el.dataset.letra;
      Estado.respostas[num] = letra;
      // re-render apenas o bloco da questão atual
      const q = Estado.questoes.find((x) => x.numero === num);
      const art = container.querySelector(`#q${num}`);
      if (art) {
        art.outerHTML = renderQuestao(q, { revelar: false });
        bindAlternativas(container);
      }
      atualizarProgresso();
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

/* ---------------------- correção e estatísticas ---------------------- */
function corrigir() {
  let acertos = 0;
  const porDisc = {};
  Estado.questoes.forEach((q) => {
    const d = (porDisc[q.disciplina] = porDisc[q.disciplina] || { total: 0, certas: 0 });
    d.total++;
    if (Estado.respostas[q.numero] === q.correta) {
      acertos++;
      d.certas++;
    }
  });
  return { acertos, total: Estado.questoes.length, porDisc };
}

function renderResultado() {
  const { acertos, total, porDisc } = corrigir();
  const aprovado = acertos >= SIMULADO_CONFIG.notaCorte;
  const minutos = Estado.inicio ? Math.round((Date.now() - Estado.inicio) / 60000) : null;

  const linhas = SIMULADO_CONFIG.distribuicao
    .filter((d) => porDisc[d.disciplina])
    .map((d) => {
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
    })
    .join("");

  // Mapa de revisão: disciplinas com desempenho abaixo de 60%.
  const revisar = SIMULADO_CONFIG.distribuicao
    .filter((d) => porDisc[d.disciplina] && porDisc[d.disciplina].certas / porDisc[d.disciplina].total < 0.6)
    .map((d) => {
      const erradas = Estado.questoes
        .filter((q) => q.disciplina === d.disciplina && Estado.respostas[q.numero] !== q.correta)
        .map((q) => `Q${q.numero} (${q.topico})`)
        .join(", ");
      return `<li><b>${d.disciplina}:</b> revise — ${erradas}</li>`;
    })
    .join("");

  return `
    <div class="resultado-card ${aprovado ? "aprovado" : "reprovado"}">
      <h2>${aprovado ? "✓ Aprovado na 1ª fase (simulado)" : "✗ Abaixo da nota de corte"}</h2>
      <p class="nota">${acertos} <span>/ ${total} pontos</span></p>
      <p class="corte">Nota de corte: ${SIMULADO_CONFIG.notaCorte} pontos (50%) ${
    minutos != null ? `· tempo: ${minutos} min` : ""
  }</p>
    </div>
    <h3>Desempenho por disciplina</h3>
    <table class="tabela-desempenho">
      <thead><tr><th>Disciplina</th><th>Acertos</th><th>Aproveitamento</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    ${
      revisar
        ? `<h3>Mapa de revisão</h3><ul class="mapa-revisao">${revisar}</ul>`
        : `<p class="parabens">Excelente! Nenhuma disciplina abaixo de 60%.</p>`
    }`;
}

/* ---------------------- fluxos de tela ---------------------- */
function iniciarSimulado() {
  Estado.questoes = gerarSimulado();
  Estado.respostas = {};
  Estado.modoProva = $("#chk-modo-prova").checked;
  Estado.atual = 0;
  Estado.finalizado = false;
  Estado.inicio = Date.now();

  $("#tela-inicio").classList.add("hidden");
  $("#tela-resultado").classList.add("hidden");
  $("#tela-prova").classList.remove("hidden");

  if (Estado.modoProva) renderModoProva();
  else renderListaCompleta();
  atualizarProgresso();
  window.scrollTo(0, 0);
}

function renderListaCompleta() {
  const cont = $("#lista-questoes");
  cont.innerHTML = Estado.questoes.map((q) => renderQuestao(q)).join("");
  bindAlternativas(cont);
  $("#nav-modo-prova").classList.add("hidden");
  $("#btn-finalizar").classList.remove("hidden");
}

function renderModoProva() {
  const cont = $("#lista-questoes");
  const q = Estado.questoes[Estado.atual];
  cont.innerHTML = renderQuestao(q);
  bindAlternativas(cont);
  $("#nav-modo-prova").classList.remove("hidden");
  $("#mp-pos").textContent = `${Estado.atual + 1} / ${Estado.questoes.length}`;
  $("#mp-anterior").disabled = Estado.atual === 0;
  const ultima = Estado.atual === Estado.questoes.length - 1;
  $("#mp-proxima").classList.toggle("hidden", ultima);
  $("#btn-finalizar").classList.toggle("hidden", !ultima);
}

function finalizar() {
  Estado.finalizado = true;
  $("#tela-prova").classList.add("hidden");
  $("#tela-resultado").classList.remove("hidden");
  $("#resultado-conteudo").innerHTML = renderResultado();
  $("#gabarito-conteudo").innerHTML = Estado.questoes
    .map((q) => renderQuestao(q, { revelar: true }))
    .join("");
  window.scrollTo(0, 0);
}

function reiniciar() {
  $("#tela-resultado").classList.add("hidden");
  $("#tela-inicio").classList.remove("hidden");
  $("#gabarito-conteudo").innerHTML = "";
  window.scrollTo(0, 0);
}

/* ---------------------- inicialização ---------------------- */
function preencherInfoInicio() {
  $("#info-exame").textContent = SIMULADO_CONFIG.exame;
  $("#info-banca").textContent = SIMULADO_CONFIG.banca;
  $("#info-total").textContent = SIMULADO_CONFIG.totalQuestoes;
  $("#info-banco").textContent = bancoCompleto().length;

  const tbody = $("#tabela-distribuicao tbody");
  tbody.innerHTML = SIMULADO_CONFIG.distribuicao
    .map(
      (d) =>
        `<tr><td>${badge(d.disciplina)}</td><td class="center">${d.peso}</td>
         <td class="center">${Math.round((d.peso / SIMULADO_CONFIG.totalQuestoes) * 100)}%</td></tr>`
    )
    .join("");
}

if (typeof document !== "undefined")
document.addEventListener("DOMContentLoaded", () => {
  preencherInfoInicio();
  $("#btn-iniciar").addEventListener("click", iniciarSimulado);
  $("#btn-finalizar").addEventListener("click", finalizar);
  $("#btn-reiniciar").addEventListener("click", reiniciar);
  $("#mp-anterior").addEventListener("click", () => {
    if (Estado.atual > 0) {
      Estado.atual--;
      renderModoProva();
    }
  });
  $("#mp-proxima").addEventListener("click", () => {
    if (Estado.atual < Estado.questoes.length - 1) {
      Estado.atual++;
      renderModoProva();
    }
  });
});

// Exporta funções puras para teste em Node.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { gerarSimulado, prepararQuestao, embaralhar };
}
