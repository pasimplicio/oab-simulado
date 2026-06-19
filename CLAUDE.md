# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simulado OAB/FGV — static web app (HTML + CSS + Vanilla JS, zero build step, zero npm). Deployed on Vercel with auto-deploy on push to `master`. Live at `https://oabsimulado.sistemaspsdev.com.br`.

## Development & Deploy

No build step. Edit files and open in browser directly, or:

```bash
# Preview locally (Python)
python -m http.server 8080

# Deploy to production
git push origin master   # Vercel auto-deploys on push
```

For the Python scraper scripts (`scripts/`), requires `requests` and `beautifulsoup4`.

## File Architecture

```
index.html         Landing page with Google auth modal; all "Começar simulado" buttons
                   intercept clicks and check auth before redirecting to simulado.html
simulado.html      Simulator (guarded — redirects to index.html?login=1 if not authed)
css/styles.css     Single CSS file: CSS variables, dark/light themes, all responsive rules
js/auth.js         Google Identity Services auth; session in sessionStorage under oab_auth_user
js/config.js       SIMULADO_CONFIG — 20 disciplines, FGV weights (sum=80), colors, 5h duration
js/questions.js    QUESTOES — ~85 hand-authored questions
js/questions_oab.js QUESTOES_OAB — 2008 scraped OAB/FGV questions (3.1MB, do not edit manually)
js/app.js          Core engine: generation, rendering, correction, cronômetro, minimapa, flags
scripts/repair.py  Canonical scraper (correct parser). scraper.py has known bugs — use repair.py
```

## Script Load Order (simulado.html)

```
auth.js → config.js → questions.js → questions_oab.js → app.js
```

`auth.js` runs first (before DOMContentLoaded) to redirect unauthenticated users immediately.

## Core Engine — app.js

**Generation pipeline:**
1. `bancoCompleto()` — merges `QUESTOES` + `QUESTOES_OAB`, validates, normalizes discipline names
2. `questoesFiltradas(opcoes)` — applies discipline/difficulty filters
3. `calcularCotas()` — proportional allocation by FGV weights (Largest Remainder Method)
4. `gerarSimulado()` — calls above, sorts by discipline order from config, calls `prepararQuestao()`
5. `prepararQuestao()` — shuffles alternatives, remaps `correta` and `comentario` keys to new positions

**Global state:**
```js
Estado = { questoes[], respostas{}, revisao: Set, modoProva, atual, finalizado,
           inicio, cronInterval, tempoRestante, pausado, alertasEmitidos, opcoes }
```

**Key constants:** `HISTORICO_KEY`, `FONTE_KEY`, `TEMA_KEY` — all in localStorage.

## Discipline Name Normalization

`js/questions_oab.js` stores discipline names **without accents** (scraper limitation).  
`js/config.js` uses accented names (canonical).  
`DISC_CANON` map in `app.js` translates at runtime inside `bancoCompleto()`. If you add a new scraper discipline that misses an accent, add it to `DISC_CANON`.

## Question Schema

```js
{
  id, exame, disciplina, topico, dificuldade,  // "facil" | "media" | "dificil"
  enunciado, alternativas: { A, B, C, D }, correta,  // correta is "A"|"B"|"C"|"D"
  fundamento, comentario: { A, B, C, D }, pegadinha
}
```

`questions_oab.js` questions have empty `fundamento`, `comentario`, and `pegadinha` (not available from JurisWay).

## Auth Flow

- `auth.js` exposes `getUser()`, `setUser()`, `logoutUser()`, `requireAuth()`, `initGoogleAuth(btnContainerId)`
- Session is stored in `sessionStorage` (cleared on tab close) — not localStorage
- `requireAuth()` is called synchronously at top of `simulado.html` head; redirects immediately if no session
- Google Client ID is hardcoded in `auth.js:4`. To add a new authorized origin: Google Cloud Console → Credentials → OAuth 2.0 Client ID → Authorized JavaScript origins

## CSS Architecture

Single file `css/styles.css`. Key sections:
- CSS variables in `:root` — dark theme defaults (`--navy`, `--blue2`, `--cyan`, etc.)
- `body.light` block overrides all variables for light theme
- `.landing-page` / `.simulado-page` body classes scope landing vs simulator styles
- Breakpoints: `@media (max-width: 900px)` — collapses landing grids + hides hero preview card; `@media (max-width: 640px)` — mobile adjustments for simulator
- `overflow-x: hidden` on `body` prevents horizontal scroll from grid overflow

## Scraper Reference (scripts/repair.py)

JurisWay quirks that caused silent failures in the original scraper:
- Pages are **ISO-8859-1**, not UTF-8: use `r.content.decode("iso-8859-1")`
- Alternatives are in `<tr><td>A</td><td>text</td></tr>` — not `A) text` format
- Gabarito marker: `<div class="row correta">` with lowercase letter `a)texto`
- `id_questao` (for gabarito URL) is extracted from the single `"Apenas ver Gabarito"` link per page

OAB-FGV exam IDs: `642, 643, 650, 653-658, 661, 662, 673-676, 679-689` (OAB-XXI to OAB-XLVI).
