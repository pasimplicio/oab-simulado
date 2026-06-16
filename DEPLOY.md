# Deploy na Vercel + domínio `oab.sistemaspsdev.com.br` (Cloudflare DNS)

Este projeto é um **site estático** (HTML/CSS/JS, sem build). Não precisa de framework
nem de `npm install`. Há duas formas de publicar.

---

## Opção A — Vercel CLI (mais rápida, sem precisar do Git)

Na sua máquina, dentro da pasta do projeto (a que contém `index.html`):

```bash
npm i -g vercel        # instala a CLI (uma vez)
vercel login           # autentica na sua conta
vercel                 # 1º deploy: aceite os padrões; "framework? Other"
vercel --prod          # publica em produção
```

Quando perguntar o diretório raiz, mantenha `./`. Como não há build, deixe o
**Build Command vazio** e o **Output Directory** como `.` (raiz).

---

## Opção B — Painel da Vercel (arrastar e soltar)

1. Acesse <https://vercel.com/new>.
2. Em vez de importar do Git, use **"Deploy" → "Browse"** e selecione a pasta do
   projeto (ou arraste a pasta para a área de upload).
3. Framework Preset: **Other**. Build Command: vazio. Output Directory: `./`.
4. Clique em **Deploy**.

> Quando você conseguir fazer push do repositório para o GitHub, pode também usar
> **"Import Git Repository"** para ter deploy automático a cada commit.

---

## Configurar o domínio `oab.sistemaspsdev.com.br`

### 1. Adicionar o domínio no projeto Vercel
- No projeto: **Settings → Domains → Add**.
- Digite: `oab.sistemaspsdev.com.br` → **Add**.
- A Vercel mostrará o registro DNS a criar. Para **subdomínio**, normalmente é um
  **CNAME**:

  | Tipo  | Nome (host) | Valor                     |
  |-------|-------------|---------------------------|
  | CNAME | `oab`       | `cname.vercel-dns.com`    |

  > Use exatamente o valor que a Vercel exibir na sua tela (pode variar, ex.:
  > `cname.vercel-dns.com.` ou um host específico do projeto).

### 2. Criar o registro no Cloudflare
- Cloudflare → selecione `sistemaspsdev.com.br` → **DNS → Records → Add record**:
  - **Type:** `CNAME`
  - **Name:** `oab`
  - **Target:** `cname.vercel-dns.com` (o valor informado pela Vercel)
  - **Proxy status:** **DNS only** (nuvem **cinza**, não laranja) ⚠️

> **Importante:** deixe em **DNS only** (proxy desligado). O proxy laranja do
> Cloudflare costuma conflitar com a emissão do certificado SSL e a verificação de
> domínio da Vercel. Depois que estiver tudo funcionando, se quiser usar o proxy do
> Cloudflare, ative com cautela e ajuste o modo SSL/TLS para **Full (strict)**.

### 3. Aguardar verificação e SSL
- Volte na Vercel; em alguns minutos o domínio fica **Valid Configuration** e a Vercel
  emite o certificado HTTPS automaticamente (Let's Encrypt).
- Propagação do DNS costuma levar de poucos minutos a algumas horas.

---

## Verificação rápida

```bash
# o CNAME deve apontar para a Vercel
dig +short oab.sistemaspsdev.com.br CNAME

# deve responder 200 e servir o index.html
curl -I https://oab.sistemaspsdev.com.br
```

Pronto: o simulado estará no ar em `https://oab.sistemaspsdev.com.br`.
