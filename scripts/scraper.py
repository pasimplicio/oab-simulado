#!/usr/bin/env python3
"""
Scraper de Questões OAB — JurisWay
===================================
Coleta todas as questões dos exames OAB 1ª fase disponíveis no JurisWay
e gera o banco no formato questions_oab.js.

Pré-requisitos:
    py -m pip install requests beautifulsoup4

Uso:
    cd oab/scripts
    py scraper.py

Saída:
    scripts/checkpoint.json   — progresso salvo (pode interromper e retomar)
    js/questions_oab.js       — banco pronto para uso no app
"""

import sys
import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os
import re

# Força UTF-8 no stdout para não explodir em terminais cp1252
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------

BASE_URL = "https://www.jurisway.org.br/v2/"

# IDs confirmados por varredura em junho/2026.
# Exames OAB 1ª fase (FGV), do XXI ao XLVI.
EXAMES = {
    "OAB-XXI":    642,
    "OAB-XXII":   643,
    "OAB-XXIII":  650,
    "OAB-XXIV":   653,
    "OAB-XXV":    654,
    "OAB-XXVI":   655,
    "OAB-XXVII":  656,
    "OAB-XXVIII": 657,
    "OAB-XXIX":   658,
    "OAB-XXX":    661,
    "OAB-XXXI":   662,
    "OAB-XXXII":  673,
    "OAB-XXXIII": 674,
    "OAB-XXXIV":  675,
    "OAB-XXXV":   676,
    "OAB-XXXVI":  679,
    "OAB-XXXVII": 680,
    "OAB-XXXVIII":681,
    "OAB-XXXIX":  682,
    "OAB-XL":     683,
    "OAB-XLI":    684,
    "OAB-XLII":   685,
    "OAB-XLIII":  686,
    "OAB-XLIV":   687,
    "OAB-XLV":    688,
    "OAB-XLVI":   689,
}

CHECKPOINT_FILE = os.path.join(os.path.dirname(__file__), "checkpoint.json")
OUTPUT_JS       = os.path.join(os.path.dirname(__file__), "..", "js", "questions_oab.js")

# Mapeamento disciplina JurisWay → nome canônico no app
DISCIPLINA_MAP = {
    "Estatuto da OAB":                        "Etica Profissional",
    "Codigo de Etica":                        "Etica Profissional",
    "Etica Profissional":                     "Etica Profissional",
    "Filosofia do Direito":                   "Filosofia do Direito",
    "Direito Constitucional":                 "Direito Constitucional",
    "Direitos Humanos":                       "Direitos Humanos",
    "Direito Eleitoral":                      "Direito Eleitoral",
    "Direito Internacional":                  "Direito Internacional",
    "Direito Financeiro":                     "Direito Financeiro",
    "Direito Tributario":                     "Direito Tributario",
    "Direito Administrativo":                 "Direito Administrativo",
    "Direito Ambiental":                      "Direito Ambiental",
    "Direito Civil":                          "Direito Civil",
    "Estatuto da Crianca":                    "Direito da Crianca e do Adolescente",
    "Direito da Crianca":                     "Direito da Crianca e do Adolescente",
    "Direito Penal":                          "Direito Penal",
    "Direito Processual Penal":               "Direito Processual Penal",
    "Direito Processual Civil":               "Direito Processual Civil",
    "Direito Empresarial":                    "Direito Empresarial",
    "Direito Comercial":                      "Direito Empresarial",
    "Direito do Trabalho":                    "Direito do Trabalho",
    "Direito Processual do Trabalho":         "Direito Processual do Trabalho",
    "Direito Previdenciario":                 "Direito Previdenciario",
    "Direito do Consumidor":                  "Direito do Consumidor",
}

# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------

def get_session():
    s = requests.Session()
    s.headers.update({
        "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Accept":          "text/html,application/xhtml+xml",
    })
    return s


def fetch(session, url, retries=3):
    for attempt in range(retries):
        try:
            r = session.get(url, timeout=25)
            if r.status_code == 200:
                # Decodifica como UTF-8, substituindo bytes inválidos
                return r.content.decode("utf-8", errors="replace")
            print(f"    HTTP {r.status_code}")
        except Exception as exc:
            print(f"    Tentativa {attempt+1}/{retries} falhou: {exc}")
        time.sleep(2 ** attempt + random.random())
    return None

# ---------------------------------------------------------------------------
# Parsing — página de questão
# ---------------------------------------------------------------------------

def mapear_disciplina(texto):
    # Normaliza acentos para comparação
    import unicodedata
    def norm(s):
        return unicodedata.normalize("NFD", s).encode("ascii","ignore").decode().lower()
    tn = norm(texto or "")
    for chave, valor in DISCIPLINA_MAP.items():
        if norm(chave) in tn:
            return valor
    return texto.strip() or "Desconhecida"


