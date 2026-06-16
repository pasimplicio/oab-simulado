/* Teste rápido do motor de geração (Node). Execute: node data/test-engine.js */
global.SIMULADO_CONFIG = require("../js/config.js").SIMULADO_CONFIG;
global.QUESTOES = require("../js/questions.js").QUESTOES;
const { gerarSimulado, prepararQuestao } = require("../js/app.js");

let falhas = 0;
const ok = (c, m) => { if (!c) { console.log("✗", m); falhas++; } else console.log("✓", m); };

// 1. Gera 80 questões
const s = gerarSimulado(80);
ok(s.length === 80, `gera 80 questões (gerou ${s.length})`);

// 2. Sem repetição de id
const ids = s.map((q) => q.id);
ok(new Set(ids).size === ids.length, "sem questões repetidas");

// 3. Cada questão tem exatamente uma correta válida e 4 alternativas
let estruturaOk = true;
s.forEach((q) => {
  const letras = Object.keys(q.alternativas);
  if (letras.length !== 4) estruturaOk = false;
  if (!["A", "B", "C", "D"].includes(q.correta)) estruturaOk = false;
  if (!q.alternativas[q.correta]) estruturaOk = false;
});
ok(estruturaOk, "todas com 4 alternativas e 1 gabarito válido");

// 4. Distribuição respeita a meta por disciplina (>= peso quando há banco suficiente)
const cont = {};
s.forEach((q) => (cont[q.disciplina] = (cont[q.disciplina] || 0) + 1));
let distOk = true;
SIMULADO_CONFIG.distribuicao.forEach((d) => {
  if ((cont[d.disciplina] || 0) < d.peso) { distOk = false; console.log("  faltou", d.disciplina, cont[d.disciplina], "<", d.peso); }
});
ok(distOk, "distribuição por disciplina respeitada");

// 5. Piso de 15% (Ética + DH + Filosofia >= 12)
const piso = (cont["Ética Profissional"] || 0) + (cont["Direitos Humanos"] || 0) + (cont["Filosofia do Direito"] || 0);
ok(piso >= 12, `piso de 15% atendido (bloco = ${piso} questões)`);

// 6. Embaralhar alternativas preserva o texto da correta
const orig = QUESTOES.find((q) => q.id === "etica-001");
let preservou = true;
for (let i = 0; i < 50; i++) {
  const p = prepararQuestao(orig, 1);
  if (p.alternativas[p.correta] !== orig.alternativas[orig.correta]) preservou = false;
}
ok(preservou, "embaralhamento de alternativas preserva o gabarito");

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM ✅" : `\n${falhas} FALHA(S) ❌`);
process.exit(falhas === 0 ? 0 : 1);
