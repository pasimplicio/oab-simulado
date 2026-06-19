import requests
from bs4 import BeautifulSoup
import re

s = requests.Session()
s.headers.update({'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'pt-BR,pt;q=0.9'})

r = s.get('https://www.jurisway.org.br/v2/Provas_Responder.asp?id_prova=689&id_questao=53182', timeout=30)
r.encoding = 'iso-8859-1'
soup = BeautifulSoup(r.text, 'html.parser')

print('=== ELEMENTOS COM CLASSE selecionada/correta/verde ===')
for el in soup.find_all(class_=True):
    classes = ' '.join(el.get('class', []))
    if any(c in classes.lower() for c in ['selecio', 'corret', 'verde', 'gabar', 'answer', 'right']):
        print(f'  <{el.name} class={classes}> -> {el.get_text(strip=True)[:100]}')

print()
print('=== LIs / TDs / DIVs / Ps COMEANDO COM LETRA A B C D ===')
for el in soup.find_all(['li', 'td', 'div', 'p']):
    t = el.get_text(strip=True)
    if re.match(r'^[ABCD][).]\s+.{5}', t):
        classes = ' '.join(el.get('class', []))
        style = el.get('style', '')
        print(f'  <{el.name} class="{classes}" style="{style[:60]}"> {t[:100]}')

print()
print('=== INPUT radio / checkbox ===')
for el in soup.find_all(['input']):
    print(f'  {el}')

print()
print('=== TEXTO BRUTO (pos login) ===')
txt = soup.get_text(' ', strip=True)
pos = txt.find('Quest')
print(txt[pos:pos+2000])
