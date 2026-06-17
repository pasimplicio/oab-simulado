# Documento de Requisitos - Melhorias de Interação e Landing Page
# Sistema Simulado OAB - FGV

**Versão:** 2.0 (Comercial com Landing Page)
**Data:** 17 de junho de 2026
**Autor:** [Seu Nome / Sua Empresa]

---

## 1. Introdução

### 1.1 Objetivo
Este documento detalha as melhorias necessárias na **interação do usuário com o simulado** e propõe uma **Landing Page** para comercialização do sistema. O foco é transformar o atual protótipo funcional em um **produto premium** com experiência de usuário (UX) excepcional, capaz de justificar um modelo de negócio baseado em assinaturas ou licenças.

### 1.2 Justificativa
O sistema atual tem um motor excelente, mas a experiência de uso é básica. Para competir com soluções pagas do mercado (QConcursos, Estratégia OAB, Gran Cursos), é necessário:
- Oferecer **feedback imediato** e visual durante a prova.
- Dar ao usuário **controle e visibilidade** do progresso.
- Criar uma **jornada de compra** clara através de uma Landing Page profissional.

---

## 2. Melhorias na Interação do Usuário (Prioritárias)

### 2.1 Feedback Imediato (Essencial)

| ID | Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **MI-01** | **Feedback Visual Imediato** | No **Modo Livre**, ao clicar em uma alternativa, a opção selecionada deve mudar de cor instantaneamente: <br> 🟢 **Verde** = Correta <br> 🔴 **Vermelho** = Errada <br> Além disso, deve aparecer um ícone (✅ ou ❌) ao lado da alternativa. |
| **MI-02** | **Tooltip com Explicação Rápida** | Após o feedback visual, um pequeno tooltip/popup deve surgir com o fundamento legal resumido (ex: "Art. 927, CC - Responsabilidade Civil"). O usuário pode clicar em "Ver Mais" para abrir o comentário completo. |
| **MI-03** | **Manter Feedback no Modo Prova** | No **Modo Prova**, o feedback NÃO deve ser exibido durante a prova para manter o realismo. Porém, ao final, na tela de resultados, cada questão deve mostrar claramente ✅ ou ❌ ao lado da alternativa escolhida. |

### 2.2 Controle de Progresso (Essencial)

| ID | Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **MI-04** | **Barra de Progresso Superior** | No topo da tela de prova, exibir uma barra horizontal preenchendo conforme o usuário avança. Texto ao lado: "Questão 23 de 80" ou "23/80". |
| **MI-05** | **Minimapa de Questões** | No rodapé da tela, exibir 80 pequenos círculos (ou retângulos) organizados em linhas. Cada círculo representa uma questão e muda de cor conforme o status: <br> ⚪ **Branco** = Não respondida <br> 🟡 **Amarelo** = Respondida (aguardando correção no Modo Prova) <br> 🟢 **Verde** = Respondida e Correta (Modo Livre) <br> 🔴 **Vermelho** = Respondida e Errada (Modo Livre) <br> 🔵 **Azul** = Marcada para Revisão |
| **MI-06** | **Navegação Rápida** | O usuário deve poder clicar em qualquer círculo do minimapa para ir diretamente para aquela questão. Isso facilita a revisão de questões específicas. |
| **MI-07** | **Indicador de Questão Atual** | A questão que está sendo exibida no momento deve ter seu círculo correspondente destacado com uma borda ou brilho. |

### 2.3 Controle de Tempo (Importante)

| ID | Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **MI-08** | **Cronômetro Regressivo** | Na tela de prova, exibir um cronômetro regressivo de **5 horas** (tempo oficial da prova). Deve ter botões para: <br> ▶️ **Iniciar** <br> ⏸️ **Pausar** <br> 🔄 **Resetar** (apenas antes de iniciar) |
| **MI-09** | **Alertas de Tempo** | O sistema deve emitir alertas visuais e sonoros (opcional) quando faltarem: <br> ⏰ **30 minutos** (alerta amarelo) <br> ⏰ **5 minutos** (alerta vermelho com contagem regressiva) |
| **MI-10** | **Tempo na Tela de Resultados** | No resultado final, exibir: <br> - Tempo total gasto <br> - Tempo médio por questão <br> - Tempo gasto por disciplina (se possível) |

### 2.4 Personalização e Filtros (Importante)

| ID | Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **MI-11** | **Filtro por Disciplinas** | Na tela inicial, permitir que o usuário marque/desmarque disciplinas para gerar um simulado focado. Exemplo: "Quero treinar só Direito Penal e Constitucional". |
| **MI-12** | **Filtro por Número de Questões** | Oferecer opções: 20, 40 ou 80 questões. O sistema deve ajustar a distribuição proporcionalmente. |
| **MI-13** | **Filtro por Dificuldade** | Permitir escolher entre: "Todas", "Apenas Fáceis", "Apenas Médias", "Apenas Difíceis" ou "Mistas". |
| **MI-14** | **Opção de Embaralhar Alternativas** | Checkbox para ativar/desativar o embaralhamento das alternativas. Útil para evitar vício visual. |

