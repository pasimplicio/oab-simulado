#!/usr/bin/env python3
"""Testa o parser corrigido em 3 questões."""
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import requests, re, json
from bs4 import BeautifulSoup

DISCIPLINA_MAP = {
    "Estatuto da OAB": "Etica Profissional",
    "Codigo de Etica": "Etica Profissional",
    "Etica Profissional": "Etica Profissional",
    "Filosofia do Direito": "Filosofia do Direito",
    "Direito Constitucional": "Direito Constitucional",
    "Direitos Humanos": "Direitos Humanos",
    "Direito Tributario": "Direito Tributario",
    "Direito Administrativo": "Direito Administrativo",
    "Direito Civil": "Direito Civil",
    "Direito Penal": "Direito Penal",
    "Direito Processual Penal": "Direito Processual Penal",
    "Direito Processual Civil": "Direito Processual Civil",
    "Direito Empresarial": "Direito Empresarial",
    "Direito do Trabalho": "Direito do Trabalho",
    "Direito Processual do Trabalho": "Direito Processual do Trabalho",
    "Direito Previdenciario": "Direito Previdenciario",
}

def mapear_disciplina(texto):
    import unicodedata
    def norm(s):
        return unicodedata.normalize("NFD", s).encode("ascii","ignore").decode().lower()
    tn = norm(texto or "")
    for chave, valor in DISCIPLINA_MAP.items():
        if norm(chave) in tn:
            return valor
    return texto.strip() or "Desconhecida"

def parse_questao(html):
    soup = BeautifulSoup(html, "html.parser")
    full = soup.get_text(" ", strip=True)

    id_questao = None
    for a in soup.find_all("a", href=True):
        m = re.search(r"id_questao=(\d+)", a["href"])
        if m:
            id_questao = m.group(1)
            break

    disciplina_raw = ""
    m_disc = re.search(r"Quest\w+\s+\d+\s*[-–]\s*(.+?)(?:\s{2,}|Marca|$)", full[:3000])
    if m_disc:
        candidate = m_disc.group(1).strip()
        if len(candidate) < 80 and not re.search(r"[,;]", candidate[:30]):
            disciplina_raw = candidate
    disciplina = mapear_disciplina(disciplina_raw)

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

    if not all(alternativas.values()):
        for tr in soup.find_all("tr"):
            t = tr.get_text(" ", strip=True)
            m = re.match(r"^([ABCD])\s+(.{10,})", t)
            if m:
                letra, texto = m.group(1), m.group(2).strip()
                if not alternativas[letra] and len(texto) < 800:
                    alternativas[letra] = texto[:700]

    ruido = re.compile(r"jurisway|facebook|login|mapa do site|cursos|provas|concursos|enem|javascript|cookie|basta clicar|marcação|Conferir", re.I)
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

    return {"id_questao": id_questao, "disciplina": disciplina,
            "enunciado": clean(enunciado),
            "alternativas": {k: clean(v) for k, v in alternativas.items()}}

s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0", "Accept-Language": "pt-BR,pt;q=0.9"})

# Testa questões 0, 1, 2 do OAB-XXI
for idx in [0, 1, 2]:
    url = f"https://www.jurisway.org.br/v2/Provas_Resolver.asp?id_prova=642&id_questao_atual={idx}"
    r = s.get(url, timeout=25)
    html = r.content.decode("iso-8859-1", errors="replace")
    q = parse_questao(html)
    print(f"\n=== Questão {idx+1} ===")
    print(f"  Disciplina : {q['disciplina']}")
    print(f"  Enunciado  : {q['enunciado'][:120]}...")
    alt_ok = sum(1 for v in q['alternativas'].values() if v)
    print(f"  Alternativas ({alt_ok}/4):")
    for letra, texto in q['alternativas'].items():
        print(f"    {letra}) {texto[:80]}")
