# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simulado OAB/FGV — a SaaS exam simulator for Brazil's OAB bar exam (1ª fase, FGV style). Static frontend (HTML + CSS + vanilla JS, no bundler) **plus** Vercel serverless functions (`api/`) backed by Supabase (Postgres + Google OAuth) and Mercado Pago (PIX payments). Deployed on Vercel with auto-deploy on push to `master`. Live at `https://oabsimulado.sistemaspsdev.com.br`.

The frontend has no build step, but the API functions use npm packages (`package.json`, `"type": "module"`, ESM). There is no test suite.

## Development & Deploy

```bash
# Preview the static frontend locally (API routes won't run — they need Vercel)
python -m http.server 8080

# Run the full stack locally (serverless functions + static) — requires Vercel CLI + env vars
vercel dev

# Deploy to production
git push origin master   # Vercel auto-deploys on push

# Python scrapers (scripts/) need: requests, beautifulsoup4
```

There is no lint or test command. Sanity-check API files with `node --check api/path/file.js`.

## Two environments of config — keep them separate

- **Client (public)** — `js/env.js` (`window.OAB_ENV`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`. Safe to commit; the anon key is public by design (RLS protects data).
- **Server (secret)** — Vercel Environment Variables, read via `process.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS), `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `CRON_SECRET`, `ALLOWED_ORIGIN`. Never put these in client files. **Never commit secret files** (a `senha supabase.txt` leak happened once — keep secrets in Vercel only).

## Cache busting — required when editing CSS/JS

Static assets are referenced with `?v=N` query strings (e.g. `css/styles.css?v=8`, `js/auth.js?v=4`). When you change a shared asset, **bump the version in every HTML that loads it**, or browsers/the service worker serve stale copies. This has caused multiple "my fix isn't showing" incidents. Current versions: `styles.css?v=11`, `auth.js?v=8`, `env.js?v=2`, `supabase.js?v=2`, `app.js?v=1` (in simulado.html only).

## clean URLs (vercel.json)

`cleanUrls: true` strips `.html` from every URL. **Always link without the extension and prefer absolute paths**: `/`, `/amostra`, `/admin`, `/privacidade`, `/termos`. Requesting `/index.html` triggers a redirect that, combined with the service worker, previously caused `ERR_FAILED` — never hardcode `index.html` in redirects (`auth.js` redirects to `/`).

## SEO

`robots.txt` (allows all; disallows `/admin`, `/auth-callback`; points to the sitemap) and `sitemap.xml` (the 4 public URLs: `/`, `/amostra`, `/privacidade`, `/termos`) live at the repo root — Vercel serves them as-is. Public pages carry `<link rel="canonical">`, Open Graph + Twitter tags, and `meta robots index,follow`; `index.html` also has a WebSite JSON-LD block. Private pages (`admin.html`, `simulado.html`) carry `meta robots noindex,nofollow`. The og/twitter/canonical URLs are absolute on `https://oabsimulado.sistemaspsdev.com.br`. **When adding a new public page, also add it to `sitemap.xml` and give it a canonical + OG tags.** Indexing still requires the owner to register the site in Google Search Console and submit the sitemap (a manual, one-time action).

## Pages

```
index.html        Landing page: hero, planos (PIX checkout), FAQ. Header shows user chip +
                  subscription badge when logged in; hides "Experimentar grátis" CTAs (.js-amostra-cta)
                  when the user already has access.
simulado.html     The simulator. Guarded: requireAccess() redirects to /?login=1 or /?sem-acesso=1.
amostra.html      Free sample (/amostra): 5 questions, no login. Gabarito only (no comentário).
                  Limited to 3 rounds via localStorage 'oab_amostra_rounds'. Self-contained js/amostra.js.
admin.html        Admin panel (/admin): metrics + user list + manual access toggle. Role-gated.
privacidade.html  / termos.html — legal docs (static, no app header).
auth-callback.html Minimal popup page that closes itself after Supabase processes the OAuth redirect.
```

## Frontend JS

```
js/env.js          window.OAB_ENV — public Supabase config
js/supabase.js     Creates window._supabase (storageKey 'oab_auth', persistSession: true)
js/auth.js         Supabase auth + access gate (details below)
js/config.js       SIMULADO_CONFIG — 20 disciplines, FGV weights (sum=80), colors, 5h duration
js/questions.js    QUESTOES — ~85 hand-authored questions WITH comentário/fundamento
js/questions_oab.js QUESTOES_OAB — ~2000 scraped OAB/FGV questions (3.1MB, do not edit manually)
js/app.js          Core simulator engine (generation, rendering, correction, timer, minimap)
js/amostra.js      Standalone engine for the free sample (does not load app.js)
js/pix-checkout.js window.abrirPixCheckout(plano) — PIX modal: QR code + 5s polling + countdown
js/admin.js        Admin panel logic (calls /api/v1/admin/*)
```

