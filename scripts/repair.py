#!/usr/bin/env python3
"""
Repara o checkpoint: re-busca páginas de questão com parser corrigido.
- Encoding correto: ISO-8859-1
- Alternativas: extrai de <tr><td>A</td><td>texto</td></tr>
- Mantém correta/dificuldade já extraídas
"""
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import json, os, re, time, random
import requests
from bs4 import BeautifulSoup

CHECKPOINT_FILE = os.path.join(os.path.dirname(__file__), "checkpoint.json")
OUTPUT_JS       = os.path.join(os.path.dirname(__file__), "..", "js", "questions_oab.js")
BASE_URL        = "https://www.jurisway.org.br/v2/"

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


def get_session():
    s = requests.Session()
    s.headers.update({
        "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9",
    })
    return s


def fetch(session, url, retries=3):
    for attempt in range(retries):
        try:
            r = session.get(url, timeout=25)
            if r.status_code == 200:
                return r.content.decode("iso-8859-1", errors="replace")
            print(f"    HTTP {r.status_code}")
        except Exception as exc:
            print(f"    Tentativa {attempt+1}/{retries}: {exc}")
        time.sleep(2 ** attempt + random.random())
    return None


def mapear_disciplina(texto):
    import unicodedata
    def norm(s):
        return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    tn = norm(texto or "")
    for chave, valor in DISCIPLINA_MAP.items():
        if norm(chave) in tn:
            return valor
    return texto.strip() or "Desconhecida"


def parse_questao(html):
    """Parser corrigido: ISO-8859-1 + alternativas em <tr><td>A</td><td>texto</td></tr>."""
    soup = BeautifulSoup(html, "html.parser")
    full = soup.get_text(" ", strip=True)

    # --- id_questao ---
    id_questao = None
    for a in soup.find_all("a", href=True):
        m = re.search(r"id_questao=(\d+)", a["href"])
        if m:
            id_questao = m.group(1)
            break

    # --- Disciplina ---
    disciplina_raw = ""
    m_disc = re.search(r"Quest\w+\s+\d+\s*[-–]\s*(.+?)(?:\s{2,}|Marca|$)", full[:3000])
    if m_disc:
        candidate = m_disc.group(1).strip()
        # Rejeita se muito longo ou parece enunciado
        if len(candidate) < 80 and not re.search(r"[,;]", candidate[:30]):
            disciplina_raw = candidate
    if not disciplina_raw:
        for tag in soup.find_all(["h3", "h4", "b", "strong", "span", "font"]):
            t = tag.get_text(strip=True)
            if any(k.lower() in t.lower() for k in
                   ["Direito", "Etica", "Estatuto", "Filosofia", "Humanos"]):
                if len(t) < 80:
                    disciplina_raw = t
                    break
    disciplina = mapear_disciplina(disciplina_raw)

    # --- Alternativas: estrutura real do JurisWay ---
    # <tr><td>A</td><td>texto da alternativa A</td></tr>
    alternativas = {"A": "", "B": "", "C": "", "D": ""}

    for tr in soup.find_all("tr"):
        tds = tr.find_all("td", recursive=False)
        if not tds:
            continue
        first = tds[0].get_text(strip=True).strip()
        if first in ("A", "B", "C", "D") and len(tds) >= 2:
            texto = tds[1].get_text(" ", strip=True).strip()
            if texto and len(texto) > 5 and not alternativas[first]:
                alternativas[first] = texto[:700]

    # Fallback: row de <tr> com texto "A Os cartões..."
    if not all(alternativas.values()):
        for tr in soup.find_all("tr"):
            t = tr.get_text(" ", strip=True)
            m = re.match(r"^([ABCD])\s+(.{10,})", t)
            if m:
                letra, texto = m.group(1), m.group(2).strip()
                if not alternativas[letra] and len(texto) < 800:
                    alternativas[letra] = texto[:700]

    # --- Enunciado ---
    ruido = re.compile(
        r"jurisway|facebook|twitter|login|cadastre|mapa do site|"
        r"cursos|provas|concursos|enem|javascript|cookie|basta clicar|"
        r"marcação|Conferir", re.I
    )
    enunciado = ""
    for tag in soup.find_all(["p", "div", "td", "font"]):
        if tag.find(["p", "div", "table", "ul", "ol"]):
            continue
        t = tag.get_text(" ", strip=True)
        if ruido.search(t) or len(t) < 40:
            continue
        if re.match(r"^[ABCD]\s+", t):
            continue
        if re.search(r"marca[cç]", t.lower()) and len(t) < 200:
            continue
        if len(t) > len(enunciado):
            enunciado = t

    def clean(s):
        return re.sub(r"\s+", " ", s).strip() if s else ""

    return {
        "id_questao":   id_questao,
        "disciplina":   clean(disciplina),
        "enunciado":    clean(enunciado),
        "alternativas": {k: clean(v) for k, v in alternativas.items()},
    }


