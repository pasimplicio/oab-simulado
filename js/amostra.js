/**
 * Amostra grátis (isca) — mini-simulado sem login.
 * Usa o banco autoral (QUESTOES) por ter comentários e fundamento completos,
 * que é o grande diferencial mostrado na degustação.
 * Reaproveita as classes visuais do simulador real (styles.css).
 */
(function () {
  "use strict";

  const N = 5; // questões da amostra
  // top-level const não vira propriedade de window; acessa como global puro
  const CFG = (typeof SIMULADO_CONFIG !== "undefined") ? SIMULADO_CONFIG : {};
  const BANCO = (typeof QUESTOES !== "undefined") ? QUESTOES : [];
  const letras = CFG.alternativas || ["A", "B", "C", "D"];

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

  function cor(disc) {
    return (CFG.cores && CFG.cores[disc]) || "#0891b2";
  }
  function badge(disc) {
    return `<span class="badge" style="background:${cor(disc)}">${escapeHtml(disc)}</span>`;
  }
  function dificuldadeLabel(d) {
    return { facil: "Fácil", media: "Média", dificil: "Difícil" }[d] || d;
  }

  // Embaralha alternativas e remapeia gabarito/comentário (espelha prepararQuestao do app.js)
  function prepararQuestao(q, numero) {
    const pares = letras.map(L => ({ texto: q.alternativas[L], correta: L === q.correta, origem: L }));
    const ordenadas = embaralhar(pares);
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

  // Seleciona N questões de disciplinas variadas
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

  const Estado = { questoes: [], respostas: {}, acertos: 0 };

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

    let comentario = "";
    if (revelar) {
      const acertou = marcada === q.correta;
      const itens = letras
        .map(L => `<li class="${L === q.correta ? "ok" : "no"}"><b>${L})</b> ${escapeHtml(q.comentario[L])}</li>`)
        .join("");
      comentario = `
        <div class="comentario">
          <p class="resultado ${acertou ? "acerto" : "erro"}">
            ${acertou ? "Você acertou" : "Você errou"} - gabarito: <b>${escapeHtml(q.correta)}</b>
          </p>
          ${q.fundamento ? `<p class="fundamento"><b>Fundamento:</b> ${escapeHtml(q.fundamento)}</p>` : ""}
          <ul class="distratores">${itens}</ul>
          ${q.pegadinha ? `<p class="pegadinha"><b>Pegadinha da banca:</b> ${escapeHtml(q.pegadinha)}</p>` : ""}
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
        ${comentario}
      </article>`;
  }

  function render() {
    const lista = document.getElementById("amostra-lista");
    lista.innerHTML = Estado.questoes.map(renderQuestao).join("");
    atualizarProgresso();
  }

  function responder(num, letra) {
    if (Estado.respostas[num]) return; // já respondida — trava no modo livre
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

    if (respondidas === total) {
      const paywall = document.getElementById("amostra-paywall");
      const score = document.getElementById("amostra-score");
      if (score) {
        const pct = Math.round((Estado.acertos / total) * 100);
        score.textContent = `Você acertou ${Estado.acertos} de ${total} (${pct}%).`;
      }
      if (paywall && paywall.classList.contains("hidden")) {
        paywall.classList.remove("hidden");
        paywall.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function init() {
    Estado.questoes = selecionar();
    Estado.respostas = {};
    Estado.acertos = 0;
    render();

    // Delegação de clique nas alternativas
    document.getElementById("amostra-lista").addEventListener("click", e => {
      const li = e.target.closest(".alternativa");
      if (!li) return;
      responder(Number(li.dataset.num), li.dataset.letra);
    });

    // Botão "tentar outras questões"
    document.getElementById("btn-amostra-reiniciar")?.addEventListener("click", () => {
      Estado.questoes = selecionar();
      Estado.respostas = {};
      Estado.acertos = 0;
      document.getElementById("amostra-paywall")?.classList.add("hidden");
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
