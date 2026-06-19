#!/usr/bin/env python3
"""
Localiza os IDs corretos das provas OAB 1a fase no JurisWay.
"""
import requests
from bs4 import BeautifulSoup
import re

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9",
})

def fetch(url):
    r = session.get(url, timeout=30)
    r.encoding = "iso-8859-1"
    return r.text

# Página de listagem das provas OAB
url_lista = "https://www.jurisway.org.br/v2/gh.asp?it=49"
print(f"Buscando lista OAB: {url_lista}\n")
html = fetch(url_lista)
soup = BeautifulSoup(html, "html.parser")

oab_provas = []
for a in soup.find_all("a", href=True):
    href = a["href"]
    texto = a.get_text(strip=True)
    m = re.search(r"id_prova=(\d+)", href)
    if m and ("OAB" in texto or "Exame" in texto or "Ordem" in texto):
        oab_provas.append((m.group(1), texto[:80]))

print(f"Provas OAB encontradas: {len(oab_provas)}")
for id_p, nome in oab_provas[:50]:
    print(f"  id={id_p}  {nome}")

if not oab_provas:
    print("\nNenhuma encontrada nessa URL. Tentando busca direta...\n")
    # Tenta buscar via campo de busca
    for id_p in range(640, 700):
        url_t = f"https://www.jurisway.org.br/v2/Provas_Resolver.asp?id_prova={id_p}&id_questao_atual=0"
        r = session.get(url_t, timeout=15)
        r.encoding = "iso-8859-1"
        titulo = ""
        soup2 = BeautifulSoup(r.text, "html.parser")
        # Tenta pegar o título da prova no <title> ou em cabeçalhos
        t = soup2.find("title")
        if t:
            titulo = t.get_text(strip=True)
        if not titulo:
            for h in soup2.find_all(["h1","h2","h3"]):
                titulo = h.get_text(strip=True)
                if titulo:
                    break
        is_oab = "OAB" in titulo or "Ordem" in titulo or "Exame" in titulo
        print(f"  id={id_p}  {'[OAB]' if is_oab else '      '}  {titulo[:70]}")
        if is_oab:
            oab_provas.append((str(id_p), titulo))