def parse_questao(html, id_prova, idx):
    """Extrai disciplina, id_questao, enunciado e alternativas da página."""
    soup = BeautifulSoup(html, "html.parser")

    # --- id_questao ---
    id_questao = None
    for a in soup.find_all("a", href=True):
        m = re.search(r"id_questao=(\d+)", a["href"])
        if m:
            id_questao = m.group(1)
            break

    # --- Disciplina (aparece no cabeçalho da questão) ---
    disciplina_raw = ""
    # JurisWay mostra "Questão N - [Disciplina]" em elemento de texto
    full = soup.get_text(" ", strip=True)
    m_disc = re.search(r"Quest\w+\s+\d+\s*[-–]\s*(.+?)(?:Marca|$)", full[:3000])
    if m_disc:
        disciplina_raw = m_disc.group(1).strip()
    if not disciplina_raw:
        for tag in soup.find_all(["h1","h2","h3","h4","b","strong","td","span","font","p"]):
            t = tag.get_text(strip=True)
            if any(k.lower() in t.lower() for k in ["Direito", "Etica", "Estatuto", "Filosofia"]):
                if len(t) < 80:
                    disciplina_raw = t
                    break
    disciplina = mapear_disciplina(disciplina_raw)

    # --- Enunciado e alternativas ---
    enunciado = ""
    alternativas = {"A": "", "B": "", "C": "", "D": ""}

    # Pega todos os textos de elementos folha
    blocos = []
    for tag in soup.find_all(["p", "div", "li", "td", "font"]):
        if tag.find(["p","div","table","ul","ol"]):
            continue
        t = tag.get_text(" ", strip=True)
        if len(t) > 10:
            blocos.append((tag, t))

    # Filtra ruído de navegação
    ruido = re.compile(r"jurisway|facebook|twitter|login|cadastre|mapa do site|"
                       r"cursos|provas|concursos|enem|javascript|cookie", re.I)

    for tag, t in blocos:
        # Alternativas: linha começando com "A texto", "B texto" etc.
        m = re.match(r"^([ABCD])\s+(.{5,})", t, re.DOTALL)
        if m and not ruido.search(t):
            letra, texto = m.group(1), m.group(2).strip()
            if letra in alternativas and not alternativas[letra]:
                alternativas[letra] = texto[:600]

    # Enunciado: maior bloco de texto antes das alternativas
    for tag, t in blocos:
        if ruido.search(t) or len(t) < 40:
            continue
        # Não é alternativa
        if re.match(r"^[ABCD]\s+", t):
            continue
        # Não é instrução do site
        if re.search(r"marca[cç]", t.lower()) and len(t) < 200:
            continue
        if len(t) > len(enunciado):
            enunciado = t

    # Fallback alternativas: padrão "A) texto" no texto completo
    if not all(alternativas.values()):
        for m in re.finditer(r"([ABCD])\)\s*(.+?)(?=\s+[ABCD]\)|\Z)", full, re.DOTALL):
            letra, texto = m.group(1), m.group(2).strip()
            if letra in alternativas and not alternativas[letra] and 5 < len(texto) < 600:
                alternativas[letra] = texto

    def clean(s):
        return s.replace("�", "").strip() if s else s

    return {
        "id_questao":   id_questao,
        "disciplina":   clean(disciplina),
        "enunciado":    clean(enunciado),
        "alternativas": {k: clean(v) for k, v in alternativas.items()},
    }

# ---------------------------------------------------------------------------
# Parsing — página de gabarito
# ---------------------------------------------------------------------------

def parse_gabarito(html):
    """
    Extrai a alternativa correta e a dificuldade da página de gabarito.
    No JurisWay OAB, a div com class 'correta' contém 'c)texto'
    onde a letra minúscula indica a resposta.
    """
    if not html:
        return None, "media"

    soup = BeautifulSoup(html, "html.parser")
    full_text = soup.get_text(" ", strip=True)

    # --- Dificuldade ---
    dificuldade = "media"
    m_pct = re.search(r"(\d+)%\s*acertaram", full_text, re.IGNORECASE)
    if m_pct:
        pct = int(m_pct.group(1))
        dificuldade = "facil" if pct >= 60 else ("dificil" if pct <= 40 else "media")
    if "cil" in full_text and "acima" in full_text:
        dificuldade = "facil"
    if "ficil" in full_text and "abaixo" in full_text:
        dificuldade = "dificil"

    # --- Alternativa correta ---
    correta = None

    # Estratégia principal: <div class="... correta ..."> começa com "c)texto"
    for div in soup.find_all("div", class_=True):
        if "correta" in " ".join(div.get("class", [])):
            t = div.get_text(strip=True)
            m = re.match(r"([a-dA-D])\)", t)
            if m:
                correta = m.group(1).upper()
                break

    # Estratégia 2: qualquer elemento com classe "correta" ou "certa"
    if not correta:
        for el in soup.find_all(class_=True):
            classes = " ".join(el.get("class", []))
            if re.search(r"\bcorreta?\b|\bcerta?\b", classes, re.I):
                t = el.get_text(strip=True)
                m = re.match(r"([a-dA-D])\)", t)
                if m:
                    correta = m.group(1).upper()
                    break

    # Estratégia 3: padrão textual
    if not correta:
        for padrao in [
            r"[Gg]abarito\s*[:\-]\s*([A-Da-d])",
            r"[Aa]lternativa\s+([A-Da-d])\s+[eé]",
            r"resposta\s+correta.*?([A-Da-d])\)",
        ]:
            m = re.search(padrao, full_text, re.IGNORECASE)
            if m:
                correta = m.group(1).upper()
                break

    return correta, dificuldade

