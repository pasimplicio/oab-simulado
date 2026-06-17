/* Teste rapido do motor de geracao. Execute: node data/test-engine.js */
global.SIMULADO_CONFIG = require("../js/config.js").SIMULADO_CONFIG;
global.QUESTOES = require("../js/questions.js").QUESTOES;
global.QUESTOES_OAB = require("../js/questions_oab.js").QUESTOES_OAB;

const { bancoCompleto, gerarSimulado, prepararQuestao } = require("../js/app.js");

let falhas = 0;
const ok = (condicao, mensagem) => {
  if (!condicao) {
    console.log("x", mensagem);
    falhas += 1;
  } else {
    console.log("ok", mensagem);
  }
};

function idsUnicos(simulado) {
  const ids = simulado.map(q => q.id);
  return new Set(ids).size === ids.length;
}

function estruturaValida(simulado) {
  return simulado.every(q => {
    const letras = Object.keys(q.alternativas);
    return letras.length === 4
      && ["A", "B", "C", "D"].includes(q.correta)
      && Boolean(q.alternativas[q.correta]);
  });
}

const banco = bancoCompleto();
ok(banco.length > 2000, `banco unificado carregado (${banco.length} questoes)`);

const s80 = gerarSimulado(80);
ok(s80.length === 80, `gera 80 questoes (gerou ${s80.length})`);
ok(idsUnicos(s80), "simulado padrao sem questoes repetidas");
ok(estruturaValida(s80), "simulado padrao com 4 alternativas e gabarito valido");

const cont = {};
s80.forEach(q => { cont[q.disciplina] = (cont[q.disciplina] || 0) + 1; });
let distOk = true;
SIMULADO_CONFIG.distribuicao.forEach(d => {
  if ((cont[d.disciplina] || 0) < d.peso) {
    distOk = false;
    console.log("  faltou", d.disciplina, cont[d.disciplina], "<", d.peso);
  }
});
ok(distOk, "distribuicao por disciplina respeitada no padrao 80");

const piso = (cont["\u00c9tica Profissional"] || 0)
  + (cont["Direitos Humanos"] || 0)
  + (cont["Filosofia do Direito"] || 0);
ok(piso >= 12, `piso de 15% atendido (bloco = ${piso} questoes)`);

const s40 = gerarSimulado({ total: 40 });
ok(s40.length === 40, `gera 40 questoes (gerou ${s40.length})`);
ok(idsUnicos(s40), "simulado 40 sem repeticao");

const s20 = gerarSimulado({ total: 20 });
ok(s20.length === 20, `gera 20 questoes (gerou ${s20.length})`);
ok(idsUnicos(s20), "simulado 20 sem repeticao");

const constitucional = gerarSimulado({
  total: 20,
  disciplinas: ["Direito Constitucional"],
});
ok(constitucional.length === 20, "filtro por disciplina gera 20 questoes");
ok(constitucional.every(q => q.disciplina === "Direito Constitucional"), "filtro por disciplina retorna apenas a disciplina escolhida");

const faceis = gerarSimulado({
  total: 20,
  dificuldade: "facil",
});
ok(faceis.length === 20, "filtro por dificuldade gera 20 questoes");
ok(faceis.every(q => q.dificuldade === "facil"), "filtro por dificuldade retorna apenas faceis");

const orig = QUESTOES.find(q => q.id === "etica-001");
let preservou = true;
for (let i = 0; i < 50; i += 1) {
  const p = prepararQuestao(orig, 1);
  if (p.alternativas[p.correta] !== orig.alternativas[orig.correta]) preservou = false;
}
ok(preservou, "embaralhamento preserva o texto da correta");

const semShuffle = prepararQuestao(orig, 1, { embaralharAlternativas: false });
ok(semShuffle.correta === orig.correta, "modo sem embaralhamento preserva letra correta");
ok(["A", "B", "C", "D"].every(L => semShuffle.alternativas[L] === orig.alternativas[L]), "modo sem embaralhamento preserva ordem original");

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM" : `\n${falhas} FALHA(S)`);
process.exit(falhas === 0 ? 0 : 1);
