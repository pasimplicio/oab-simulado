# Documento de Requisitos do Sistema - Simulado OAB FGV

**Versão:** 2.0 (Comercial)
**Data:** 17 de junho de 2026
**Autor:** [Seu Nome / Sua Empresa]
**Status:** Em desenvolvimento / Pronto para comercialização

---

## 1. Introdução

### 1.1 Propósito
Este documento descreve todos os requisitos funcionais e não funcionais para o **Sistema Simulado OAB - FGV**, uma aplicação web para geração de simulados realistas da 1ª fase do Exame de Ordem Unificado, com foco na banca FGV. O sistema foi projetado para ser comercializado como um produto SaaS (Software as a Service) ou como uma solução white-label para instituições de ensino.

### 1.2 Escopo
O sistema consiste em:
- **Motor de Geração de Provas:** Cria simulados de 80 questões com distribuição exata da FGV.
- **Módulo de Correção:** Fornece nota, desempenho por disciplina e mapa de revisão.
- **Gabarito Comentado:** Explica fundamento legal, distratores e pegadinhas de cada questão.
- **Painel de Interação:** Interface responsiva com feedback imediato, controle de tempo e personalização.
- **Banco de Questões Autorais:** Base de dados extensível com questões inéditas no estilo FGV.

### 1.3 Público-Alvo
- **Candidatos à OAB:** Estudantes de direito e bacharéis que buscam treino intensivo.
- **Instituições de Ensino:** Faculdades e cursinhos que desejam oferecer simulados personalizados para seus alunos.
- **Profissionais Autônomos:** Advogados e professores que ministram cursos preparatórios.

---

## 2. Requisitos Funcionais (RF)

### 2.1 Módulo de Geração de Simulados

| ID | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RF01** | **Gerar Simulado Completo** | O sistema deve gerar 80 questões seguindo rigorosamente a distribuição por disciplina definida em `js/config.js`. | Essencial |
| **RF02** | **Garantir Piso Mínimo** | Deve assegurar que a soma de questões de Ética, Direitos Humanos e Filosofia seja ≥ 12 (15% do total). | Essencial |
| **RF03** | **Filtro por Disciplinas** | Permitir que o usuário selecione quais disciplinas deseja incluir no simulado. | Importante |
| **RF04** | **Filtro por Número de Questões** | Oferecer opções para gerar simulados com 20, 40 ou 80 questões. | Importante |
| **RF05** | **Filtro por Dificuldade** | Permitir filtrar questões por nível de dificuldade (fácil, média, difícil). | Desejável |
| **RF06** | **Embaralhar Alternativas** | Opção de embaralhar a ordem das alternativas, mantendo a correta vinculada. | Essencial |

### 2.2 Módulo de Interação e Experiência do Usuário

| ID | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RF07** | **Modo Prova** | Exibir as questões uma por vez, sem correção imediata, simulando a prova real. | Essencial |
| **RF08** | **Modo Livre com Feedback Imediato** | No modo livre, ao selecionar uma alternativa, exibir um ícone de ✅ (correto) ou ❌ (errado) e um tooltip com fundamento. | Essencial |
| **RF09** | **Barra de Progresso** | Exibir uma barra de progresso (ex: "Questão 23 de 80") durante a resolução. | Essencial |
| **RF10** | **Minimapa de Questões** | Mostrar 80 bolinhas (ou similar) no rodapé, com cores indicando: não respondida (🔵), respondida (🟡), correta (🟢) e errada (🔴). | Essencial |
| **RF11** | **Cronômetro Regressivo** | Oferecer um cronômetro de 5h (tempo da prova) com início/pausa. Alertar quando faltarem 30 e 5 minutos. | Importante |
| **RF12** | **Navegação entre Questões** | Botões "Anterior" e "Próxima" para navegar entre as questões, especialmente no Modo Prova. | Essencial |
| **RF13** | **Marcar para Revisão** | Permitir que o usuário marque uma questão para revisão posterior, com um ícone de bandeira (🚩). | Desejável |

### 2.3 Módulo de Resultados e Feedback

