# ⚖️ Simulado OAB — 47º Exame de Ordem Unificado (estilo FGV)

Sistema web que transforma o **edital do 47º Exame de Ordem Unificado (OAB)** em um
**simulado completo da 1ª fase**, indistinguível em forma e dificuldade de uma prova
real da banca **FGV**. Construído a partir da metodologia do prompt
*"Transforme qualquer edital em um simulado da banca"*.

> **Aviso sobre as questões:** todas as questões do banco são **inéditas e autorais**.
> Elas replicam fielmente o formato, o vocabulário, as pegadinhas, a base legal e a
> distribuição de temas da FGV — **sem reproduzir literalmente** provas anteriores, que
> são protegidas por direito autoral. Cada questão traz fundamento legal e gabarito comentado.

---

## ▶️ Como usar

Não há build nem dependências. Basta abrir o arquivo no navegador:

```bash
# opção 1: abrir direto
xdg-open index.html        # Linux
open index.html            # macOS

# opção 2: servir localmente (recomendado)
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

1. Na tela inicial, opcionalmente ative o **Modo prova** (uma questão por vez).
2. Clique em **Gerar simulado** — o sistema monta 80 questões na distribuição real.
3. Responda e clique em **Finalizar** para ver a nota, o desempenho por disciplina,
   o **mapa de revisão** e o **gabarito comentado** (fundamento legal + por que cada
   distrator está errado + a pegadinha usada).

---

## 🧠 Como o sistema reproduz a prova (mapeamento ao prompt)

| Etapa do prompt | Onde está implementada |
|-----------------|------------------------|
| **Etapa 1 — Análise do edital** | [`docs/analise-edital.md`](docs/analise-edital.md): identificação, estrutura (80 questões, 4 alternativas, nota de corte 40) e mapa de conteúdo. |
| **Pareto Recursivo (80/20 duplo)** | [`docs/analise-edital.md`](docs/analise-edital.md) §4 — tópicos e subtópicos mais incidentes por disciplina. |
| **Etapa 2 — Clonagem do estilo FGV** | [`docs/analise-edital.md`](docs/analise-edital.md) §5 — casos concretos, 4 alternativas plausíveis, lei + jurisprudência, interdisciplinaridade. |
| **Etapa 3 — Geração do simulado** | [`js/app.js`](js/app.js) `gerarSimulado()` — respeita a distribuição de [`js/config.js`](js/config.js) e o piso de 15% (Ética + DH + Filosofia ≥ 12). |
| **Etapa 4 — Gabarito comentado** | [`js/app.js`](js/app.js) `renderResultado()` + campo `comentario` de cada questão. |
| **Etapa 5 — Modo prova** | Checkbox "Modo prova": uma questão por vez, correção só ao final. |

### Distribuição por disciplina (soma = 80)

Calibrada pelo histórico recente da FGV no Exame de Ordem (ver `js/config.js`).
Ética 8 · Constitucional 7 · Civil 7 · Administrativo 6 · Penal 6 · Trabalho 6 ·
Proc. Civil 6 · Tributário 5 · Proc. Penal 5 · Empresarial 5 · Proc. Trabalho 3 ·
Direitos Humanos 3 · Consumidor 2 · Filosofia 2 · Internacional 2 · Ambiental 2 ·
ECA 2 · Previdenciário 1 · Eleitoral 1 · Financeiro 1.

---

## 📁 Estrutura do projeto

```
oab/
├── index.html              # interface (3 telas: início, prova, resultado)
├── css/styles.css          # estilos
├── js/
│   ├── config.js           # estrutura do exame + distribuição + Pareto
│   ├── questions.js        # banco de questões (85 inéditas, estilo FGV)
│   └── app.js              # motor: geração, aplicação, correção, estatísticas
├── data/test-engine.js     # testes do motor (node data/test-engine.js)
└── docs/
    ├── analise-edital.md   # Etapa 1 + Pareto + clonagem de estilo
    └── prompt-sistema-oab.md  # prompt-sistema especializado p/ gerar mais questões
```

---

## ➕ Como ampliar o banco de questões

Cada questão segue este esquema em [`js/questions.js`](js/questions.js):

```js
{
  id: "civil-009",
  disciplina: "Direito Civil",          // deve bater com config.js
  topico: "Responsabilidade civil",
  dificuldade: "media",                  // "facil" | "media" | "dificil"
  enunciado: "Caso concreto + comando objetivo...",
  alternativas: { A: "...", B: "...", C: "...", D: "..." },
  correta: "B",
  fundamento: "Art. X da Lei Y / Súmula Z do STJ...",
  comentario: { A: "...", B: "...", C: "...", D: "..." },
  pegadinha: "Armadilha típica da banca (opcional)."
}
```

Para manter o estilo FGV ao escrever novas questões, use o prompt-sistema em
[`docs/prompt-sistema-oab.md`](docs/prompt-sistema-oab.md). Depois rode os testes:

```bash
node data/test-engine.js
```

---

## ✅ Garantias do motor (testadas)

- Gera exatamente **80 questões** sem repetição.
- Respeita a distribuição por disciplina e o **piso de 15%**.
- Cada questão tem **4 alternativas e uma única correta**.
- O **embaralhamento de alternativas** preserva o vínculo com o gabarito.

Uso educacional. Não substitui o edital oficial nem a legislação vigente.