### Script load order (simulado.html / index.html)
`env.js → @supabase CDN → supabase.js → auth.js → [config.js → questions.js → questions_oab.js → app.js]`. The Supabase trio + `auth.js` load first; `simulado.html` runs `requireAccess()` before revealing the body.

## Auth & access gating — js/auth.js

Two methods, both staying on the landing: **e-mail/senha** (Supabase password auth) and **Google OAuth** (popup-based).

**Auth modal (index.html):** `#auth-modal` has two screens — login and cadastro — toggled by `trocarTelaAuth()`. `fazerLogin()` no longer logs in directly; it calls `abrirAuthModal('login')` which **returns a Promise** that resolves with the session when the user authenticates (e-mail or Google) or `null` if they close it. So `irParaSimulado()` / `assinar()` just `await fazerLogin()` and continue automatically once logged in. There is no "esqueci minha senha" yet (planned phase 2 — needs SMTP). Facebook/Apple buttons are intentionally omitted.

- `loginWithEmail(email, senha)` / `signUpWithEmail(nome, email, senha)` — wrap `signInWithPassword` / `signUp` (the latter passes `full_name` into `user_metadata`). Signup assumes **"Confirm email" is OFF** in the Supabase dashboard (immediate access); if it's ON, `signUp` returns a null session and the UI shows a "confirme seu e-mail" message. `traduzirErroAuth()` maps Supabase error strings to PT-BR.
- `loginWithGoogle()` — `signInWithOAuth({ skipBrowserRedirect: true })` + `window.open()` to `/auth-callback`; resolves the session (retries `getSession()` for ~2s while it hydrates from localStorage). The landing also registers a persistent `onAuthStateChange` listener so the header updates whenever the session changes.
- `checkAccess()` → calls `GET /api/v1/user/me` (server decides access) → returns `{ hasAccess, reason, subscription }`. **Mobile-robust:** waits for the session to hydrate (`getSessionResiliente`), and on a `401` (expired `access_token` — common when a phone returns from background before auto-refresh runs) it calls `refreshSession()` and retries instead of treating it as "no subscription". A transient network/API failure returns `reason: 'api_error'` (never silently sends a paying user to the plans page over an expired token).
- `requireAccess()` — used by simulado.html; redirects to `/?login=1` (not logged in) or `/?sem-acesso=1` (no subscription).
- `logoutUser()` — `signOut()` then redirect to `/`.

Session lives in **localStorage** under `oab_auth` (managed by supabase-js), not sessionStorage.

## Backend — Vercel serverless functions (api/)

`api/_lib/server.js` holds shared helpers: `supabaseAdmin()` (service-role client), `setCors`, `ok`/`fail` (responses are `{ data, error }`), `getAuthUser(req, sb)`, `hasActiveAccess(sub)`, and **`ativarAssinaturaPorPagamento(pix)`**.

**Import path convention (this has bitten repeatedly):** the path to `_lib/server.js` is relative to the file's depth:
- `api/v1/x.js` → `../_lib/server.js`
- `api/v1/<dir>/x.js` → `../../_lib/server.js`
- `api/v1/checkout/pix-status/[id].js` → `../../../_lib/server.js`
- `api/v1/admin/users/[id]/access.js` → `../../../../_lib/server.js`

Active endpoints: `user/me.js` (access gate), `checkout/pix.js` (create PIX), `checkout/pix-status/[id].js` (poll + activate), `mp-webhook.js` (MP webhook), `admin/{users,metrics}.js` + `admin/users/[id]/access.js`, `ping.js` (keep-alive).

> The `api/v1/stripe/*` and `api/v1/checkout/{session,portal}.js` files are **legacy Stripe code, inactive**. Payments run on PIX/Mercado Pago. Don't wire new work to Stripe.

## Payment flow (PIX via Mercado Pago)

`abrirPixCheckout(plano)` → `POST /api/v1/checkout/pix` creates the payment with `metadata: { user_id, plano }` **and** `external_reference: "<user_id>|<plano>"`. The modal polls `GET /api/v1/checkout/pix-status/[id]` every 5s.

**Access is granted by `ativarAssinaturaPorPagamento(pix)` (server.js), called from BOTH the polling endpoint and the webhook** — the polling is the primary path (the original webhook-only design left users "paid but no access"). Key robustness rules in that function:
- Identifies the user via `metadata` OR `external_reference` (Mercado Pago can drop/transform metadata keys — `external_reference` is returned verbatim).
- Upserts `subscriptions` by `user_id` (idempotent): `status='active'`, `valido_ate = now + DIAS_PLANO[plano]`.
- Tries the upsert with `mp_payment_id`; if that column is missing it retries without it, so activation never fails on a schema gap.

