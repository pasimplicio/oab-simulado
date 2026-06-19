#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import requests, re
from bs4 import BeautifulSoup

s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0", "Accept-Language": "pt-BR,pt;q=0.9"})

url = "https://www.jurisway.org.br/v2/Provas_Resolver.asp?id_prova=642&id_questao_atual=0"
r = s.get(url, timeout=25)
html = r.content.decode("iso-8859-1")
soup = BeautifulSoup(html, "html.parser")
full = soup.get_text(" ", strip=True)

# Encontra "Janaína" no texto completo e imprime contexto
idx = full.find("Jan")
print("=== CONTEXTO DA QUESTÃO (600 chars ao redor) ===")
start = max(0, idx - 50)
print(full[start:start+800])

print()
print("=== TODOS OS INPUTS DA PÁGINA ===")
for inp in soup.find_all("input"):
    print(f"  {inp}")

print()
print("=== TABLES / TDs COM LETRA DENTRO ===")
for td in soup.find_all("td"):
    t = td.get_text(" ", strip=True)
    if re.match(r"^[A-Da-d]$", t.strip()) or re.match(r"^[A-Da-d][.)]\s*", t):
        parent = td.parent
        row_text = parent.get_text(" ", strip=True)[:200]
        print(f"  <td> '{t[:80]}' | row: {row_text[:200]}")

print()
print("=== LABELS / SPANs COM TEXTO RELEVANTE ===")
for tag in soup.find_all(["label", "span", "div"]):
    t = tag.get_text(" ", strip=True)
    if 20 < len(t) < 500 and not tag.find(["div", "table"]):
        cls = " ".join(tag.get("class", []))
        if any(c in cls.lower() for c in ["altern", "opcao", "item", "resp", "quest"]):
            print(f"  <{tag.name} class='{cls}'> {t[:200]}")

print()
print("=== RADIO BUTTONS E SEUS LABELS ===")
for inp in soup.find_all("input", {"type": "radio"}):
    val = inp.get("value", "")
    name = inp.get("name", "")
    label_for = soup.find("label", {"for": inp.get("id", "")})
    label_text = label_for.get_text(" ", strip=True)[:200] if label_for else "(sem label)"
    print(f"  name={name} value={val} | {label_text}")
