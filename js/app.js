/**
 * Motor do Simulado OAB - geracao, aplicacao, correcao e UX.
 * Depende de config.js, questions.js e, quando disponivel, questions_oab.js.
 */

const DISC_NORM = {
  "Etica Profissional": "Etica Profissional",
  "Direito Tributario": "Direito Tributario",
  "Direito Previdenciario": "Direito Previdenciario",
  "Direito da Crianca e do Adolescente": "Direito da Crianca e do Adolescente",
};

const DISC_CANON = {
  "Etica Profissional": "\u00c9tica Profissional",
  "Direito Tributario": "Direito Tribut\u00e1rio",
  "Direito Previdenciario": "Direito Previdenci\u00e1rio",
  "Direito da Crianca e do Adolescente": "Direito da Crian\u00e7a e do Adolescente",
};

const HISTORICO_KEY = "oabSimuladoHistorico";
const FONTE_KEY = "oabFonteEscala";
const TEMA_KEY = "tema";
const MIN_FONT_SCALE = 0.9;
const MAX_FONT_SCALE = 1.25;
const FONT_STEP = 0.05;

function normDisc(d) {
  return DISC_CANON[d] || d;
}

function storageGet(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage pode estar indisponivel em navegacao privada.
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function bancoCompleto() {
  const base = (typeof QUESTOES !== "undefined" && Array.isArray(QUESTOES)) ? QUESTOES : [];
  const oab = (typeof QUESTOES_OAB !== "undefined" && Array.isArray(QUESTOES_OAB))
    ? QUESTOES_OAB
    : [];

  return [...base, ...oab]
    .filter(q => q && q.id && q.alternativas && ["A", "B", "C", "D"].includes(q.correta))
    .filter(q => q.alternativas[q.correta])
    .map(q => ({
      ...q,
      disciplina: normDisc(q.disciplina),
      topico: normDisc(q.topico || q.disciplina),
      dificuldade: q.dificuldade || "media",
      comentario: q.comentario || {},
    }));
}

function embaralhar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function disciplinasConfig() {
  return SIMULADO_CONFIG.distribuicao.map(d => d.disciplina);
}

function normalizarOpcoes(totalOuOpcoes = SIMULADO_CONFIG.totalQuestoes, extras = {}) {
  const base = typeof totalOuOpcoes === "object" && totalOuOpcoes !== null
    ? totalOuOpcoes
    : { total: totalOuOpcoes, ...extras };

  const total = Number(base.total || SIMULADO_CONFIG.totalQuestoes);
  const disciplinas = Array.isArray(base.disciplinas) && base.disciplinas.length
    ? base.disciplinas.map(normDisc)
    : disciplinasConfig();

  return {
    total: Number.isFinite(total) && total > 0 ? Math.round(total) : SIMULADO_CONFIG.totalQuestoes,
    disciplinas,
    dificuldade: base.dificuldade && base.dificuldade !== "todas" ? base.dificuldade : "todas",
    embaralharAlternativas: base.embaralharAlternativas !== false,
  };
}

function questoesFiltradas(opcoes) {
  const disciplinas = new Set(opcoes.disciplinas);
  return bancoCompleto().filter(q => {
    if (!disciplinas.has(q.disciplina)) return false;
    if (opcoes.dificuldade !== "todas" && q.dificuldade !== opcoes.dificuldade) return false;
    return true;
  });
}

function calcularCotas(total, disciplinasSelecionadas) {
  const selecionadas = new Set(disciplinasSelecionadas);
  const pesos = SIMULADO_CONFIG.distribuicao.filter(d => selecionadas.has(d.disciplina));
  const soma = pesos.reduce((acc, d) => acc + d.peso, 0);
  if (!pesos.length || soma <= 0) return [];

  const cotas = pesos.map(d => {
    const exata = (total * d.peso) / soma;
    return {
      disciplina: d.disciplina,
      peso: d.peso,
      cota: Math.floor(exata),
      resto: exata - Math.floor(exata),
    };
  });

  let distribuido = cotas.reduce((acc, d) => acc + d.cota, 0);
  cotas
    .slice()
    .sort((a, b) => b.resto - a.resto || b.peso - a.peso)
    .forEach(d => {
      if (distribuido < total) {
        d.cota += 1;
        distribuido += 1;
      }
    });

  return cotas;
}

function gerarSimulado(totalOuOpcoes = SIMULADO_CONFIG.totalQuestoes, extras = {}) {
  const opcoes = normalizarOpcoes(totalOuOpcoes, extras);
  const banco = questoesFiltradas(opcoes);
  if (!banco.length) {
    throw new Error("Nenhuma questao encontrada para os filtros selecionados.");
  }

  const porDisc = {};
  banco.forEach(q => {
    (porDisc[q.disciplina] = porDisc[q.disciplina] || []).push(q);
  });

  const selecionadas = [];
  const usados = new Set();

  calcularCotas(opcoes.total, opcoes.disciplinas).forEach(({ disciplina, cota }) => {
    if (cota <= 0) return;
    const pool = embaralhar(porDisc[disciplina] || []);
    pool.slice(0, cota).forEach(q => {
      selecionadas.push(q);
      usados.add(q.id);
    });
  });

  if (selecionadas.length < opcoes.total) {
    const resto = embaralhar(banco.filter(q => !usados.has(q.id)));
    for (const q of resto) {
      if (selecionadas.length >= opcoes.total) break;
      selecionadas.push(q);
      usados.add(q.id);
    }
  }

  const ordemDisc = {};
  SIMULADO_CONFIG.distribuicao.forEach((d, i) => { ordemDisc[d.disciplina] = i; });
  selecionadas.sort((a, b) => (ordemDisc[a.disciplina] ?? 99) - (ordemDisc[b.disciplina] ?? 99));

  return selecionadas
    .slice(0, opcoes.total)
    .map((q, idx) => prepararQuestao(q, idx + 1, opcoes));
}

function prepararQuestao(q, numero, opcoes = {}) {
  const letras = SIMULADO_CONFIG.alternativas;
  const pares = letras.map(L => ({ texto: q.alternativas[L], correta: L === q.correta, origem: L }));
  const ordenadas = opcoes.embaralharAlternativas === false ? pares : embaralhar(pares);
  const novasAlt = {};
  const mapaComentario = {};
  let novaCorreta = null;

  ordenadas.forEach((p, i) => {
    const L = letras[i];
    novasAlt[L] = p.texto;
    mapaComentario[L] = q.comentario ? (q.comentario[p.origem] || "") : "";
    if (p.correta) novaCorreta = L;
  });

  return {
    numero,
    id: q.id,
    exame: q.exame || null,
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
  pausado: false,
  alertasEmitidos: new Set(),
  opcoes: null,
  historicoSalvo: false,
};

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const cor = disc => SIMULADO_CONFIG.cores[disc] || "#475569";

function badge(disc) {
  return `<span class="badge" style="background:${cor(disc)}">${escapeHtml(disc)}</span>`;
}

function dificuldadeLabel(d) {
  return { facil: "F\u00e1cil", media: "M\u00e9dia", dificil: "Dif\u00edcil" }[d] || d;
}

function formatarTempo(s) {
  const safe = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const seg = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

function mensagem(texto, tipo = "info") {
  const el = $("#mensagem-simulado");
  if (!el) return;
  el.textContent = texto || "";
  el.className = texto ? `mensagem-simulado ${tipo}` : "mensagem-simulado hidden";
}

function aplicarClasseCronometro() {
  const cel = $("#cronometro");
  if (!cel) return;
  cel.textContent = formatarTempo(Estado.tempoRestante);
  cel.className = "cronometro";
  if (Estado.pausado) cel.classList.add("pausado");
  else if (Estado.tempoRestante <= 300) cel.classList.add("critico");
  else if (Estado.tempoRestante <= 1800) cel.classList.add("atencao");
}

function notificarTempo(segundos, texto, tipo) {
  if (Estado.alertasEmitidos.has(segundos)) return;
  Estado.alertasEmitidos.add(segundos);
  mensagem(texto, tipo);
}

function iniciarCronometro() {
  Estado.tempoRestante = SIMULADO_CONFIG.duracaoMinutos * 60;
  Estado.pausado = false;
  Estado.alertasEmitidos = new Set();
  atualizarBotaoPausa();
  aplicarClasseCronometro();
  clearInterval(Estado.cronInterval);
  Estado.cronInterval = setInterval(() => {
    if (Estado.pausado) return;
    Estado.tempoRestante -= 1;
    if (Estado.tempoRestante === 1800) {
      notificarTempo(1800, "Aten\u00e7\u00e3o: faltam 30 minutos para o fim da prova.", "warning");
    }
    if (Estado.tempoRestante === 300) {
      notificarTempo(300, "Aten\u00e7\u00e3o: faltam apenas 5 minutos.", "danger");
    }
    aplicarClasseCronometro();
    if (Estado.tempoRestante <= 0) {
      clearInterval(Estado.cronInterval);
      if (!Estado.finalizado) finalizar();
    }
  }, 1000);
}

function pararCronometro() {
  clearInterval(Estado.cronInterval);
  Estado.cronInterval = null;
}

function alternarPausaCronometro() {
  if (Estado.finalizado || !Estado.questoes.length) return;
  Estado.pausado = !Estado.pausado;
  atualizarBotaoPausa();
  aplicarClasseCronometro();
  mensagem(Estado.pausado ? "Cron\u00f4metro pausado." : "Cron\u00f4metro retomado.", "info");
}

function atualizarBotaoPausa() {
  const btn = $("#btn-pausar-tempo");
  if (!btn) return;
  btn.textContent = Estado.pausado ? "Continuar tempo" : "Pausar tempo";
}

function renderMinimapa() {
  const cont = $("#minimapa");
  if (!cont) return;
  cont.innerHTML = Estado.questoes
    .map(q => `<button class="dot dot-vazio" data-num="${q.numero}" title="Q${q.numero} - ${escapeHtml(q.disciplina)}" aria-label="Ir para questao ${q.numero}"></button>`)
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
    if (Estado.finalizado || (!Estado.modoProva && resp)) {
      if (!resp) dot.classList.add("dot-branco");
      else if (resp === q.correta) dot.classList.add("dot-correta");
      else dot.classList.add("dot-errada");
    } else {
      dot.classList.add(resp ? "dot-resp" : "dot-vazio");
    }
    if (Estado.revisao.has(q.numero)) dot.classList.add("dot-flag");
    if (Estado.modoProva && Estado.atual === q.numero - 1) dot.classList.add("dot-atual");
  });
}

function renderQuestao(q, opts = {}) {
  const { revelar = false } = opts;
  const letras = SIMULADO_CONFIG.alternativas;
  const marcada = Estado.respostas[q.numero];
  const flagAtivo = Estado.revisao.has(q.numero);

  const alts = letras.map(L => {
    const selecionada = marcada === L ? "selecionada" : "";
    let estado = "";
    let icone = "";
    if (revelar) {
      if (L === q.correta) {
        estado = "correta";
        icone = '<span class="feedback-icon ok" aria-hidden="true">&#10003;</span>';
      } else if (marcada === L) {
        estado = "incorreta";
        icone = '<span class="feedback-icon no" aria-hidden="true">&#10005;</span>';
      }
    }
    const travada = (revelar && marcada) ? " travada" : "";
    return `
      <li class="alternativa ${selecionada} ${estado}${travada}" data-num="${q.numero}" data-letra="${L}" tabindex="0">
        <span class="letra">${L}</span>
        <span class="texto">${escapeHtml(q.alternativas[L])}</span>
        ${icone}
      </li>`;
  }).join("");

  let comentario = "";
  if (revelar) {
    const acertou = marcada === q.correta;
    const temComentario = q.comentario && Object.values(q.comentario).some(Boolean);
    const itens = temComentario
      ? letras.map(L => `<li class="${L === q.correta ? "ok" : "no"}"><b>${L})</b> ${escapeHtml(q.comentario[L])}</li>`).join("")
      : "";
    const resumo = q.fundamento
      ? `<p class="feedback-rapido"><b>Resumo r\u00e1pido:</b> ${escapeHtml(q.fundamento)}</p>`
      : `<p class="feedback-rapido"><b>Resumo r\u00e1pido:</b> gabarito ${escapeHtml(q.correta)}. Coment\u00e1rio detalhado indispon\u00edvel para esta quest\u00e3o.</p>`;
    comentario = `
      <div class="comentario">
        <p class="resultado ${acertou ? "acerto" : marcada ? "erro" : "branco"}">
          ${acertou ? "Voc\u00ea acertou" : marcada ? "Voc\u00ea errou" : "Em branco"} -
          gabarito: <b>${escapeHtml(q.correta)}</b>
        </p>
        ${resumo}
        ${q.fundamento ? `<p class="fundamento"><b>Fundamento:</b> ${escapeHtml(q.fundamento)}</p>` : ""}
        ${temComentario ? `<ul class="distratores">${itens}</ul>` : ""}
        ${q.pegadinha ? `<p class="pegadinha"><b>Pegadinha da banca:</b> ${escapeHtml(q.pegadinha)}</p>` : ""}
      </div>`;
  }

  return `
    <article class="questao" id="q${q.numero}">
      <header>
        <span class="numero">Quest\u00e3o ${q.numero}</span>
        ${badge(q.disciplina)}
        <span class="topico">${escapeHtml(q.topico)} - ${dificuldadeLabel(q.dificuldade)}</span>
        <button class="btn-flag ${flagAtivo ? "ativo" : ""}" data-flag="${q.numero}" title="Marcar para revis\u00e3o" type="button">Marcar</button>
      </header>
      <p class="enunciado">${escapeHtml(q.enunciado)}</p>
      <ul class="alternativas">${alts}</ul>
      ${comentario}
    </article>`;
}

function responderQuestao(num, letra, container = $("#lista-questoes")) {
  if (Estado.finalizado) return;
  const q = Estado.questoes.find(x => x.numero === num);
  if (!q || !q.alternativas[letra]) return;
  if (!Estado.modoProva && Estado.respostas[num]) return;

  Estado.respostas[num] = letra;
  const art = container?.querySelector(`#q${num}`);
  if (art) {
    art.outerHTML = renderQuestao(q, { revelar: !Estado.modoProva });
    bindAlternativas(container);
    bindFlags(container);
  }
  atualizarProgresso();
  atualizarMinimapa();
}

function bindAlternativas(container) {
  container.querySelectorAll(".alternativa").forEach(el => {
    const handler = () => {
      if (el.classList.contains("travada")) return;
      responderQuestao(Number(el.dataset.num), el.dataset.letra, container);
    };
    el.addEventListener("click", handler);
    el.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler();
      }
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
  const tot = Estado.questoes.length || 1;
  const bar = $("#progresso-bar");
  if (bar) bar.style.width = `${(resp / tot) * 100}%`;
  const txt = $("#progresso-txt");
  if (txt) txt.textContent = `${resp} / ${tot} respondidas`;
}

function corrigir() {
  let acertos = 0;
  const porDisc = {};
  Estado.questoes.forEach(q => {
    const d = (porDisc[q.disciplina] = porDisc[q.disciplina] || { total: 0, certas: 0 });
    d.total += 1;
    if (Estado.respostas[q.numero] === q.correta) {
      acertos += 1;
      d.certas += 1;
    }
  });
  return { acertos, total: Estado.questoes.length, porDisc };
}

function notaCorteAtual(total) {
  return Math.ceil(total * (SIMULADO_CONFIG.notaCorte / SIMULADO_CONFIG.totalQuestoes));
}

function renderResultado() {
  const { acertos, total, porDisc } = corrigir();
  const corte = notaCorteAtual(total);
  const aprovado = acertos >= corte;
  const segundosGastos = Estado.inicio ? Math.round((Date.now() - Estado.inicio) / 1000) : null;
  const tempoMedio = segundosGastos && total ? Math.round(segundosGastos / total) : null;

  const linhas = Object.entries(porDisc)
    .sort((a, b) => (SIMULADO_CONFIG.distribuicao.findIndex(d => d.disciplina === a[0]) ?? 99) - (SIMULADO_CONFIG.distribuicao.findIndex(d => d.disciplina === b[0]) ?? 99))
    .map(([disciplina, s]) => {
      const pct = Math.round((s.certas / s.total) * 100);
      return `
        <tr>
          <td>${badge(disciplina)}</td>
          <td class="center">${s.certas}/${s.total}</td>
          <td>
            <div class="mini-bar"><span style="width:${pct}%;background:${cor(disciplina)}"></span></div>
            <small>${pct}%</small>
          </td>
        </tr>`;
    }).join("");

  const revisar = Object.entries(porDisc)
    .filter(([, s]) => s.certas / s.total < 0.6)
    .map(([disciplina]) => {
      const erradas = Estado.questoes
        .filter(q => q.disciplina === disciplina && Estado.respostas[q.numero] !== q.correta)
        .map(q => `Q${q.numero} (${escapeHtml(q.topico)})`)
        .join(", ");
      return `<li><b>${escapeHtml(disciplina)}:</b> revise - ${erradas}</li>`;
    }).join("");

  return `
    <div class="resultado-card ${aprovado ? "aprovado" : "reprovado"}">
      <h2>${aprovado ? "Resultado acima da nota de corte" : "Resultado abaixo da nota de corte"}</h2>
      <p class="nota">${acertos} <span>/ ${total} pontos</span></p>
      <p class="corte">Nota de corte: ${corte} pontos (50%)${segundosGastos ? ` - tempo: ${formatarTempo(segundosGastos)}` : ""}${tempoMedio ? ` - media: ${formatarTempo(tempoMedio)} por questao` : ""}</p>
    </div>
    <h3>Desempenho por disciplina</h3>
    <table class="tabela-desempenho">
      <thead><tr><th>Disciplina</th><th>Acertos</th><th>Aproveitamento</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    ${revisar
      ? `<h3>Mapa de revis\u00e3o</h3><ul class="mapa-revisao">${revisar}</ul>`
      : `<p class="parabens">Excelente! Nenhuma disciplina abaixo de 60%.</p>`}`;
}

function lerHistorico() {
  try {
    return JSON.parse(storageGet(HISTORICO_KEY, "[]")) || [];
  } catch {
    return [];
  }
}

function salvarHistorico() {
  if (Estado.historicoSalvo) return;
  const { acertos, total, porDisc } = corrigir();
  const item = {
    data: new Date().toISOString(),
    acertos,
    total,
    percentual: Math.round((acertos / total) * 100),
    modo: Estado.modoProva ? "prova" : "livre",
    tempo: Estado.inicio ? Math.round((Date.now() - Estado.inicio) / 1000) : 0,
    disciplinas: Object.entries(porDisc).map(([disciplina, v]) => ({
      disciplina,
      certas: v.certas,
      total: v.total,
    })),
  };
  const historico = [item, ...lerHistorico()].slice(0, 30);
  storageSet(HISTORICO_KEY, JSON.stringify(historico));
  Estado.historicoSalvo = true;
}

function renderHistorico() {
  const alvo = $("#historico-lista");
  if (!alvo) return;
  const historico = lerHistorico();
  if (!historico.length) {
    alvo.innerHTML = '<p class="empty-state">Nenhum simulado finalizado neste navegador.</p>';
    return;
  }
  alvo.innerHTML = historico.slice(0, 5).map(item => {
    const data = new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    return `
      <article class="history-item">
        <strong>${item.acertos}/${item.total}</strong>
        <span>${item.percentual}% - modo ${item.modo} - ${formatarTempo(item.tempo)}</span>
        <small>${data}</small>
      </article>`;
  }).join("");
}

function limparHistorico() {
  storageSet(HISTORICO_KEY, "[]");
  renderHistorico();
  mensagem("Historico local apagado.", "info");
}

function opcoesDaTela() {
  const disciplinas = $$(".disciplina-check:checked").map(input => input.value);
  return {
    total: Number($("#sel-total")?.value || SIMULADO_CONFIG.totalQuestoes),
    disciplinas,
    dificuldade: $("#sel-dificuldade")?.value || "todas",
    embaralharAlternativas: $("#chk-embaralhar")?.checked !== false,
  };
}

function iniciarSimulado() {
  mensagem("");
  const opcoes = opcoesDaTela();
  if (!opcoes.disciplinas.length) {
    mensagem("Selecione pelo menos uma disciplina.", "danger");
    return;
  }

  try {
    Estado.questoes = gerarSimulado(opcoes);
  } catch (error) {
    mensagem(error.message, "danger");
    return;
  }

  Estado.respostas = {};
  Estado.revisao = new Set();
  Estado.modoProva = $("#chk-modo-prova").checked;
  Estado.atual = 0;
  Estado.finalizado = false;
  Estado.inicio = Date.now();
  Estado.opcoes = opcoes;
  Estado.historicoSalvo = false;

  $("#tela-inicio").classList.add("hidden");
  $("#tela-resultado").classList.add("hidden");
  $("#tela-prova").classList.remove("hidden");

  renderMinimapa();
  if (Estado.modoProva) renderModoProva();
  else renderListaCompleta();

  atualizarProgresso();
  atualizarMinimapa();
  iniciarCronometro();

  if (Estado.questoes.length < opcoes.total) {
    mensagem(`Banco insuficiente para os filtros: geradas ${Estado.questoes.length} questoes.`, "warning");
  }
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
  if (!Estado.questoes.length) return;
  Estado.finalizado = true;
  pararCronometro();
  salvarHistorico();
  $("#tela-prova").classList.add("hidden");
  $("#tela-resultado").classList.remove("hidden");
  $("#resultado-conteudo").innerHTML = renderResultado();
  atualizarMinimapa();
  $("#gabarito-conteudo").innerHTML = Estado.questoes
    .map(q => renderQuestao(q, { revelar: true }))
    .join("");
  renderHistorico();
  window.scrollTo(0, 0);
}

function reiniciar() {
  pararCronometro();
  Estado.finalizado = false;
  Estado.questoes = [];
  Estado.respostas = {};
  Estado.revisao = new Set();
  $("#tela-resultado").classList.add("hidden");
  $("#tela-inicio").classList.remove("hidden");
  $("#gabarito-conteudo").innerHTML = "";
  mensagem("");
  renderHistorico();
  window.scrollTo(0, 0);
}

function toggleTema() {
  const light = document.body.classList.toggle("light");
  const btn = $("#btn-tema");
  if (btn) btn.textContent = light ? "Tema escuro" : "Tema claro";
  storageSet(TEMA_KEY, light ? "light" : "dark");
}

function aplicarFonte(scale) {
  const safe = Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, Number(scale) || 1));
  document.documentElement.style.fontSize = `${safe * 16}px`;
  storageSet(FONTE_KEY, String(safe));
}

