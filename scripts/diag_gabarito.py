#!/usr/bin/env python3
"""Verifica se o id_questao extraído corresponde à questão correta."""
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import requests, re
from bs4 import BeautifulSoup

s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0", "Accept-Language": "pt-BR,pt;q=0.9"})

# Testa as primeiras 4 questões do OAB-XXI
for idx in range(4):
    url_q = f"https://www.jurisway.org.br/v2/Provas_Resolver.asp?id_prova=642&id_questao_atual={idx}"
    r = s.get(url_q, timeout=25)
    html = r.content.decode("iso-8859-1")
    soup = BeautifulSoup(html, "html.parser")

    # Todos os links com id_questao= (não id_questao_atual)
    links_id = []
    for a in soup.find_all("a", href=True):
        if "id_questao=" in a["href"] and "id_questao_atual" not in a["href"]:
            m = re.search(r"id_questao=(\d+)", a["href"])
            if m:
                links_id.append((m.group(1), a.get_text(strip=True)[:60], a["href"][:100]))

    # Também pega de inputs hidden
    for inp in soup.find_all("input", {"name": re.compile(r"id_questao")}):
        print(f"  INPUT name={inp.get('name')} value={inp.get('value')}")

    # Pega enunciado (primeiros 100 chars)
    full = soup.get_text(" ", strip=True)
    # Encontra trecho após "Ok" e antes das alternativas
    m_env = re.search(r"Ok\s+(.{30,300})", full)
    enunciado_preview = m_env.group(1)[:100] if m_env else full[200:300]

    print(f"\n=== Questão índice {idx} ===")
    print(f"  Enunciado: {enunciado_preview}...")
    print(f"  Links com id_questao= encontrados ({len(links_id)}):")
    for id_q, texto, href in links_id:
        print(f"    id={id_q}  texto='{texto}'  href={href}")

    if links_id:
        id_usado = links_id[0][0]
        url_g = f"https://www.jurisway.org.br/v2/Provas_Responder.asp?id_prova=642&id_questao={id_usado}"
        r2 = s.get(url_g, timeout=25)
        html_g = r2.content.decode("iso-8859-1")
        soup_g = BeautifulSoup(html_g, "html.parser")
        # Extrai correta
        correta = None
        for div in soup_g.find_all("div", class_=True):
            if "correta" in " ".join(div.get("class", [])):
                t = div.get_text(strip=True)
                m = re.match(r"([a-dA-D])\)", t)
                if m:
                    correta = m.group(1).upper()
                    break
        # Pega texto da alternativa correta no gabarito para cruzar
        texto_correta = ""
        for tr in soup_g.find_all("tr"):
            tds = tr.find_all("td", recursive=False)
            if len(tds) >= 2 and tds[0].get_text(strip=True) == correta:
                texto_correta = tds[1].get_text(" ", strip=True)[:80]
                break
        print(f"  Gabarito (id={id_usado}): correta={correta} — '{texto_correta}'")
