# Simulado OAB/FGV - PSDEV Sistemas

Sistema web estatico para treino da 1a fase da OAB no formato FGV. O projeto
usa HTML, CSS e JavaScript puro, sem build, sem backend e sem dependencias.

## Como usar

```bash
python -m http.server 8000
```

Depois acesse:

- Landing page: `http://localhost:8000`
- Simulado: `http://localhost:8000/simulado.html`

Tambem e possivel abrir os arquivos diretamente no navegador.

## O que o sistema oferece

- Simulado de 20, 40 ou 80 questoes.
- Distribuicao por disciplina baseada no modelo da 1a fase.
- Filtros por disciplina e dificuldade.
- Modo prova, com uma questao por vez e correcao somente ao final.
- Modo livre, com feedback visual imediato.
- Cronometro regressivo de 5 horas com pausa/continuidade.
- Minimapa navegavel das questoes.
- Marcar questoes para revisao.
- Resultado por disciplina e mapa de revisao.
- Historico local via `localStorage`.
- Tema claro/escuro e ajuste de tamanho da fonte.

## Banco de questoes

O projeto usa um banco de questoes para treino OAB/FGV, combinando:

- `js/questions.js`: questoes estruturadas no formato interno do projeto.
- `js/questions_oab.js`: questoes organizadas a partir de exames OAB/FGV.

Por isso, a comunicacao do produto nao promete que 100% do banco seja inedito
ou autoral. O posicionamento correto e: **banco de questoes para treino,
organizado por disciplina, dificuldade e formato da prova**.

## Estrutura

```text
oab/
├── index.html              # Landing page estatica
├── simulado.html           # Aplicacao do simulado
├── css/styles.css          # Estilos compartilhados
├── js/
│   ├── config.js           # Configuracao do exame
│   ├── questions.js        # Banco estruturado do projeto
│   ├── questions_oab.js    # Banco OAB/FGV organizado
│   └── app.js              # Motor e interacoes do simulado
├── data/test-engine.js     # Testes do motor
└── docs/                   # Documentos de apoio
```

## Testes

```bash
node data/test-engine.js
```

Os testes validam geracao de simulados, filtros, ausencia de repeticao,
estrutura das alternativas e preservacao do gabarito com ou sem embaralhamento.

## Deploy

O projeto continua compativel com hospedagem estatica, como GitHub Pages, Vercel
ou Netlify. Nao ha login, pagamento ou captura real de leads nesta fase.