function alterarFonte(delta) {
  const atual = Number(storageGet(FONTE_KEY, "1")) || 1;
  aplicarFonte(Math.round((atual + delta) * 100) / 100);
}

function preencherFiltros() {
  const cont = $("#filtro-disciplinas");
  if (!cont) return;
  cont.innerHTML = SIMULADO_CONFIG.distribuicao.map(d => `
    <label class="check-card">
      <input class="disciplina-check" type="checkbox" value="${escapeHtml(d.disciplina)}" checked>
      <span>${badge(d.disciplina)} <small>${d.peso} na prova-base</small></span>
    </label>`).join("");
}

function preencherInfoInicio() {
  const infoExame = $("#info-exame");
  if (!infoExame) return;
  infoExame.textContent = SIMULADO_CONFIG.exame;
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

function selecionarTodasDisciplinas(marcado) {
  $$(".disciplina-check").forEach(input => { input.checked = marcado; });
}

function navegarModoProva(delta) {
  if (!Estado.modoProva || Estado.finalizado || !Estado.questoes.length) return;
  const proxima = Estado.atual + delta;
  if (proxima < 0 || proxima >= Estado.questoes.length) return;
  Estado.atual = proxima;
  renderModoProva();
}

function bindTeclado() {
  document.addEventListener("keydown", event => {
    const tag = document.activeElement?.tagName;
    if (["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(tag)) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navegarModoProva(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navegarModoProva(1);
    } else if (Estado.modoProva && /^[a-d]$/i.test(event.key)) {
      event.preventDefault();
      const q = Estado.questoes[Estado.atual];
      if (q) responderQuestao(q.numero, event.key.toUpperCase());
    }
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!$("#tela-inicio")) return;

    if (storageGet(TEMA_KEY) === "light") {
      document.body.classList.add("light");
      const btn = $("#btn-tema");
      if (btn) btn.textContent = "Tema escuro";
    }
    aplicarFonte(Number(storageGet(FONTE_KEY, "1")));

    preencherFiltros();
    preencherInfoInicio();
    renderHistorico();
    bindTeclado();

    $("#btn-iniciar").addEventListener("click", iniciarSimulado);
    $("#btn-finalizar").addEventListener("click", finalizar);
    $("#btn-reiniciar").addEventListener("click", reiniciar);
    $("#btn-tema").addEventListener("click", toggleTema);
    $("#btn-font-plus")?.addEventListener("click", () => alterarFonte(FONT_STEP));
    $("#btn-font-minus")?.addEventListener("click", () => alterarFonte(-FONT_STEP));
    $("#btn-pausar-tempo")?.addEventListener("click", alternarPausaCronometro);
    $("#btn-limpar-historico")?.addEventListener("click", limparHistorico);
    $("#btn-todas-disciplinas")?.addEventListener("click", () => selecionarTodasDisciplinas(true));
    $("#btn-nenhuma-disciplina")?.addEventListener("click", () => selecionarTodasDisciplinas(false));
    $("#mp-anterior").addEventListener("click", () => navegarModoProva(-1));
    $("#mp-proxima").addEventListener("click", () => navegarModoProva(1));
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    bancoCompleto,
    calcularCotas,
    embaralhar,
    gerarSimulado,
    normalizarOpcoes,
    prepararQuestao,
  };
}
