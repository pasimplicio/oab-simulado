#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import requests, re
from bs4 import BeautifulSoup

s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0", "Accept-Language": "pt-BR,pt;q=0.9"})

url = "https://www.jurisway.org.br/v2/Provas_Resolver.asp?id_prova=642&id_questao_atual=0"
r = s.get(url, timeout=25)

print(f"Content-Type: {r.headers.get('Content-Type','?')}")
print(f"Apparent encoding: {r.apparent_encoding}")
print()

# Testa os 3 encodings mais prováveis
for enc in ["utf-8", "iso-8859-1", "windows-1252"]:
    try:
        text = r.content.decode(enc)
        soup = BeautifulSoup(text, "html.parser")
        full = soup.get_text(" ", strip=True)
        idx = full.find("Jan")
        snippet = full[idx:idx+80] if idx >= 0 else full[:100]
        print(f"[{enc}] {snippet}")
    except Exception as e:
        print(f"[{enc}] ERRO: {e}")

print()
print("=== Blocos começando com [a-dA-D]) ===")
html = r.content.decode("iso-8859-1")
soup = BeautifulSoup(html, "html.parser")
for tag in soup.find_all(["p","div","li","td","font","label","span","tr"]):
    if tag.find(["p","div","table","ul","ol"]):
        continue
    t = tag.get_text(" ", strip=True)
    if re.match(r"^[a-dA-D]\)", t) and len(t) > 5:
        cls = " ".join(tag.get("class", []))
        print(f"  <{tag.name} class='{cls}'> {t[:160]}")

print()
print("=== Regex no full text (a-d minúsculo) ===")
full = soup.get_text(" ", strip=True)
for m in re.finditer(r"([a-d])\)\s*(.{5,120}?)(?=\s+[a-d]\)|\Z)", full):
    print(f"  {m.group(1)}) {m.group(2)[:120]}")