| ID | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RF14** | **Exibir Nota Final** | Calcular e exibir a nota de 0 a 100, baseada no número de acertos. | Essencial |
| **RF15** | **Desempenho por Disciplina** | Mostrar a porcentagem de acertos para cada disciplina. | Essencial |
| **RF16** | **Mapa de Revisão** | Gerar uma lista visual dos tópicos com maior número de erros, priorizando-os para estudo. | Essencial |
| **RF17** | **Gabarito Comentado** | Exibir todas as questões com: alternativa correta, fundamento legal, análise de cada distrator e pegadinha utilizada. | Essencial |
| **RF18** | **Tempo Gasto** | Mostrar o tempo total gasto e o tempo médio por questão/disciplina. | Importante |
| **RF19** | **Histórico de Simulados** | Armazenar (via localStorage) os resultados anteriores e exibir um gráfico de evolução de desempenho. | Desejável |
| **RF20** | **Comparativo com a Média** | Se houver dados agregados, mostrar a posição do usuário em relação à média geral. | Desejável |

### 2.4 Módulo de Banco de Questões

| ID | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RF21** | **Estrutura Padronizada** | Cada questão deve ter os campos: `id`, `disciplina`, `topico`, `dificuldade`, `enunciado`, `alternativas`, `correta`, `fundamento`, `comentario`, `pegadinha`. | Essencial |
| **RF22** | **Adicionar Questões** | Interface administrativa (ou arquivo JSON) para adicionar novas questões. | Essencial |
| **RF23** | **Editar Questões** | Interface para editar questões existentes. | Essencial |
| **RF24** | **Desativar Questões** | Opção de desativar questões sem excluí-las do banco. | Importante |
| **RF25** | **Validação de Integridade** | O sistema deve validar se o banco tem questões suficientes e se os metadados estão corretos. | Essencial |

---

## 3. Requisitos Não Funcionais (RNF)

| ID | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Desempenho** | Geração de simulado com 80 questões em menos de 2 segundos. | Essencial |
| **RNF02** | **Responsividade** | Interface adaptável a desktops, tablets e smartphones (mobile-first). | Essencial |
| **RNF03** | **Compatibilidade** | Funcionar nos navegadores Chrome, Firefox, Edge e Safari (últimas 2 versões). | Essencial |
| **RNF04** | **Offline** | Após o primeiro carregamento, o sistema deve funcionar offline (exceto serviços externos). | Essencial |
| **RNF05** | **Acessibilidade** | Seguir diretrizes WCAG 2.1 (nível AA), com contraste adequado e navegação por teclado. | Importante |
| **RNF06** | **Tema Claro/Escuro** | Oferecer alternância entre temas (escuro padrão e claro). | Desejável |
| **RNF07** | **Segurança** | O código não deve ter vulnerabilidades XSS ou CSRF. Em versão SaaS, implementar autenticação. | Essencial |
| **RNF08** | **Manutenibilidade** | Código modular, documentado e com testes unitários (para o motor de geração). | Essencial |
| **RNF09** | **Internacionalização** | O sistema deve estar em português do Brasil (pt-BR). Futuras versões podem suportar outros idiomas. | Desejável |
| **RNF10** | **Performance em Baixa Velocidade** | Otimizar assets (CSS/JS) para carregar mesmo em conexões lentas (3G). | Desejável |

---

## 4. Interface de Usuário (UI/UX) Proposta

### 4.1 Estrutura de Telas

O sistema terá 4 telas principais:

1.  **Tela Inicial (Dashboard)**
    - Logo e nome do sistema.
    - Opções de configuração: Modo Prova, Filtros (disciplinas, número de questões, dificuldade).
    - Botão "Gerar Simulado" (destaque).
    - Botão "Histórico" (se implementado).
    - Alternância Tema Claro/Escuro.

2.  **Tela de Prova**
    - **Topo:** Barra de progresso, cronômetro, contador de questões.
    - **Corpo:** Enunciado e alternativas (com feedback imediato no modo livre).
    - **Rodapé:** Minimapa de questões, botões "Anterior/Próxima", botão "Marcar para Revisão", botão "Finalizar".

