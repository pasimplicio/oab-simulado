#!/usr/bin/env python3
"""
Scraper de Questões OAB — JurisWay
===================================
Coleta todas as questões dos exames OAB 1ª fase (bancas FGV e CESPE)
disponíveis em jurisway.org.br e gera o banco no formato questions_oab.js.

Pré-requisitos:
    pip install requests beautifulsoup4

Uso:
    cd oab/scripts
    python scraper.py

Saída:
    scripts/checkpoint.json   — progresso salvo (pode interromper e retomar)
    scripts/questoes_raw.json — dados brutos de todas as questões
    js/questions_oab.js       — banco pronto para uso no app
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os
import re
import sys

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------

BASE_URL = "https://www.jurisway.org.br/v2/"

# IDs dos exames no JurisWay.
# Padrão confirmado: OAB 42 = 685, OAB 43 = 686, OAB 44 = 687 ...
# ∴ OAB N = 643 + N  (para N de 1 a 46)
EXAMES = {f"OAB{n:02d}": 643 + n for n in range(1, 47)}

CHECKPOINT_FILE = os.path.join(os.path.dirname(__file__), "checkpoint.json")
OUTPUT_JSON     = os.path.join(os.path.dirname(__file__), "questoes_raw.json")
OUTPUT_JS       = os.path.join(os.path.dirname(__file__), "..", "js", "questions_oab.js")

# Mapeamento: nome no JurisWay → nome canônico no app
DISCIPLINA_MAP = {
    "Estatuto da OAB":                        "Ética Profissional",
    "Código de Ética":                        "Ética Profissional",
    "Ética Profissional":                     "Ética Profissional",
    "Filosofia do Direito":                   "Filosofia do Direito",
    "Direito Constitucional":                 "Direito Constitucional",
    "Direitos Humanos":                       "Direitos Humanos",
    "Direito Eleitoral":                      "Direito Eleitoral",
    "Direito Internacional":                  "Direito Internacional",
    "Direito Financeiro":                     "Direito Financeiro",
    "Direito Tributário":                     "Direito Tributário",
    "Direito Administrativo":                 "Direito Administrativo",
    "Direito Ambiental":                      "Direito Ambiental",
    "Direito Civil":                          "Direito Civil",
    "Estatuto da Criança":                    "Direito da Criança e do Adolescente",
    "Criança e Adolescente":                  "Direito da Criança e do Adolescente",
    "ECA":                                    "Direito da Criança e do Adolescente",
    "Direito do Consumidor":                  "Direito do Consumidor",
    "Direito Empresarial":                    "Direito Empresarial",
    "Direito Processual Civil":               "Direito Processual Civil",
    "Direito Penal":                          "Direito Penal",
    "Direito Processual Penal":               "Direito Processual Penal",
    "Direito Previdenciário":                 "Direito Previdenciário",
    "Direito do Trabalho":                    "Direito do Trabalho",
    "Direito Processual do Trabalho":         "Direito Processual do Trabalho",
}

# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------

def get_session():
    s = requests.Session()
    s.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0 Safari/537.36"
        ),
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Referer": "https://www.jurisway.org.br/",
    })
    return s


def fetch(session, url, retries=3):
    for attempt in range(retries):
        try:
            r = session.get(url, timeout=20)
            r.encoding = r.apparent_encoding or "utf-8"
            if r.status_code == 200:
                return r.text
            print(f"    HTTP {r.status_code} → {url}")
        except Exception as exc:
            print(f"    Tentativa {attempt + 1}/{retries} falhou: {exc}")
        time.sleep(2 ** attempt + random.random())
    return None

# ---------------------------------------------------------------------------
# Parsing — página de questão
# ---------------------------------------------------------------------------

def mapear_disciplina(texto):
    texto = (texto or "").strip()
    for chave, valor in DISCIPLINA_MAP.items():
        if chave.lower() in texto.lower():
            return valor
    return texto or "Desconhecida"


def parse_questao(html, id_prova, idx):
    """Extrai disciplina, id_questao, enunciado e alternativas da página."""
    soup = BeautifulSoup(html, "html.parser")
    full_text = soup.get_text(" ", strip=True)

    # --- id_questao (presente no link do gabarito) ---
    id_questao = None
    for a in soup.find_all("a", href=True):
        m = re.search(r"id_questao=(\d+)", a["href"])
        if m:
            id_questao = m.group(1)
            break

    # --- Disciplina ---
    disciplina_raw = ""
    # Busca em cabeçalhos, células de tabela e spans
    for tag in soup.find_all(["h1", "h2", "h3", "h4", "b", "strong", "td", "span"]):
        t = tag.get_text(strip=True)
        if any(k.lower() in t.lower() for k in DISCIPLINA_MAP):
            disciplina_raw = t
            break
    # Fallback: procura no texto completo
    if not disciplina_raw:
        for chave in DISCIPLINA_MAP:
            if chave.lower() in full_text.lower():
                disciplina_raw = chave
                break
    disciplina = mapear_disciplina(disciplina_raw)

    # --- Enunciado ---
    # Estratégia: maior parágrafo de texto antes de aparecer "A)" ou "(A)"
    enunciado = ""
    candidatos = []
    for p in soup.find_all(["p", "div", "td"]):
        t = p.get_text(" ", strip=True)
        # Ignora textos muito curtos, de navegação ou que parecem ser alternativas
        if (
            len(t) > 80
            and not re.match(r"^\s*[ABCD][)\.]", t)
            and "jurisway" not in t.lower()
            and "gabarito" not in t.lower()
            and "pular" not in t.lower()
        ):
            candidatos.append(t)
    if candidatos:
        # Pega o texto mais longo como enunciado principal
        enunciado = max(candidatos, key=len)

    # --- Alternativas ---
    alternativas = {"A": "", "B": "", "C": "", "D": ""}

    # Padrão 1: "A) texto", "B) texto" em elementos separados
    for tag in soup.find_all(["p", "div", "td", "li", "tr"]):
        t = tag.get_text(" ", strip=True)
        m = re.match(r"^\s*([ABCD])\s*[).\-]\s*(.+)$", t, re.DOTALL)
        if m:
            letra, texto = m.group(1), m.group(2).strip()
            if letra in alternativas and not alternativas[letra]:
                alternativas[letra] = texto

    # Padrão 2: texto corrido com "A) ... B) ... C) ... D) ..."
    if not all(alternativas.values()):
        m_all = re.findall(r"([ABCD])\s*[).\-]\s*(.+?)(?=\s*[ABCD]\s*[).\-]|\Z)", full_text, re.DOTALL)
        for letra, texto in m_all:
            if letra in alternativas and not alternativas[letra]:
                alternativas[letra] = texto.strip()

    return {
        "id_questao": id_questao,
        "disciplina":  disciplina,
        "enunciado":   enunciado,
        "alternativas": alternativas,
    }

# ---------------------------------------------------------------------------
# Parsing — página de gabarito
# ---------------------------------------------------------------------------

def parse_gabarito(html):
    """Extrai a alternativa correta e a dificuldade da página de gabarito."""
    if not html:
        return None, "media"

    soup = BeautifulSoup(html, "html.parser")
    full_text = soup.get_text(" ", strip=True)

    # --- Dificuldade via percentual de acertos ---
    dificuldade = "media"
    m_pct = re.search(r"(\d+)%\s*(acertaram|de acertos)", full_text, re.IGNORECASE)
    if m_pct:
        pct = int(m_pct.group(1))
        if pct >= 60:
            dificuldade = "facil"
        elif pct <= 40:
            dificuldade = "dificil"

    # Texto explícito de dificuldade
    if "Questão Fácil" in full_text:
        dificuldade = "facil"
    elif "Questão Difícil" in full_text:
        dificuldade = "dificil"

    # --- Alternativa correta ---
    correta = None

    # Estratégia 1: elemento com checkmark (✓) próximo de uma letra
    for el in soup.find_all(string=re.compile(r"✓|✔|☑")):
        parent = el.find_parent(["tr", "li", "div", "td", "p"])
        if parent:
            t = parent.get_text(" ", strip=True)
            m = re.search(r"\b([ABCD])\b", t)
            if m:
                correta = m.group(1)
                break

    # Estratégia 2: imagem com alt contendo a letra (alguns sites usam ícones)
    if not correta:
        for img in soup.find_all("img", alt=True):
            if img["alt"].strip() in ("A", "B", "C", "D"):
                # Verifica se é o ícone de correto
                src = img.get("src", "").lower()
                if any(w in src for w in ("certo", "correto", "ok", "check", "verde")):
                    correta = img["alt"].strip()
                    break

    # Estratégia 3: padrão textual "Gabarito: X" ou "Resposta: X"
    if not correta:
        for padrao in [
            r"[Gg]abarito\s*[:\-]\s*([ABCD])",
            r"[Rr]esposta\s*[:\-]\s*([ABCD])",
            r"[Aa]lternativa\s+([ABCD])\s+está\s+correta",
            r"correta\s+é\s+a?\s+([ABCD])",
        ]:
            m = re.search(padrao, full_text)
            if m:
                correta = m.group(1)
                break

    # Estratégia 4: elemento destacado (bold/cor) contendo apenas a letra
    if not correta:
        for tag in soup.find_all(["b", "strong", "span"]):
            t = tag.get_text(strip=True)
            if t in ("A", "B", "C", "D"):
                # Verifica contexto — se parece ser a resposta
                parent_text = (tag.find_parent() or tag).get_text(strip=True)
                if "corret" in parent_text.lower() or "gabarito" in parent_text.lower():
                    correta = t
                    break

    return correta, dificuldade

# ---------------------------------------------------------------------------
# Geração do JS
# ---------------------------------------------------------------------------

def gerar_js(questoes, caminho):
    linhas = [
        "/**\n",
        " * Banco de questões extraído dos Exames OAB 1ª fase (JurisWay)\n",
        f" * Total: {len(questoes)} questões\n",
        " * Gerado automaticamente por scripts/scraper.py\n",
        " */\n\n",
        "const QUESTOES_OAB = [\n",
    ]

    for q in questoes:
        alt = q["alternativas"]
        linhas.append(
            "  {\n"
            f"    id: {json.dumps(q['id'])},\n"
            f"    exame: {json.dumps(q.get('exame', ''))},\n"
            f"    disciplina: {json.dumps(q['disciplina'])},\n"
            f"    topico: {json.dumps(q.get('topico', q['disciplina']))},\n"
            f"    dificuldade: {json.dumps(q['dificuldade'])},\n"
            f"    enunciado: {json.dumps(q['enunciado'])},\n"
            f"    alternativas: {{\n"
            f"      A: {json.dumps(alt.get('A', ''))},\n"
            f"      B: {json.dumps(alt.get('B', ''))},\n"
            f"      C: {json.dumps(alt.get('C', ''))},\n"
            f"      D: {json.dumps(alt.get('D', ''))},\n"
            f"    }},\n"
            f"    correta: {json.dumps(q['correta'])},\n"
            f"    fundamento: {json.dumps(q.get('fundamento', ''))},\n"
            f"    comentario: {{A: \"\", B: \"\", C: \"\", D: \"\"}},\n"
            f"    pegadinha: null,\n"
            f"  }},\n"
        )

    linhas.append("];\n\n")
    linhas.append("if (typeof module !== \"undefined\" && module.exports) {\n")
    linhas.append("  module.exports = { QUESTOES_OAB };\n")
    linhas.append("}\n")

    with open(caminho, "w", encoding="utf-8") as f:
        f.writelines(linhas)

    print(f"\n✓ {caminho} gerado com {len(questoes)} questões")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("  Scraper OAB — JurisWay")
    print("=" * 60)

    # Carrega checkpoint (permite interromper e retomar)
    todas = {}
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            todas = json.load(f)
        print(f"Checkpoint: {len(todas)} questões já coletadas\n")

    session = get_session()

    for nome, id_prova in EXAMES.items():
        pendentes = [i for i in range(80) if f"{id_prova}-{i}" not in todas]
        if not pendentes:
            print(f"{nome} (id={id_prova}) — já completo, pulando")
            continue

        print(f"\n{'─'*50}")
        print(f"  {nome}  (id_prova={id_prova})  — {len(pendentes)} questões pendentes")
        print(f"{'─'*50}")

        for idx in pendentes:
            url_q = f"{BASE_URL}Provas_Resolver.asp?id_prova={id_prova}&id_questao_atual={idx}"
            html_q = fetch(session, url_q)

            if not html_q:
                print(f"  [{idx+1:2d}/80] FALHA — pulando")
                continue

            q = parse_questao(html_q, id_prova, idx)

            # Busca gabarito
            correta, dificuldade = None, "media"
            if q["id_questao"]:
                url_g = f"{BASE_URL}Provas_Responder.asp?id_prova={id_prova}&id_questao={q['id_questao']}"
                html_g = fetch(session, url_g)
                correta, dificuldade = parse_gabarito(html_g)
                time.sleep(random.uniform(0.5, 1.0))  # pausa entre questão e gabarito

            questao = {
                "id":          f"oab{id_prova}-q{idx+1:03d}",
                "exame":       nome,
                "disciplina":  q["disciplina"],
                "topico":      q["disciplina"],
                "dificuldade": dificuldade,
                "enunciado":   q["enunciado"],
                "alternativas": q["alternativas"],
                "correta":     correta,
                "fundamento":  "",
                "comentario":  {"A": "", "B": "", "C": "", "D": ""},
                "pegadinha":   None,
            }

            chave = f"{id_prova}-{idx}"
            todas[chave] = questao

            status = f"correta={correta}" if correta else "⚠ sem gabarito"
            print(f"  [{idx+1:2d}/80] {q['disciplina'][:35]:<35} {status} | {dificuldade}")

            # Salva checkpoint após cada questão
            with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
                json.dump(todas, f, ensure_ascii=False)

            time.sleep(random.uniform(1.0, 2.0))  # pausa entre questões

    # Filtra apenas questões com enunciado e gabarito
    validas = [
        v for v in todas.values()
        if v.get("enunciado") and v.get("correta") and len(v["enunciado"]) > 30
    ]
    invalidas = len(todas) - len(validas)

    print(f"\n{'='*60}")
    print(f"  Coleta concluída!")
    print(f"  Total coletado : {len(todas)}")
    print(f"  Válidas        : {len(validas)}")
    print(f"  Descartadas    : {invalidas}  (sem enunciado ou gabarito)")
    print(f"{'='*60}")

    # Salva JSON bruto
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(validas, f, ensure_ascii=False, indent=2)
    print(f"\n✓ JSON bruto salvo em: {OUTPUT_JSON}")

    # Gera o arquivo JS para o app
    gerar_js(validas, OUTPUT_JS)

    print("\nPróximo passo:")
    print("  Abra index.html e adicione antes de </body>:")
    print('  <script src="js/questions_oab.js"></script>')
    print("  Depois atualize js/app.js para combinar QUESTOES + QUESTOES_OAB")


if __name__ == "__main__":
    main()