def gerar_js(questoes, caminho):
    linhas = [
        "/**\n",
        " * Banco de questoes extraido dos Exames OAB 1a fase (JurisWay)\n",
        f" * Total: {len(questoes)} questoes\n",
        " * Gerado automaticamente por scripts/repair.py\n",
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


def main():
    print("=" * 60)
    print("  Reparo: re-parse com encoding ISO-8859-1 + <tr><td> fix")
    print("=" * 60)

    with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
        todas = json.load(f)
    print(f"Checkpoint: {len(todas)} entradas")

    session = get_session()
    total = len(todas)
    atualizadas = 0
    falhas = 0

    for i, (key, q) in enumerate(todas.items()):
        partes = key.split("-")
        id_prova, idx = partes[0], partes[1]
        url = f"{BASE_URL}Provas_Resolver.asp?id_prova={id_prova}&id_questao_atual={idx}"

        html = fetch(session, url)
        if not html:
            falhas += 1
            print(f"  [{i+1:4d}/{total}] FALHA: {key}")
            continue

        parsed = parse_questao(html)

        # Atualiza enunciado, alternativas, disciplina (mantém correta/dificuldade)
        todas[key]["enunciado"]    = parsed["enunciado"]
        todas[key]["alternativas"] = parsed["alternativas"]
        todas[key]["disciplina"]   = parsed["disciplina"]
        todas[key]["topico"]       = parsed["disciplina"]
        if parsed["id_questao"]:
            todas[key]["id_questao"] = parsed["id_questao"]

        atualizadas += 1
        alt_ok = sum(1 for v in parsed["alternativas"].values() if v)
        print(f"  [{i+1:4d}/{total}] {key:8} {parsed['disciplina'][:24]:<24} alt={alt_ok}/4")

        # Salva a cada 100 questões
        if atualizadas % 100 == 0:
            with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
                json.dump(todas, f, ensure_ascii=False)
            print(f"    >>> Checkpoint salvo ({atualizadas} atualizadas)")

        time.sleep(random.uniform(0.5, 1.0))

    # Salva final
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(todas, f, ensure_ascii=False)

    # Filtra válidas
    validas = [
        v for v in todas.values()
        if v.get("enunciado")
        and v.get("correta")
        and len(v["enunciado"]) > 30
        and all(v["alternativas"].get(L) for L in "ABCD")
    ]
    invalidas = len(todas) - len(validas)

    print(f"\n{'=' * 60}")
    print(f"  Reparo concluido!")
    print(f"  Atualizadas  : {atualizadas}")
    print(f"  Falhas       : {falhas}")
    print(f"  Validas      : {len(validas)}")
    print(f"  Descartadas  : {invalidas}")
    print(f"{'=' * 60}")

    gerar_js(validas, OUTPUT_JS)


if __name__ == "__main__":
    main()