### 2.5 Funcionalidades Gamificadas e Sociais (Desejável)

| ID | Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **MI-15** | **Histórico de Desempenho** | Armazenar (localStorage) os resultados de todos os simulados. Exibir na tela inicial um gráfico de evolução (linha) com as notas ao longo do tempo. |
| **MI-16** | **Compartilhamento de Resultado** | Botão para compartilhar o resultado (nota + estatísticas) em redes sociais (WhatsApp, LinkedIn, Twitter). Gerar uma imagem customizada com o desempenho. |
| **MI-17** | **Desafios Diários** | Gerar automaticamente 5 questões aleatórias por dia. O usuário pode tentar acertar todas e ver um ranking de acertos (global ou entre amigos). |
| **MI-18** | **Marcar para Revisão** | Permite ao usuário "marcar" uma questão com uma bandeira (🚩) para revisá-la depois. As questões marcadas ficam em uma lista separada. |

### 2.6 Acessibilidade e Conforto Visual (Desejável)

| ID | Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **MI-19** | **Tema Claro/Escuro** | Adicionar um toggle (interruptor) no canto superior direito para alternar entre o tema escuro (padrão) e um tema claro (fundo branco). |
| **MI-20** | **Controle de Tamanho da Fonte** | Oferecer botões "A+" e "A-" para aumentar/diminuir o tamanho da fonte, atendendo a necessidades de acessibilidade. |
| **MI-21** | **Navegação por Teclado** | Permitir navegação completa usando apenas teclado (setas, Enter, Tab), conforme diretrizes WCAG. |

---

## 3. Landing Page para Comercialização

### 3.1 Propósito
A Landing Page é a **principal ferramenta de vendas** do sistema. Ela deve converter visitantes (candidatos à OAB ou instituições) em leads (e-mails) ou clientes pagantes (assinantes).

### 3.2 Estrutura da Landing Page

A página deve seguir uma sequência lógica de persuasão, baseada no modelo **AIDA** (Atenção, Interesse, Desejo, Ação):

#### Seção 1: Hero (Atenção)
- **Título Principal (Headline):**
  *"Treine para a 1ª Fase da OAB com Simulados Indistinguíveis dos da FGV"*
- **Subtítulo:**
  *"Banco de questões para treino OAB/FGV, correção estruturada e mapa de revisão para orientar seus estudos."*
- **Imagem/Vídeo:** GIF ou vídeo curto (15 segundos) mostrando o sistema em ação (tela de prova, alternativas, resultado).
- **Call to Action (CTA) Principal:**
  Botão grande e colorido: **"TESTE GRÁTIS POR 7 DIAS"** ou **"COMECE AGORA"**.
- **Elemento de Urgência:**
  *"Oferta por tempo limitado: 30% de desconto na assinatura anual."*

#### Seção 2: Problema e Solução (Interesse)
- **Problema:**
  *"Estudar para a OAB é desafiador: a maioria dos simulados tem questões genéricas, não dá feedback detalhado e não mostra onde você errou mais."*
- **Solução:**
  *"O Simulado OAB resolve isso: questões no formato FGV, correção imediata, mapa de revisão personalizado e controle de tempo. Você treina como se estivesse na prova real."*

#### Seção 3: Diferenciais (Desejo)

Apresentar em formato de cards (3 por linha), com ícones:

| Ícone | Diferencial | Descrição |
| :--- | :--- | :--- |
| 🎯 | **Fidelidade FGV** | Questões com o mesmo vocabulário, pegadinhas e base legal da banca. |
| 📝 | **Banco de Questões Organizado** | Questões estruturadas por disciplina, dificuldade e formato da prova. |
| 🔍 | **Feedback Imediato** | Saiba na hora se acertou ou errou, com fundamento legal. |
| 🗺️ | **Mapa de Revisão** | Descubra seus pontos fracos e foque neles. |
| ⏱️ | **Controle de Tempo** | Cronômetro regressivo de 5h, como na prova real. |
| 📊 | **Histórico de Desempenho** | Acompanhe sua evolução com gráficos. |
| 📱 | **Acessível em Qualquer Lugar** | Funciona no celular, tablet ou computador. |
| 🧠 | **Gabarito Comentado** | Explicação de cada alternativa e da pegadinha usada. |

#### Seção 4: Depoimentos (Prova Social)

Incluir 3 depoimentos de usuários reais (beta testers ou clientes piloto):

> *"Passei na OAB no 47º exame depois de usar o simulado! As questões eram muito parecidas com as da prova."*
> — **Ana C., Aprovada**

> *"O mapa de revisão me salvou. Foquei nos meus erros e consegui aumentar minha nota em 20%."*
> — **João P., Aprovado**

> *"A melhor ferramenta de treino para a 1ª fase. Vale cada centavo."*
> — **Dra. Mariana, Advogada**