# ---------------------------------------------------------------------------
# Geração do JS
# ---------------------------------------------------------------------------

def gerar_js(questoes, caminho):
    linhas = [
        "/**\n",
        " * Banco de questoes extraido dos Exames OAB 1a fase (JurisWay)\n",
        f" * Total: {len(questoes)} questoes\n",
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
            f"    fundamento: \"\",\n"
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

    print(f"\n[OK] {caminho} gerado com {len(questoes)} questoes")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("  Scraper OAB - JurisWay  (IDs verificados, encoding iso-8859-1)")
    print("=" * 60)

    # Carrega checkpoint existente
    todas = {}
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            todas = json.load(f)
        # Remove entradas antigas com IDs incorretos (formato "644-N" para não-OAB)
        oab_ids = set(str(v) for v in EXAMES.values())
        antes = len(todas)
        todas = {k: v for k, v in todas.items() if k.split("-")[0] in oab_ids}
        if len(todas) < antes:
            print(f"Checkpoint: removidas {antes - len(todas)} entradas de exames nao-OAB")
        print(f"Checkpoint: {len(todas)} entradas validas carregadas\n")

    session = get_session()

    for nome, id_prova in EXAMES.items():
        pendentes = [i for i in range(80) if f"{id_prova}-{i}" not in todas]
        if not pendentes:
            print(f"{nome} (id={id_prova}) — completo, pulando")
            continue

        print(f"\n{'-'*55}")
        print(f"  {nome}  (id_prova={id_prova})  -- {len(pendentes)} questoes pendentes")
        print(f"{'-'*55}")

        for idx in pendentes:
            url_q = f"{BASE_URL}Provas_Resolver.asp?id_prova={id_prova}&id_questao_atual={idx}"
            html_q = fetch(session, url_q)

            if not html_q:
                print(f"  [{idx+1:2d}/80] FALHA ao buscar questao — pulando")
                continue

            q = parse_questao(html_q, id_prova, idx)

            correta, dificuldade = None, "media"
            if q["id_questao"]:
                url_g = f"{BASE_URL}Provas_Responder.asp?id_prova={id_prova}&id_questao={q['id_questao']}"
                html_g = fetch(session, url_g)
                correta, dificuldade = parse_gabarito(html_g)
                time.sleep(random.uniform(0.4, 0.9))

            questao = {
                "id":           f"oab{id_prova}-q{idx+1:03d}",
                "exame":        nome,
                "disciplina":   q["disciplina"],
                "topico":       q["disciplina"],
                "dificuldade":  dificuldade,
                "enunciado":    q["enunciado"],
                "alternativas": q["alternativas"],
                "correta":      correta,
                "fundamento":   "",
                "comentario":   {"A": "", "B": "", "C": "", "D": ""},
                "pegadinha":    None,
            }

            todas[f"{id_prova}-{idx}"] = questao

            status = f"correta={correta}" if correta else "[sem gabarito]"
            print(f"  [{idx+1:2d}/80] {q['disciplina'][:28]:<28} {status} | {dificuldade}")

            with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
                json.dump(todas, f, ensure_ascii=False)

            time.sleep(random.uniform(0.8, 1.6))

    # Filtra questões válidas
    validas = [
        v for v in todas.values()
        if v.get("enunciado")
        and v.get("correta")
        and len(v["enunciado"]) > 30
        and all(v["alternativas"].get(L) for L in "ABCD")
    ]
    invalidas = len(todas) - len(validas)

    print(f"\n{'='*60}")
    print(f"  Coleta concluida!")
    print(f"  Total coletado : {len(todas)}")
    print(f"  Validas        : {len(validas)}")
    print(f"  Descartadas    : {invalidas}  (sem enunciado/gabarito/alternativas)")
    print(f"{'='*60}")

    gerar_js(validas, OUTPUT_JS)


if __name__ == "__main__":
    main()
