/**
 * Configuração do Simulado OAB — 47º Exame de Ordem Unificado (banca FGV)
 * Derivada da análise do edital (ver docs/analise-edital.md).
 *
 * - Prova objetiva: 80 questões, 4 alternativas (A–D), resposta única.
 * - Aprovação: 40 pontos (50%).
 * - Distribuição calibrada pelo histórico recente da FGV no Exame de Ordem.
 */

const SIMULADO_CONFIG = {
  exame: "47º Exame de Ordem Unificado",
  banca: "FGV",
  totalQuestoes: 80,
  notaCorte: 40,
  alternativas: ["A", "B", "C", "D"],
  duracaoMinutos: 300, // 5 horas

  // Distribuição-alvo por disciplina (soma = 80).
  // 'peso' é o número de questões da disciplina na prova real estimada.
  distribuicao: [
    { disciplina: "Ética Profissional",            peso: 8 },
    { disciplina: "Direito Constitucional",        peso: 7 },
    { disciplina: "Direito Civil",                 peso: 7 },
    { disciplina: "Direito Administrativo",        peso: 6 },
    { disciplina: "Direito Penal",                 peso: 6 },
    { disciplina: "Direito do Trabalho",           peso: 6 },
    { disciplina: "Direito Processual Civil",      peso: 6 },
    { disciplina: "Direito Tributário",            peso: 5 },
    { disciplina: "Direito Processual Penal",      peso: 5 },
    { disciplina: "Direito Empresarial",           peso: 5 },
    { disciplina: "Direito Processual do Trabalho",peso: 3 },
    { disciplina: "Direitos Humanos",              peso: 3 },
    { disciplina: "Direito do Consumidor",         peso: 2 },
    { disciplina: "Filosofia do Direito",          peso: 2 },
    { disciplina: "Direito Internacional",         peso: 2 },
    { disciplina: "Direito Ambiental",             peso: 2 },
    { disciplina: "Direito da Criança e do Adolescente", peso: 2 },
    { disciplina: "Direito Previdenciário",        peso: 1 },
    { disciplina: "Direito Eleitoral",             peso: 1 },
    { disciplina: "Direito Financeiro",            peso: 1 },
  ],

  // Distribuição-alvo de dificuldade (padrão da banca).
  dificuldade: { facil: 0.30, media: 0.50, dificil: 0.20 },

  // Cores por disciplina (UI).
  cores: {
    "Ética Profissional": "#b8860b",
    "Direito Constitucional": "#2563eb",
    "Direito Civil": "#16a34a",
    "Direito Administrativo": "#9333ea",
    "Direito Penal": "#dc2626",
    "Direito do Trabalho": "#ea580c",
    "Direito Processual Civil": "#0891b2",
    "Direito Tributário": "#65a30d",
    "Direito Processual Penal": "#be123c",
    "Direito Empresarial": "#7c3aed",
    "Direito Processual do Trabalho": "#c2410c",
    "Direitos Humanos": "#0d9488",
    "Direito do Consumidor": "#059669",
    "Filosofia do Direito": "#6b7280",
    "Direito Internacional": "#4f46e5",
    "Direito Ambiental": "#15803d",
    "Direito da Criança e do Adolescente": "#db2777",
    "Direito Previdenciário": "#0284c7",
    "Direito Eleitoral": "#7e22ce",
    "Direito Financeiro": "#a16207",
  },
};

// Disponível para Node (testes) e browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SIMULADO_CONFIG };
}