#### Seção 5: Planos e Preços (Ação)

Apresentar 3 planos, com destaque para o plano mais vendido:

| Plano Básico | Plano Pro (Recomendado) | Plano Institucional |
| :--- | :--- | :--- |
| **R$ 29,90/mês** | **R$ 49,90/mês** | **R$ 499/mês** |
| Simulados ilimitados | Todos do Básico + | Todos do Pro + |
| Modo Prova e Livre | Histórico de desempenho | White-label (sua marca) |
| Gabarito comentado | Filtros avançados | Relatórios agregados |
| Mapa de revisão | Marcar para revisão | Painel administrativo |
| **ASSINAR** | **ASSINAR (MAIS POPULAR)** | **CONTRATAR** |

#### Seção 6: FAQ (Perguntas Frequentes)

Incluir 5-7 perguntas com respostas curtas:

- *Posso testar antes de comprar?*
  Sim! Oferecemos 7 dias de teste grátis, sem compromisso.

- *As questões são atualizadas?*
  Sim, atualizamos o banco a cada novo edital da OAB.

- *Funciona offline?*
  Sim, após o primeiro carregamento, você pode usar sem internet.

- *Como faço para cancelar?*
  Você pode cancelar a qualquer momento pelo painel do usuário.

- *Posso usar no celular?*
  Sim, o sistema é responsivo e funciona em qualquer dispositivo.

- *O sistema é para a 1ª fase apenas?*
  Atualmente, sim. Futuramente, planejamos expandir para a 2ª fase.

#### Seção 7: Rodapé

- Links para: Termos de Uso, Política de Privacidade, Contato.
- E-mail de suporte: [seu-email@dominio.com]
- Copyright: © [Ano] [Nome da Sua Empresa]. Todos os direitos reservados.

### 3.3 Integrações Técnicas da Landing Page

| Funcionalidade | Ferramenta/Sugestão |
| :--- | :--- |
| **Captura de Leads** | Formulário integrado com Mailchimp, ConvertKit ou RD Station. |
| **Pagamento** | Stripe, PagSeguro ou Mercado Pago para assinaturas. |
| **Área do Usuário** | Painel simples onde o assinante faz login e acessa o simulado. |
| **Analytics** | Google Analytics e/ou Plausible para medir conversões. |
| **Hospedagem** | Vercel, Netlify ou AWS (para a Landing Page e o sistema). |

---

## 4. Plano de Implantação e Comercialização

### 4.1 Fases de Desenvolvimento

| Fase | Atividades | Prazo Estimado |
| :--- | :--- | :--- |
| **Fase 1 (Core)** | Motor de geração, banco de questões, modo prova, correção e resultados. | **Concluído** |
| **Fase 2 (UX/UI)** | Feedback imediato, barra de progresso, minimapa, cronômetro. | 2-3 semanas |
| **Fase 3 (Interação Avançada)** | Filtros, histórico, marcar para revisão, tema claro/escuro. | 3-4 semanas |
| **Fase 4 (Landing Page)** | Desenvolver a Landing Page, sistema de autenticação e pagamento. | 4-6 semanas |
| **Fase 5 (Testes e Lançamento)** | Testes de usabilidade, correção de bugs, lançamento comercial. | 2-3 semanas |

### 4.2 Estratégia de Lançamento

1. **Pré-lançamento (Mês 1):**
   - Oferecer acesso gratuito para 100 usuários beta.
   - Coletar depoimentos e feedback para melhorias.

2. **Lançamento Oficial (Mês 2):**
   - Divulgar em redes sociais (LinkedIn, Instagram), grupos de direito no Facebook.
   - Parcerias com influenciadores da área jurídica.

3. **Pós-lançamento (Mês 3+):**
   - Coletar dados de uso e melhorar continuamente.
   - Lançar novas funcionalidades (ex: 2ª fase, questões personalizadas).

### 4.3 Modelo de Negócio

| Canal | Descrição |
| :--- | :--- |
| **SaaS (B2C)** | Assinatura mensal/anual para candidatos individuais. |
| **White-Label (B2B)** | Licença anual para faculdades e cursinhos, com customização de marca e logo. |
| **Freemium** | Versão gratuita com 20 questões por simulado e sem feedback imediato, para atrair usuários e convertê-los. |

---

## 5. Considerações Finais

O sistema **Simulado OAB - FGV** tem um potencial comercial enorme. Com as melhorias de interação propostas e uma Landing Page bem estruturada, o produto se tornará competitivo e rentável, atendendo a uma demanda crítica de candidatos que buscam aprovação.

**Próximos Passos Recomendados:**
1. Implementar as melhorias de **Feedback Imediato** e **Controle de Progresso** (prioridade máxima).
2. Construir a **Landing Page** (mesmo que estática) para começar a capturar leads.
3. Definir e estruturar o **modelo de pagamento** (Stripe, PagSeguro).

---

**Aprovado por:**
__________________________
[Nome do Responsável]
[Cargo]
[Data]
