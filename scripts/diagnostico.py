#!/usr/bin/env python3
"""
Diagnóstico: busca uma questão e o gabarito do JurisWay
e exibe o HTML bruto para entender a estrutura.
"""
import requests
from bs4 import BeautifulSoup
import re

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9",
})

BASE_URL = "https://www.jurisway.org.br/v2/"

# OAB 1 = id_prova 644
id_prova = 644
idx = 0  # primeira questão

url_q = f"{BASE_URL}Provas_Resolver.asp?id_prova={id_prova}&id_questao_atual={idx}"
print(f"Buscando: {url_q}\n")

r = session.get(url_q, timeout=30)
# Força encoding Latin-1 (padrão brasileiro)
r.encoding = "iso-8859-1"
html = r.text

soup = BeautifulSoup(html, "html.parser")
full = soup.get_text(" ", strip=True)

print("=" * 60)
print("TEXTO COMPLETO (primeiros 2000 chars):")
print("=" * 60)
print(full[:2000])
print()

# Encontra o link do gabarito
print("=" * 60)
print("LINKS COM 'id_questao':")
print("=" * 60)
for a in soup.find_all("a", href=True):
    if "id_questao" in a["href"]:
        print("  HREF:", a["href"])
        print("  TEXT:", a.get_text(strip=True))

# Busca id_questao
id_questao = None
for a in soup.find_all("a", href=True):
    m = re.search(r"id_questao=(\d+)", a["href"])
    if m:
        id_questao = m.group(1)
        break

print(f"\nid_questao encontrado: {id_questao}")

if id_questao:
    url_g = f"{BASE_URL}Provas_Responder.asp?id_prova={id_prova}&id_questao={id_questao}"
    print(f"\nBuscando gabarito: {url_g}\n")
    rg = session.get(url_g, timeout=30)
    rg.encoding = "iso-8859-1"
    soup_g = BeautifulSoup(rg.text, "html.parser")
    full_g = soup_g.get_text(" ", strip=True)

    print("=" * 60)
    print("GABARITO — TEXTO COMPLETO (primeiros 3000 chars):")
    print("=" * 60)
    print(full_g[:3000])
    print()

    # Testa padrões de extração do gabarito
    print("=" * 60)
    print("PADRÕES TESTADOS:")
    print("=" * 60)
    padroes = [
        r"[Gg]abarito\s*[:\-]\s*([ABCD])",
        r"[Rr]esposta\s*[:\-]\s*([ABCD])",
        r"alternativa\s+([ABCD])\s",
        r"correta\s+[eé]\s+a?\s*([ABCD])",
        r"\b([ABCD])\b\s*(está correta|é a correta|é correta)",
        r"Alternativa Correta[:\s]+([ABCD])",
    ]
    for p in padroes:
        m = re.search(p, full_g, re.IGNORECASE)
        print(f"  {p[:50]:<50} → {m.group(1) if m else 'NÃO ENCONTRADO'}")

    # Mostra todos os elementos com A B C D
    print()
    print("ELEMENTOS COM LETRAS A/B/C/D:")
    for tag in soup_g.find_all(["b", "strong", "span", "td", "div"]):
        t = tag.get_text(strip=True)
        if t in ("A", "B", "C", "D"):
            parent = tag.find_parent()
            pt = parent.get_text(strip=True)[:120] if parent else ""
            print(f"  <{tag.name}>{t}</{tag.name}> — pai: {pt}")

    # Checkmarks
    print()
    print("CHECKMARKS (✓ ✔ ☑):")
    for el in soup_g.find_all(string=re.compile(r"[✓✔☑]")):
        print(f"  '{el.strip()[:80]}' — pai: {el.find_parent().get_text(strip=True)[:80] if el.find_parent() else ''}")