`PLANOS` (prices/dias) live in `api/v1/checkout/pix.js`; `DIAS_PLANO` in `server.js`. Plans: mensal R$19,90/30d, trimestral R$49,90/90d, semestral R$79,90/180d. Displayed prices in `index.html` MUST match `PLANOS`.

## Supabase data model (supabase/schema.sql)

Tables: `users` (mirrors `auth.users`, has `role` user|admin), `subscriptions` (one per user via unique `user_id`; `status`, `plano`, `valido_ate`, `acesso_manual`, `mp_payment_id`), `simulado_sessions`. RLS restricts each user to their own rows; a trigger auto-creates `users` + `subscriptions` on signup. `hasActiveAccess()` = `acesso_manual === true` OR (`status==='active'` AND `valido_ate > now`). Schema changes are applied manually in the Supabase SQL Editor.

## Keep-alive (Supabase free tier)

Free Supabase pauses after ~7 days of inactivity. `api/v1/ping.js` runs a trivial query; `vercel.json` `crons` calls it daily (`0 6 * * *`). Optionally protected by `CRON_SECRET` (Vercel injects it as a Bearer header on cron calls). Remove once on Supabase Pro.

## Core engine — app.js

**Generation pipeline:**
1. `bancoCompleto()` — merges `QUESTOES` + `QUESTOES_OAB`, validates, normalizes discipline names
2. `questoesFiltradas(opcoes)` — applies discipline/difficulty filters
3. `calcularCotas()` — proportional allocation by FGV weights (Largest Remainder Method)
4. `gerarSimulado()` — calls above, sorts by config discipline order, calls `prepararQuestao()`
5. `prepararQuestao()` — shuffles alternatives, remaps `correta` and `comentario` keys to new positions

`Estado` (global): `{ questoes[], respostas{}, revisao: Set, modoProva, atual, finalizado, inicio, cronInterval, tempoRestante, pausado, alertasEmitidos, opcoes }`. Local-storage keys: `HISTORICO_KEY`, `FONTE_KEY`, `TEMA_KEY` (theme/font are shared with the landing).

### Discipline name normalization
`questions_oab.js` stores names **without accents** (scraper limitation); `config.js` uses accented canonical names. The `DISC_CANON` map in `app.js` translates inside `bancoCompleto()`. Adding a new scraper discipline that misses an accent? Add it to `DISC_CANON`.

### Question schema
```js
{ id, exame, disciplina, topico, dificuldade,        // "facil"|"media"|"dificil"
  enunciado, alternativas: {A,B,C,D}, correta,        // "A"|"B"|"C"|"D"
  fundamento, comentario: {A,B,C,D}, pegadinha }
```
`questions_oab.js` questions have empty `fundamento`/`comentario`/`pegadinha`. The free sample (`amostra.js`) uses `questions.js` only, because those have explanations and are lightweight — but it shows **gabarito only** (no comentário) by product decision.

## CSS — css/styles.css (single file)

- Font: **Inter** is loaded from Google Fonts in every HTML `<head>` (with `preconnect`) and is first in the `body` font stack, so desktop and mobile render the same typeface (previously `'Segoe UI'` only existed on Windows, so phones fell back to Roboto/SF — inconsistent).
- CSS variables in `:root` (dark default); `body.light` overrides all of them (light theme). `color-scheme` on `:root`/`body.light` controls native UI.
- Body classes `.landing-page` / `.simulado-page` scope styles. Custom `.cselect` replaces native `<select>` (native dropdown popup ignores theme on Windows Chrome).
- Breakpoints: `@media (max-width: 900px)` (landing grids + hides hero preview card), `@media (max-width: 640px)` (simulator mobile). `overflow-x: hidden` on `body`.
- When fixing theme contrast, remember light mode needs explicit overrides for elements with hardcoded dark backgrounds (e.g. `.rodape`).

## Scraper reference (scripts/repair.py)

`repair.py` is the canonical scraper; `scraper.py` has known bugs. JurisWay quirks:
- Pages are **ISO-8859-1**: `r.content.decode("iso-8859-1")`
- Alternatives are `<tr><td>A</td><td>text</td></tr>` (not `A) text`)
- Gabarito marker: `<div class="row correta">` with lowercase `a)texto`
- `id_questao` extracted from the single `"Apenas ver Gabarito"` link per page

OAB-FGV exam IDs: `642, 643, 650, 653-658, 661, 662, 673-676, 679-689` (OAB-XXI to OAB-XLVI).