3.  **Tela de Resultado**
    - **Resumo:** Nota, número de acertos/erros, tempo gasto.
    - **Gráficos:** Desempenho por disciplina (barras/radar), mapa de revisão.
    - **Gabarito:** Lista completa de questões com comentários (expansível).
    - **Ações:** Botão "Gerar Novo Simulado", "Compartilhar Resultado", "Baixar PDF".

4.  **Tela de Histórico (Opcional)**
    - Lista de simulados anteriores (data, nota, disciplinas).
    - Gráfico de evolução de desempenho.
    - Opção de comparar simulados.

### 4.2 Design System

- **Cores:** Base escura (#0a0a0f), textos em branco (#f0f0f5), destaques em verde (#00e676) e vermelho (#ff5252). Tema claro com fundo branco e textos escuros.
- **Tipografia:** Fonte sans-serif (ex: Inter, Roboto) para legibilidade.
- **Ícones:** Ícones vetoriais (ex: Font Awesome ou Lucide) para minimapa, progresso e ações.

---

## 5. Landing Page para Comercialização

### 5.1 Propósito da Landing Page
A Landing Page é a principal ferramenta de marketing do sistema. Seu objetivo é **converter visitantes em clientes pagantes** (assinantes ou compradores de licenças).

### 5.2 Estrutura da Landing Page

A Landing Page deve seguir a estrutura de copywriting AIDA (Atenção, Interesse, Desejo, Ação):

#### Seção 1: Hero (Atenção)
- **Título de Impacto:** "Treine para a 1ª Fase da OAB com Simulados Indistinguíveis dos da FGV"
- **Subtítulo:** "Questões inéditas, correção detalhada e mapa de revisão. O único sistema que replica fielmente o estilo, as pegadinhas e a distribuição de temas da banca."
- **CTA (Call to Action) Principal:** Botão grande "TESTE GRÁTIS POR 7 DIAS" ou "ASSINE AGORA"
- **Imagem:** GIF do sistema em funcionamento (tela de prova com alternativas e resultado).

#### Seção 2: Problemas e Soluções (Interesse)
- **Problema:** "Estudar para a OAB é desafiador: questões genéricas, sem feedback, sem noção de prioridades."
- **Solução:** "O Simulado OAB resolve isso: questões no formato FGV, correção na hora, e mapa de revisão para focar no que realmente importa."

#### Seção 3: Diferenciais (Desejo)
Apresentar os diferenciais em formato de cards com ícones:

| Ícone | Diferencial | Descrição |
| :--- | :--- | :--- |
| 🎯 | **Fidelidade FGV** | Questões com o mesmo vocabulário, pegadinhas e base legal da banca. |
| 📝 | **Questões Inéditas e Autorais** | 100% das questões são criadas pela nossa equipe, sem violar direitos autorais. |
| 🔍 | **Feedback Imediato** | Saiba na hora se acertou ou errou, com fundamento legal e explicação dos distratores. |
| 🗺️ | **Mapa de Revisão** | Descubra seus pontos fracos e direcione seus estudos com precisão. |
| ⏱️ | **Controle de Tempo** | Cronômetro regressivo de 5h para treinar a gestão do tempo da prova. |
| 📊 | **Histórico de Desempenho** | Acompanhe sua evolução com gráficos e estatísticas detalhadas. |
| 📱 | **Acessível em Qualquer Lugar** | Funciona no navegador do celular, tablet ou computador, offline ou online. |

#### Seção 4: Depoimentos (Prova Social)
- **Card 1:** "Passei na OAB no 47º exame depois de usar o simulado! As questões eram muito parecidas com as da prova." - *Ana C., Aprovada.*
- **Card 2:** "O mapa de revisão me salvou. Foquei nos meus erros e consegui aumentar minha nota em 20%." - *João P., Aprovado.*
- **Card 3:** "A melhor ferramenta de treino para a 1ª fase. Vale cada centavo." - *Dra. Mariana, Advogada.*

#### Seção 5: Planos e Preços (Ação)
Apresentar 2-3 planos de assinatura, com destaque para o plano mais vendido.

| Plano Básico | Plano Pro (Recomendado) | Plano Institucional |
| :--- | :--- | :--- |
| R$ 29,90/mês | R$ 49,90/mês | R$ 499/mês (até 50 alunos) |
| Simulados ilimitados | Todos os benefícios do Básico | Todos os benefícios do Pro |
| Feedback imediato | + Histórico de desempenho | + White-label (sua marca) |
| Modo Prova | + Filtros avançados | + Relatórios agregados |
| **ASSINAR** | **ASSINAR (MAIS POPULAR)** | **CONTRATAR** |

#### Seção 6: FAQ (Perguntas Frequentes)
- *Posso testar antes de comprar?* Sim, oferecemos 7 dias de teste grátis.
- *As questões são atualizadas?* Sim, atualizamos o banco a cada novo edital.
- *Funciona offline?* Sim, após o primeiro carregamento, você pode usar sem internet.
- *Como faço para cancelar?* Você pode cancelar a qualquer momento pelo painel do usuário.

#### Seção 7: Rodapé
- Links: Termos de Uso, Política de Privacidade, Contato.
- Copyright: © [Ano] [Sua Empresa]. Todos os direitos reservados.

### 5.3 Integrações Técnicas da Landing Page
- **Formulário de Cadastro:** Integrar com Mailchimp, ConvertKit ou RD Station para capturar leads.
- **Pagamento:** Integrar com Stripe, PagSeguro ou Mercado Pago para assinaturas.
- **Área do Usuário:** Criar um painel simples onde o usuário assinante faz login e acessa o simulado.
- **Analytics:** Instalar Google Analytics (ou Plausible) para medir conversões.

---

## 6. Plano de Implantação e Comercialização

### 6.1 Fases de Desenvolvimento

| Fase | Atividades | Prazo Estimado |
| :--- | :--- | :--- |
| **Fase 1 (Core)** | Motor de geração, banco de questões, modo prova, correção e resultados. | **Concluído** |
| **Fase 2 (UX/UI)** | Implementar feedback imediato, barra de progresso, minimapa, cronômetro, tema claro/escuro. | 2-3 semanas |
| **Fase 3 (Interação Avançada)** | Filtros por disciplina/dificuldade, histórico de simulados, marcar para revisão. | 3-4 semanas |
| **Fase 4 (Landing Page e SaaS)** | Desenvolver a Landing Page, sistema de autenticação, pagamento e área do usuário. | 4-6 semanas |
| **Fase 5 (Testes e Lançamento)** | Testes de carga, usabilidade e correção de bugs. Lançamento comercial. | 2-3 semanas |

### 6.2 Estratégia de Lançamento
1.  **Pré-lançamento:** Oferecer acesso gratuito para 100 usuários beta em troca de feedback e depoimentos.
2.  **Lançamento Oficial:** Divulgar em redes sociais (LinkedIn, Instagram), grupos de direito no Facebook e parcerias com influenciadores da área.
3.  **Pós-lançamento:** Coletar dados de uso, melhorar continuamente o banco de questões e lançar novas funcionalidades.

### 6.3 Modelo de Negócio
- **SaaS (B2C):** Assinatura mensal/anual para candidatos individuais.
- **White-Label (B2B):** Licença anual para faculdades e cursinhos, com customização de marca.
- **Freemium:** Versão gratuita com 20 questões por simulado e sem feedback imediato, para atrair usuários.

---

## 7. Considerações Finais

O sistema **Simulado OAB - FGV** tem um potencial comercial enorme, pois atende a uma demanda crítica de candidatos que buscam aprovação. Com as melhorias de interação propostas e uma Landing Page bem estruturada, o produto se tornará competitivo e rentável.

**Próximos Passos:**
1.  Priorizar a implementação dos requisitos de **Prioridade Essencial e Importante**.
2.  Começar a construção da Landing Page (mesmo que estática, para coletar leads).
3.  Definir a equipe de desenvolvimento ou contratar um profissional para acelerar as entregas.

---

**Aprovado por:**
__________________________
[Nome do Responsável]
[Cargo]
[Data]