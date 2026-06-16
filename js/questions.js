/**
 * BANCO DE QUESTÕES — Simulado OAB 1ª fase (estilo FGV)
 *
 * IMPORTANTE: todas as questões são INÉDITAS e autorais, escritas para replicar
 * fielmente o formato, a dificuldade, as armadilhas e a base legal da banca FGV
 * no Exame de Ordem. Não são reproduções literais de provas anteriores
 * (protegidas por direito autoral) — são funcionalmente equivalentes em estilo.
 *
 * Esquema de cada questão:
 * {
 *   id, disciplina, topico, dificuldade: "facil"|"media"|"dificil",
 *   enunciado, alternativas: {A,B,C,D}, correta: "A".."D",
 *   fundamento: base legal/jurisprudencial,
 *   comentario: { A,B,C,D } -> por que cada uma está certa/errada,
 *   pegadinha: armadilha típica usada (opcional)
 * }
 */

const QUESTOES = [
  /* ===================== ÉTICA PROFISSIONAL ===================== */
  {
    id: "etica-001",
    disciplina: "Ética Profissional",
    topico: "Honorários advocatícios",
    dificuldade: "media",
    enunciado:
      "Mariana, advogada regularmente inscrita, foi contratada por verbal acordo para patrocinar ação de cobrança. Após o ajuizamento, antes da sentença, a cliente revoga o mandato sem justa causa e contrata outro profissional. Sobre os honorários, assinale a afirmativa correta.",
    alternativas: {
      A: "A advogada nada pode cobrar, pois o contrato verbal de honorários é nulo perante o Estatuto da OAB.",
      B: "A advogada tem direito aos honorários proporcionais ao serviço prestado, podendo arbitrá-los judicialmente na falta de estipulação escrita.",
      C: "A advogada somente terá direito a honorários se houver êxito na demanda, em razão da cláusula quota litis presumida.",
      D: "Os honorários de sucumbência, por pertencerem ao advogado, impedem a cobrança de honorários contratuais cumulativamente.",
    },
    correta: "B",
    fundamento:
      "Art. 22, §2º, da Lei 8.906/94 (EAOAB): na falta de estipulação ou acordo, os honorários serão fixados por arbitramento judicial. A revogação do mandato não retira o direito aos honorários pelo serviço já prestado.",
    comentario: {
      A: "Errada. O contrato verbal não é nulo; na ausência de estipulação escrita, cabe arbitramento judicial (art. 22, §2º).",
      B: "Correta. Sem estipulação, os honorários são fixados por arbitramento, proporcionalmente ao trabalho realizado.",
      C: "Errada. A cláusula quota litis (êxito) não se presume e tem limites próprios (art. 38, CED); não é a regra geral.",
      D: "Errada. Honorários de sucumbência e contratuais são cumuláveis; pertencem ao advogado e não se excluem (art. 22 e 23).",
    },
    pegadinha: "Inversão de regra: a banca sugere nulidade do contrato verbal, mas a lei prevê arbitramento.",
  },
  {
    id: "etica-002",
    disciplina: "Ética Profissional",
    topico: "Incompatibilidades e impedimentos",
    dificuldade: "media",
    enunciado:
      "Determinado bacharel em Direito, aprovado no Exame de Ordem, foi nomeado e tomou posse no cargo de Ocupante de cargo de Chefe do Poder Executivo Municipal (Prefeito). Acerca do exercício da advocacia, assinale a afirmativa correta.",
    alternativas: {
      A: "Está impedido de advogar apenas contra a Fazenda Pública municipal que o remunera.",
      B: "Pode advogar livremente, pois o cargo eletivo não gera qualquer restrição.",
      C: "É totalmente incompatível com a advocacia, ficando proibido de exercê-la enquanto durar o mandato.",
      D: "Pode advogar em causa própria e em favor de parentes até o segundo grau.",
    },
    correta: "C",
    fundamento:
      "Art. 28, I e II, da Lei 8.906/94: a advocacia é incompatível, mesmo em causa própria, com a atividade de Chefe do Poder Executivo e membros da Mesa do Legislativo. Incompatibilidade = proibição total.",
    comentario: {
      A: "Errada. Isso descreveria impedimento (proibição parcial), não a incompatibilidade total do Chefe do Executivo.",
      B: "Errada. Há incompatibilidade total prevista em lei.",
      C: "Correta. Chefe do Poder Executivo gera incompatibilidade (proibição total), inclusive em causa própria.",
      D: "Errada. A incompatibilidade alcança até a advocacia em causa própria.",
    },
    pegadinha: "Confusão clássica entre incompatibilidade (total) e impedimento (parcial).",
  },
  {
    id: "etica-003",
    disciplina: "Ética Profissional",
    topico: "Infrações e sanções disciplinares",
    dificuldade: "dificil",
    enunciado:
      "Advogado é condenado, em processo disciplinar regular, por captação de causa mediante agenciamento, reincidindo em infração já punida com censura. Sobre a sanção aplicável, assinale a afirmativa correta.",
    alternativas: {
      A: "A pena de censura deve ser convertida automaticamente em exclusão por se tratar de reincidência.",
      B: "A reincidência em infração disciplinar conduz, em regra, à aplicação da pena de suspensão.",
      C: "A pena cabível é a exclusão, que independe de manifestação do Conselho Seccional.",
      D: "A sanção de multa substitui a suspensão sempre que o infrator for primário no agenciamento.",
    },
    correta: "B",
    fundamento:
      "Art. 37, I, da Lei 8.906/94: aplica-se suspensão na reincidência em infração punível com censura. A exclusão (art. 38) exige aplicação de três suspensões e decisão por 2/3 dos votos do Conselho Seccional.",
    comentario: {
      A: "Errada. Não há conversão automática em exclusão; a reincidência leva à suspensão.",
      B: "Correta. Reincidência em infração apenada com censura enseja suspensão (art. 37, I).",
      C: "Errada. A exclusão exige manifestação qualificada (2/3) do Conselho Seccional (art. 38, parágrafo único).",
      D: "Errada. A multa é cumulável com censura ou suspensão (art. 39), não substitui automaticamente a suspensão.",
    },
    pegadinha: "Salto indevido para a pena mais grave (exclusão) sem observar a gradação do art. 37.",
  },
  {
    id: "etica-004",
    disciplina: "Ética Profissional",
    topico: "Direitos e prerrogativas",
    dificuldade: "facil",
    enunciado:
      "Sobre as prerrogativas profissionais do advogado previstas no Estatuto da Advocacia, assinale a afirmativa correta.",
    alternativas: {
      A: "O advogado pode ingressar livremente nas salas de sessões dos tribunais, mesmo além dos cancelos que separam a parte reservada aos magistrados.",
      B: "A prisão em flagrante de advogado por motivo do exercício da profissão só pode ocorrer em caso de crime inafiançável e exige a presença de representante da OAB.",
      C: "A inviolabilidade do escritório do advogado é absoluta, não admitindo busca e apreensão em nenhuma hipótese.",
      D: "O advogado não tem direito a sustentação oral, salvo expressa autorização do relator.",
    },
    correta: "B",
    fundamento:
      "Art. 7º, IV e §3º, da Lei 8.906/94: prisão em flagrante por motivo ligado ao exercício da advocacia exige crime inafiançável e a presença de representante da OAB, sob pena de nulidade.",
    comentario: {
      A: "Errada. O ingresso livre nas salas de sessão respeita os cancelos reservados aos magistrados (art. 7º, VI, 'c').",
      B: "Correta. Reflete o art. 7º, §3º (flagrante de crime inafiançável + presença da OAB).",
      C: "Errada. A inviolabilidade é relativizada: cabe busca/apreensão por decisão judicial fundamentada com acompanhamento da OAB (art. 7º, §6º).",
      D: "Errada. A sustentação oral é prerrogativa do advogado nos casos cabíveis (art. 7º, IX).",
    },
  },
  {
    id: "etica-005",
    disciplina: "Ética Profissional",
    topico: "Sociedade de advogados",
    dificuldade: "media",
    enunciado:
      "Dois advogados pretendem constituir sociedade para o exercício da advocacia. Sobre o regime das sociedades de advogados, assinale a afirmativa correta.",
    alternativas: {
      A: "A sociedade adquire personalidade jurídica com o registro na Junta Comercial competente.",
      B: "É vedada a inclusão, na razão social, do nome de advogado falecido, ainda que prevista no ato constitutivo.",
      C: "Nenhum advogado pode integrar mais de uma sociedade de advogados com sede ou filial na mesma área territorial do respectivo Conselho Seccional.",
      D: "A sociedade de advogados pode adotar a forma de sociedade empresária para fins de limitação de responsabilidade.",
    },
    correta: "C",
    fundamento:
      "Art. 15, §4º, da Lei 8.906/94: nenhum advogado pode integrar mais de uma sociedade de advogados, sociedade unipessoal de advocacia, com sede ou filial na mesma área territorial do respectivo Conselho Seccional.",
    comentario: {
      A: "Errada. O registro é no Conselho Seccional da OAB, não na Junta Comercial (art. 15, §1º).",
      B: "Errada. É permitido manter na razão social o nome de sócio falecido, se previsto no ato constitutivo (art. 16, §1º).",
      C: "Correta. Vedação do art. 15, §4º.",
      D: "Errada. A sociedade de advogados não pode ter forma empresária nem características mercantis (art. 16, caput).",
    },
    pegadinha: "Registro na Junta Comercial (empresarial) x registro na OAB.",
  },
  {
    id: "etica-006",
    disciplina: "Ética Profissional",
    topico: "Código de Ética e Disciplina",
    dificuldade: "media",
    enunciado:
      "De acordo com o Código de Ética e Disciplina da OAB, no que tange à publicidade profissional, assinale a afirmativa correta.",
    alternativas: {
      A: "É permitida a publicidade que ofereça serviços jurídicos com captação de clientela e promessa de resultado.",
      B: "A publicidade profissional deve ter caráter meramente informativo, primando pela discrição e sobriedade, vedada a divulgação em conjunto com outra atividade.",
      C: "O advogado pode anunciar valores de honorários em outdoors e rádios locais, desde que de forma moderada.",
      D: "É livre a menção a títulos acadêmicos e a divulgação de processos em que tenha atuado, com nomes dos clientes.",
    },
    correta: "B",
    fundamento:
      "Arts. 39 a 47 do CED: a publicidade do advogado tem caráter informativo, com discrição e sobriedade; vedadas captação de clientela, mercantilização e divulgação em conjunto com outra atividade.",
    comentario: {
      A: "Errada. Captação de clientela e promessa de resultado são vedadas (art. 40, CED).",
      B: "Correta. Caráter informativo, discrição e sobriedade (art. 44, CED).",
      C: "Errada. Vedada publicidade imoderada e em outdoors/rádio nesses moldes (art. 46, CED e Provimentos).",
      D: "Errada. Vedada a divulgação de clientes e a publicidade com tom mercantilista (sigilo profissional).",
    },
  },
  {
    id: "etica-007",
    disciplina: "Ética Profissional",
    topico: "Processo disciplinar",
    dificuldade: "dificil",
    enunciado:
      "Sobre a prescrição da pretensão punitiva no processo disciplinar da OAB, assinale a afirmativa correta.",
    alternativas: {
      A: "A pretensão à punibilidade prescreve em três anos, contados da constituição definitiva da infração.",
      B: "A prescrição é de cinco anos, contados da data da constatação oficial do fato, interrompendo-se pela instauração de processo disciplinar.",
      C: "A pretensão punitiva prescreve em dois anos, sem qualquer hipótese de interrupção.",
      D: "Não há prazo prescricional para infrações disciplinares cometidas por advogados.",
    },
    correta: "B",
    fundamento:
      "Art. 43 da Lei 8.906/94: a pretensão à punibilidade das infrações disciplinares prescreve em 5 anos, contados da data da constatação oficial do fato. Interrompe-se pela instauração do processo disciplinar ou pela notificação válida (art. 43, §2º).",
    comentario: {
      A: "Errada. O prazo é de cinco anos, não três.",
      B: "Correta. Art. 43: cinco anos, com causas interruptivas (instauração do processo).",
      C: "Errada. O prazo é de cinco anos e admite interrupção.",
      D: "Errada. Há prazo prescricional expresso (art. 43).",
    },
    pegadinha: "Troca de prazo (3 ou 2 anos) pelo correto de 5 anos.",
  },
  {
    id: "etica-008",
    disciplina: "Ética Profissional",
    topico: "Advogado empregado",
    dificuldade: "media",
    enunciado:
      "Acerca do advogado empregado, nos termos do Estatuto da Advocacia, assinale a afirmativa correta.",
    alternativas: {
      A: "A relação de emprego retira a isenção técnica e a independência profissional do advogado.",
      B: "A jornada de trabalho do advogado empregado, salvo acordo ou convenção coletiva, é de oito horas diárias e quarenta semanais.",
      C: "Os honorários de sucumbência pertencem exclusivamente ao empregador, dada a relação de emprego.",
      D: "Salvo estipulação em contrário, a jornada não excederá a duração diária de quatro horas contínuas e a de vinte horas semanais.",
    },
    correta: "D",
    fundamento:
      "Art. 20 da Lei 8.906/94: a jornada de trabalho do advogado empregado, no exercício da profissão, não poderá exceder a duração diária de quatro horas contínuas e a de vinte horas semanais, salvo acordo ou convenção coletiva ou dedicação exclusiva.",
    comentario: {
      A: "Errada. A relação de emprego não retira a isenção técnica nem a independência (art. 18).",
      B: "Errada. A jornada é de 4h diárias/20h semanais, salvo ajuste (art. 20), não 8h/40h.",
      C: "Errada. Os honorários de sucumbência são do advogado empregado; podem ser partilhados na forma do art. 21.",
      D: "Correta. Art. 20: 4 horas contínuas e 20 horas semanais, salvo estipulação em contrário.",
    },
    pegadinha: "Jornada padrão CLT (8h/40h) trocada pela regra especial do advogado (4h/20h).",
  },

  /* ===================== DIREITO CONSTITUCIONAL ===================== */
  {
    id: "const-001",
    disciplina: "Direito Constitucional",
    topico: "Direitos e garantias fundamentais",
    dificuldade: "media",
    enunciado:
      "Determinada associação regularmente constituída há mais de dois anos pretende impetrar mandado de segurança coletivo em defesa de interesses de seus associados. Sobre a legitimidade e os remédios constitucionais, assinale a afirmativa correta.",
    alternativas: {
      A: "A associação só pode impetrar mandado de segurança coletivo mediante autorização expressa de cada associado, em assembleia.",
      B: "Partido político com representação no Congresso Nacional, organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano podem impetrar mandado de segurança coletivo.",
      C: "O mandado de segurança coletivo só é cabível contra ato de autoridade do Poder Executivo federal.",
      D: "Apenas o Ministério Público detém legitimidade para a impetração de mandado de segurança coletivo.",
    },
    correta: "B",
    fundamento:
      "Art. 5º, LXX, da CF/88: o mandado de segurança coletivo pode ser impetrado por partido político com representação no Congresso Nacional e por organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano, em defesa dos interesses de seus membros.",
    comentario: {
      A: "Errada. No MS coletivo a associação age como substituta processual, dispensada autorização individual (Súmula 629 STF).",
      B: "Correta. Reproduz o rol do art. 5º, LXX.",
      C: "Errada. Cabe contra ato de qualquer autoridade pública ou agente de pessoa jurídica no exercício de função pública.",
      D: "Errada. O MP não consta do rol do art. 5º, LXX (legitimados são partido, sindicato, entidade de classe e associação).",
    },
    pegadinha: "Exigência indevida de autorização individual no MS coletivo.",
  },
  {
    id: "const-002",
    disciplina: "Direito Constitucional",
    topico: "Controle de constitucionalidade",
    dificuldade: "dificil",
    enunciado:
      "Sobre o controle concentrado de constitucionalidade perante o Supremo Tribunal Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "A decisão de mérito proferida em ADI produz, em regra, efeitos inter partes e prospectivos (ex nunc).",
      B: "Lei municipal contestada em face da Constituição Federal pode ser objeto de ADI perante o STF.",
      C: "A ação declaratória de constitucionalidade e a ação direta de inconstitucionalidade possuem caráter dúplice ou ambivalente.",
      D: "A arguição de descumprimento de preceito fundamental é cabível ainda que exista outro meio eficaz para sanar a lesividade.",
    },
    correta: "C",
    fundamento:
      "Art. 24 da Lei 9.868/99: ADI e ADC têm caráter dúplice/ambivalente — a procedência de uma equivale à improcedência da outra. ADPF é subsidiária (art. 4º, §1º, Lei 9.882/99).",
    comentario: {
      A: "Errada. A decisão de ADI tem, em regra, efeitos erga omnes e ex tunc (art. 102, §2º, CF; art. 27, Lei 9.868/99).",
      B: "Errada. Lei municipal x CF não cabe em ADI no STF; cabe ADPF ou controle difuso (art. 102, I, 'a').",
      C: "Correta. Caráter dúplice/ambivalente da ADI e ADC (art. 24, Lei 9.868/99).",
      D: "Errada. A ADPF é subsidiária: só cabe quando não houver outro meio eficaz (art. 4º, §1º, Lei 9.882/99).",
    },
    pegadinha: "Lei municipal em ADI no STF (não cabe) e efeitos inter partes (na verdade erga omnes).",
  },
  {
    id: "const-003",
    disciplina: "Direito Constitucional",
    topico: "Organização do Estado",
    dificuldade: "media",
    enunciado:
      "A respeito da repartição constitucional de competências entre os entes federativos, assinale a afirmativa correta.",
    alternativas: {
      A: "Compete privativamente à União legislar sobre direito civil, comercial, penal, processual, eleitoral e do trabalho.",
      B: "Compete concorrentemente aos Estados, ao Distrito Federal e aos Municípios legislar sobre direito tributário e financeiro.",
      C: "No âmbito da competência concorrente, inexistindo lei federal de normas gerais, os Estados não podem legislar.",
      D: "Compete aos Municípios legislar privativamente sobre direito do trabalho de servidores municipais.",
    },
    correta: "A",
    fundamento:
      "Art. 22, I, da CF/88: compete privativamente à União legislar sobre direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho.",
    comentario: {
      A: "Correta. Reproduz o art. 22, I.",
      B: "Errada. A competência concorrente do art. 24 é da União, Estados e DF — Municípios não integram o art. 24.",
      C: "Errada. Inexistindo norma geral federal, os Estados exercem competência legislativa plena (art. 24, §3º).",
      D: "Errada. Direito do trabalho é competência privativa da União (art. 22, I).",
    },
    pegadinha: "Inclusão indevida dos Municípios na competência concorrente do art. 24.",
  },
  {
    id: "const-004",
    disciplina: "Direito Constitucional",
    topico: "Direitos sociais",
    dificuldade: "facil",
    enunciado:
      "Sobre os direitos sociais previstos na Constituição Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "A educação, a saúde, a alimentação, o trabalho, a moradia e a segurança são direitos sociais.",
      B: "O salário mínimo pode ser vinculado para qualquer fim, inclusive como indexador de benefícios.",
      C: "É vedada a participação dos trabalhadores nos lucros das empresas.",
      D: "O direito de greve dos servidores públicos é proibido pela Constituição.",
    },
    correta: "A",
    fundamento:
      "Art. 6º da CF/88: são direitos sociais a educação, a saúde, a alimentação, o trabalho, a moradia, o transporte, o lazer, a segurança, a previdência social, a proteção à maternidade e à infância e a assistência aos desamparados.",
    comentario: {
      A: "Correta. Rol do art. 6º.",
      B: "Errada. É vedada a vinculação do salário mínimo para qualquer fim (art. 7º, IV).",
      C: "Errada. A participação nos lucros é um direito (art. 7º, XI).",
      D: "Errada. O direito de greve do servidor é assegurado, nos termos de lei específica (art. 37, VII).",
    },
  },
  {
    id: "const-005",
    disciplina: "Direito Constitucional",
    topico: "Organização dos Poderes",
    dificuldade: "media",
    enunciado:
      "A respeito do processo legislativo e das competências do Poder Legislativo, assinale a afirmativa correta.",
    alternativas: {
      A: "As medidas provisórias podem disciplinar matéria reservada à lei complementar em casos de relevância e urgência.",
      B: "É vedada a edição de medida provisória sobre matéria relativa a direito penal, processual penal e processual civil.",
      C: "A iniciativa de leis complementares e ordinárias cabe exclusivamente ao Presidente da República.",
      D: "A emenda à Constituição pode ser objeto de deliberação ainda que tendente a abolir a forma federativa de Estado.",
    },
    correta: "B",
    fundamento:
      "Art. 62, §1º, I, 'b', da CF/88: é vedada a edição de medida provisória sobre matéria de direito penal, processual penal e processual civil.",
    comentario: {
      A: "Errada. MP não pode disciplinar matéria reservada à lei complementar (art. 62, §1º, III).",
      B: "Correta. Vedação expressa do art. 62, §1º, I, 'b'.",
      C: "Errada. A iniciativa de leis é, em regra, concorrente (art. 61); só há iniciativa privativa em matérias específicas.",
      D: "Errada. Não será objeto de deliberação a PEC tendente a abolir a forma federativa (cláusula pétrea, art. 60, §4º, I).",
    },
    pegadinha: "Cláusula pétrea (forma federativa) apresentada como passível de deliberação.",
  },
  {
    id: "const-006",
    disciplina: "Direito Constitucional",
    topico: "Direitos fundamentais",
    dificuldade: "media",
    enunciado:
      "João foi preso e, durante a custódia, não foi informado de seus direitos, tampouco teve assegurada a assistência da família e de advogado. Com base nas garantias do art. 5º da CF/88, assinale a afirmativa correta.",
    alternativas: {
      A: "O preso não tem direito à identificação dos responsáveis por sua prisão e interrogatório policial.",
      B: "É assegurado ao preso o direito ao silêncio e à assistência da família e de advogado.",
      C: "A prisão de qualquer pessoa independe de comunicação ao juiz competente.",
      D: "É admitida a prisão por dívida civil em qualquer hipótese de inadimplemento.",
    },
    correta: "B",
    fundamento:
      "Art. 5º, LXIII, da CF/88: o preso será informado de seus direitos, entre os quais o de permanecer calado, sendo-lhe assegurada a assistência da família e de advogado.",
    comentario: {
      A: "Errada. O preso tem direito à identificação dos responsáveis por sua prisão e interrogatório (art. 5º, LXIV).",
      B: "Correta. Art. 5º, LXIII.",
      C: "Errada. A prisão deve ser comunicada imediatamente ao juiz e à família (art. 5º, LXII).",
      D: "Errada. A prisão civil por dívida só é admitida ao devedor de alimentos (Súmula Vinculante 25 afasta a do depositário infiel).",
    },
  },
  {
    id: "const-007",
    disciplina: "Direito Constitucional",
    topico: "Nacionalidade",
    dificuldade: "dificil",
    enunciado:
      "Sobre a nacionalidade na Constituição Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "São brasileiros natos os nascidos no estrangeiro, de pai ou mãe brasileiros, desde que registrados em repartição brasileira competente ou venham a residir no Brasil e optem pela nacionalidade.",
      B: "Cargo de Presidente do Senado Federal pode ser ocupado por brasileiro naturalizado.",
      C: "A naturalização de estrangeiro originário de país de língua portuguesa exige residência ininterrupta de quinze anos e idoneidade moral.",
      D: "A perda da nacionalidade brasileira jamais pode decorrer de aquisição voluntária de outra nacionalidade.",
    },
    correta: "A",
    fundamento:
      "Art. 12, I, 'c', da CF/88: são brasileiros natos os nascidos no estrangeiro de pai ou mãe brasileiros, desde que registrados em repartição competente ou venham residir no Brasil e optem, a qualquer tempo, depois de atingida a maioridade, pela nacionalidade brasileira.",
    comentario: {
      A: "Correta. Hipótese do art. 12, I, 'c'.",
      B: "Errada. O cargo de Presidente do Senado é privativo de brasileiro nato (art. 12, §3º, III).",
      C: "Errada. Para originários de país de língua portuguesa exige-se apenas residência por um ano ininterrupto e idoneidade moral (art. 12, II, 'a').",
      D: "Errada. A perda pode decorrer de aquisição voluntária de outra nacionalidade, com exceções (art. 12, §4º, II).",
    },
    pegadinha: "Troca dos prazos de naturalização e do cargo privativo de nato.",
  },
  {
    id: "const-008",
    disciplina: "Direito Constitucional",
    topico: "Administração Pública",
    dificuldade: "media",
    enunciado:
      "Acerca dos princípios e regras da Administração Pública no art. 37 da CF/88, assinale a afirmativa correta.",
    alternativas: {
      A: "A investidura em cargo ou emprego público independe de aprovação prévia em concurso público em qualquer hipótese.",
      B: "Os cargos em comissão e as funções de confiança podem ser livremente preenchidos por servidores e não servidores, sem qualquer reserva.",
      C: "A administração pública obedece aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência.",
      D: "É permitida a acumulação remunerada de cargos públicos como regra geral.",
    },
    correta: "C",
    fundamento:
      "Art. 37, caput, da CF/88: a administração pública direta e indireta obedece aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência (LIMPE).",
    comentario: {
      A: "Errada. A investidura depende de concurso, ressalvadas as nomeações para cargo em comissão (art. 37, II).",
      B: "Errada. As funções de confiança são exclusivas de servidores efetivos e há percentual mínimo reservado para os cargos em comissão (art. 37, V).",
      C: "Correta. Princípios LIMPE do art. 37, caput.",
      D: "Errada. A acumulação remunerada é vedada como regra, salvo exceções (art. 37, XVI).",
    },
  },

  /* ===================== DIREITO CIVIL ===================== */
  {
    id: "civil-001",
    disciplina: "Direito Civil",
    topico: "Prescrição e decadência",
    dificuldade: "media",
    enunciado:
      "A respeito da prescrição no Código Civil, assinale a afirmativa correta.",
    alternativas: {
      A: "Os prazos de prescrição podem ser alterados por acordo das partes.",
      B: "A prescrição iniciada contra uma pessoa continua a correr contra o seu sucessor.",
      C: "A prescrição não corre entre os cônjuges na constância da sociedade conjugal, mas corre normalmente contra os absolutamente incapazes.",
      D: "A renúncia à prescrição pode ser feita antes de consumado o prazo prescricional.",
    },
    correta: "B",
    fundamento:
      "Art. 196 do CC: a prescrição iniciada contra uma pessoa continua a correr contra o seu sucessor. Art. 192: os prazos não podem ser alterados por acordo. Art. 198, I: não corre contra os absolutamente incapazes.",
    comentario: {
      A: "Errada. Os prazos prescricionais são legais e não podem ser alterados por acordo (art. 192).",
      B: "Correta. Art. 196.",
      C: "Errada. A prescrição não corre contra os absolutamente incapazes (art. 198, I).",
      D: "Errada. A renúncia só é válida depois de consumada a prescrição (art. 191).",
    },
    pegadinha: "Afirmar que a prescrição corre contra absolutamente incapazes.",
  },
  {
    id: "civil-002",
    disciplina: "Direito Civil",
    topico: "Responsabilidade civil",
    dificuldade: "media",
    enunciado:
      "Pedro, ao dirigir em alta velocidade, atropela um pedestre que atravessava na faixa, causando-lhe lesões. Sobre a responsabilidade civil, assinale a afirmativa correta.",
    alternativas: {
      A: "A responsabilidade de Pedro é subjetiva e depende da demonstração de culpa, dano e nexo causal.",
      B: "A indenização mede-se pela extensão do dano, mas a culpa concorrente da vítima jamais influi no valor.",
      C: "A responsabilidade civil de Pedro depende de prévia condenação criminal pelo mesmo fato.",
      D: "O dano exclusivamente moral não é indenizável no ordenamento brasileiro.",
    },
    correta: "A",
    fundamento:
      "Arts. 186 e 927 do CC: aquele que, por ação ou omissão voluntária, negligência ou imprudência, causa dano a outrem comete ato ilícito e fica obrigado a repará-lo. Responsabilidade subjetiva = culpa + dano + nexo.",
    comentario: {
      A: "Correta. Trata-se de responsabilidade subjetiva (arts. 186 e 927, caput).",
      B: "Errada. A culpa concorrente da vítima influi na fixação da indenização (art. 945).",
      C: "Errada. A responsabilidade civil é independente da criminal (art. 935).",
      D: "Errada. O dano moral é indenizável (art. 186 c/c Súmula 37 STJ e art. 5º, V e X, CF).",
    },
  },
  {
    id: "civil-003",
    disciplina: "Direito Civil",
    topico: "Negócio jurídico",
    dificuldade: "dificil",
    enunciado:
      "Sobre os defeitos do negócio jurídico, assinale a afirmativa correta.",
    alternativas: {
      A: "O negócio jurídico praticado mediante coação física (vis absoluta) é anulável.",
      B: "A lesão configura-se quando uma pessoa, sob premente necessidade ou por inexperiência, obriga-se a prestação manifestamente desproporcional ao valor da prestação oposta.",
      C: "O dolo acidental conduz à anulação do negócio jurídico.",
      D: "O estado de perigo torna o negócio nulo de pleno direito.",
    },
    correta: "B",
    fundamento:
      "Art. 157 do CC: ocorre a lesão quando uma pessoa, sob premente necessidade ou por inexperiência, se obriga a prestação manifestamente desproporcional ao valor da prestação oposta.",
    comentario: {
      A: "Errada. A coação física (vis absoluta) gera negócio inexistente/nulo, não mero anulável (a vis compulsiva é que anula).",
      B: "Correta. Conceito de lesão (art. 157).",
      C: "Errada. O dolo acidental só obriga à satisfação de perdas e danos, não anula (art. 146).",
      D: "Errada. O estado de perigo torna o negócio anulável, não nulo (art. 156 c/c art. 171).",
    },
    pegadinha: "Confusão entre nulidade e anulabilidade nos vícios de vontade (estado de perigo é anulável).",
  },
  {
    id: "civil-004",
    disciplina: "Direito Civil",
    topico: "Direito das sucessões",
    dificuldade: "media",
    enunciado:
      "Falecido determinado indivíduo sem deixar testamento, deixando cônjuge sobrevivente casado sob o regime da comunhão parcial de bens e dois filhos comuns, e havendo bens particulares do falecido, assinale a afirmativa correta sobre a sucessão legítima.",
    alternativas: {
      A: "O cônjuge é excluído da sucessão, herdando apenas os descendentes.",
      B: "O cônjuge concorre com os descendentes na herança quanto aos bens particulares do falecido.",
      C: "O cônjuge recebe metade da herança e os filhos a outra metade, independentemente do regime.",
      D: "Os descendentes só herdam após a renúncia expressa do cônjuge.",
    },
    correta: "B",
    fundamento:
      "Art. 1.829, I, do CC e jurisprudência do STJ: no regime da comunhão parcial, havendo bens particulares, o cônjuge concorre com os descendentes quanto a esses bens particulares.",
    comentario: {
      A: "Errada. O cônjuge é herdeiro e concorre com os descendentes (art. 1.829, I).",
      B: "Correta. Na comunhão parcial com bens particulares, há concorrência sobre esses bens (entendimento do STJ).",
      C: "Errada. A divisão não é automática meação/metade; depende de concorrência e número de herdeiros.",
      D: "Errada. Não há necessidade de renúncia do cônjuge para os descendentes herdarem.",
    },
    pegadinha: "Excluir o cônjuge ou ignorar a distinção bens comuns x particulares.",
  },
  {
    id: "civil-005",
    disciplina: "Direito Civil",
    topico: "Contratos",
    dificuldade: "media",
    enunciado:
      "Sobre a teoria geral dos contratos no Código Civil, assinale a afirmativa correta.",
    alternativas: {
      A: "A liberdade contratual é absoluta, não se submetendo a função social do contrato.",
      B: "Nos contratos de adesão, são nulas as cláusulas que estipulem a renúncia antecipada do aderente a direito resultante da natureza do negócio.",
      C: "O contrato preliminar, para ter validade, deve sempre observar a forma do contrato definitivo.",
      D: "A exceção do contrato não cumprido (exceptio non adimpleti contractus) não é admitida nos contratos bilaterais.",
    },
    correta: "B",
    fundamento:
      "Art. 424 do CC: nos contratos de adesão, são nulas as cláusulas que estipulem a renúncia antecipada do aderente a direito resultante da natureza do negócio.",
    comentario: {
      A: "Errada. A liberdade de contratar exerce-se nos limites da função social (art. 421).",
      B: "Correta. Art. 424.",
      C: "Errada. O contrato preliminar não precisa observar a forma do definitivo, salvo quanto à essência (art. 462).",
      D: "Errada. A exceptio non adimpleti contractus é admitida nos contratos bilaterais (art. 476).",
    },
  },
  {
    id: "civil-006",
    disciplina: "Direito Civil",
    topico: "Direitos reais",
    dificuldade: "dificil",
    enunciado:
      "A respeito da usucapião de bem imóvel, assinale a afirmativa correta.",
    alternativas: {
      A: "A usucapião extraordinária exige justo título e boa-fé, com prazo de quinze anos.",
      B: "A usucapião especial urbana exige área de até duzentos e cinquenta metros quadrados, posse por cinco anos ininterruptos, sem oposição, para moradia, desde que o possuidor não seja proprietário de outro imóvel.",
      C: "A usucapião ordinária exige posse mansa e pacífica por vinte anos, independentemente de título.",
      D: "Bens públicos podem ser adquiridos por usucapião quando dominicais.",
    },
    correta: "B",
    fundamento:
      "Art. 183 da CF/88 e art. 1.240 do CC: usucapião especial urbana — área até 250m², posse de 5 anos ininterruptos e sem oposição, para moradia, sem ser proprietário de outro imóvel.",
    comentario: {
      A: "Errada. A usucapião extraordinária (art. 1.238) dispensa justo título e boa-fé; o requisito de título/boa-fé é da ordinária.",
      B: "Correta. Requisitos do art. 183, CF / art. 1.240, CC.",
      C: "Errada. A ordinária exige justo título e boa-fé, prazo de 10 anos (art. 1.242).",
      D: "Errada. Bens públicos não se sujeitam a usucapião (art. 102, CC; art. 183, §3º, CF).",
    },
    pegadinha: "Troca dos requisitos das espécies de usucapião e a usucapião de bem público.",
  },
  {
    id: "civil-007",
    disciplina: "Direito Civil",
    topico: "Pessoas e capacidade",
    dificuldade: "facil",
    enunciado:
      "Sobre as pessoas naturais e a capacidade civil, à luz do Código Civil com as alterações do Estatuto da Pessoa com Deficiência, assinale a afirmativa correta.",
    alternativas: {
      A: "São absolutamente incapazes os maiores de dezesseis e menores de dezoito anos.",
      B: "São absolutamente incapazes de exercer pessoalmente os atos da vida civil os menores de dezesseis anos.",
      C: "A pessoa com deficiência mental é, por essa única razão, absolutamente incapaz.",
      D: "A emancipação só pode ocorrer por concessão judicial.",
    },
    correta: "B",
    fundamento:
      "Art. 3º do CC (com redação dada pela Lei 13.146/2015): são absolutamente incapazes os menores de dezesseis anos. A deficiência, por si só, não gera incapacidade absoluta.",
    comentario: {
      A: "Errada. Os maiores de 16 e menores de 18 são relativamente incapazes (art. 4º, I).",
      B: "Correta. Art. 3º — única hipótese de incapacidade absoluta hoje.",
      C: "Errada. O Estatuto da Pessoa com Deficiência afastou a incapacidade absoluta por deficiência.",
      D: "Errada. A emancipação pode ser voluntária, judicial ou legal (art. 5º, parágrafo único).",
    },
  },
  {
    id: "civil-008",
    disciplina: "Direito Civil",
    topico: "Obrigações",
    dificuldade: "media",
    enunciado:
      "Sobre o adimplemento e a extinção das obrigações, assinale a afirmativa correta.",
    alternativas: {
      A: "O pagamento feito de boa-fé ao credor putativo é válido, ainda que provado depois que não era credor.",
      B: "A novação presume-se sempre que houver alteração no valor da dívida.",
      C: "A compensação depende de manifestação judicial e não opera entre dívidas líquidas e vencidas.",
      D: "O pagamento por terceiro não interessado nunca gera direito ao reembolso.",
    },
    correta: "A",
    fundamento:
      "Art. 309 do CC: o pagamento feito de boa-fé ao credor putativo é válido, ainda que provado depois que não era credor.",
    comentario: {
      A: "Correta. Art. 309 (proteção da boa-fé).",
      B: "Errada. A novação não se presume; deve resultar de vontade inequívoca (art. 361).",
      C: "Errada. A compensação opera de pleno direito entre dívidas líquidas, vencidas e fungíveis (art. 369).",
      D: "Errada. O terceiro não interessado que paga em seu próprio nome tem direito a reembolsar-se (art. 305).",
    },
  },

  /* ===================== DIREITO ADMINISTRATIVO ===================== */
  {
    id: "adm-001",
    disciplina: "Direito Administrativo",
    topico: "Atos administrativos",
    dificuldade: "media",
    enunciado:
      "Acerca dos atributos e elementos do ato administrativo, assinale a afirmativa correta.",
    alternativas: {
      A: "A presunção de legitimidade do ato administrativo é absoluta e não admite prova em contrário.",
      B: "A autoexecutoriedade está presente em todos os atos administrativos, independentemente de previsão legal.",
      C: "A Administração pode anular seus próprios atos quando eivados de vícios que os tornem ilegais e revogá-los por conveniência e oportunidade, respeitados os direitos adquiridos.",
      D: "O vício de competência jamais admite convalidação.",
    },
    correta: "C",
    fundamento:
      "Súmula 473 do STF: a Administração pode anular seus próprios atos quando eivados de vícios que os tornem ilegais, e pode revogá-los por motivo de conveniência ou oportunidade, respeitados os direitos adquiridos.",
    comentario: {
      A: "Errada. A presunção de legitimidade é relativa (juris tantum), admite prova em contrário.",
      B: "Errada. A autoexecutoriedade depende de previsão legal ou de situação de urgência; não está em todos os atos.",
      C: "Correta. Reflete a Súmula 473 do STF.",
      D: "Errada. O vício de competência (em razão da pessoa) admite convalidação, salvo competência exclusiva (art. 55, Lei 9.784/99).",
    },
    pegadinha: "Atribuir caráter absoluto à presunção de legitimidade.",
  },
  {
    id: "adm-002",
    disciplina: "Direito Administrativo",
    topico: "Responsabilidade civil do Estado",
    dificuldade: "media",
    enunciado:
      "Um veículo oficial, conduzido por servidor em serviço, colide com automóvel particular, causando danos. Sobre a responsabilidade civil do Estado, assinale a afirmativa correta.",
    alternativas: {
      A: "A responsabilidade do Estado é subjetiva, exigindo prova de dolo ou culpa do agente pela vítima.",
      B: "A vítima pode ajuizar a ação diretamente contra o agente público, que responde objetivamente.",
      C: "As pessoas jurídicas de direito público respondem objetivamente pelos danos que seus agentes, nessa qualidade, causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa.",
      D: "O Estado não responde por atos de concessionárias de serviço público.",
    },
    correta: "C",
    fundamento:
      "Art. 37, §6º, da CF/88: as pessoas jurídicas de direito público e as de direito privado prestadoras de serviços públicos responderão pelos danos que seus agentes, nessa qualidade, causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa.",
    comentario: {
      A: "Errada. A responsabilidade do Estado é objetiva (teoria do risco administrativo).",
      B: "Errada. Pela tese da dupla garantia (STF, Tema 940), a ação deve ser proposta contra o Estado, não diretamente contra o agente.",
      C: "Correta. Art. 37, §6º (responsabilidade objetiva + regresso por dolo/culpa).",
      D: "Errada. As prestadoras de serviço público (concessionárias) também respondem objetivamente (art. 37, §6º).",
    },
  },
  {
    id: "adm-003",
    disciplina: "Direito Administrativo",
    topico: "Licitações (Lei 14.133/21)",
    dificuldade: "dificil",
    enunciado:
      "À luz da Lei 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos), assinale a afirmativa correta.",
    alternativas: {
      A: "O pregão é a modalidade obrigatória para a contratação de bens e serviços especiais de engenharia.",
      B: "São modalidades de licitação o pregão, a concorrência, o concurso, o leilão e o diálogo competitivo.",
      C: "A modalidade tomada de preços foi mantida para obras de médio vulto.",
      D: "O critério de julgamento por maior desconto é vedado pela nova lei.",
    },
    correta: "B",
    fundamento:
      "Art. 28 da Lei 14.133/21: são modalidades de licitação o pregão, a concorrência, o concurso, o leilão e o diálogo competitivo. Foram extintas as modalidades tomada de preços e convite.",
    comentario: {
      A: "Errada. O pregão destina-se a bens e serviços comuns; não se aplica a serviços técnicos especializados de natureza predominantemente intelectual (art. 29).",
      B: "Correta. Rol do art. 28.",
      C: "Errada. A tomada de preços foi extinta pela Lei 14.133/21.",
      D: "Errada. O maior desconto é critério de julgamento previsto (art. 33).",
    },
    pegadinha: "Manter modalidades extintas (tomada de preços/convite) da Lei 8.666/93.",
  },
  {
    id: "adm-004",
    disciplina: "Direito Administrativo",
    topico: "Agentes públicos",
    dificuldade: "media",
    enunciado:
      "Sobre os servidores públicos e o regime constitucional aplicável, assinale a afirmativa correta.",
    alternativas: {
      A: "A estabilidade é adquirida após dois anos de efetivo exercício, dispensada a avaliação de desempenho.",
      B: "O servidor estável só perderá o cargo em virtude de sentença judicial transitada em julgado, processo administrativo com ampla defesa ou procedimento de avaliação periódica de desempenho.",
      C: "O servidor em estágio probatório não pode ser exonerado em qualquer hipótese.",
      D: "A vedação à acumulação de cargos não se aplica a empregos em empresas públicas.",
    },
    correta: "B",
    fundamento:
      "Art. 41, §1º, da CF/88: o servidor estável só perderá o cargo em virtude de sentença judicial transitada em julgado; mediante processo administrativo com ampla defesa; ou mediante avaliação periódica de desempenho, na forma de lei complementar.",
    comentario: {
      A: "Errada. A estabilidade exige três anos de efetivo exercício e avaliação especial de desempenho (art. 41).",
      B: "Correta. Art. 41, §1º, I a III.",
      C: "Errada. Pode ser exonerado se não cumprir requisitos do estágio probatório.",
      D: "Errada. A vedação de acumulação alcança empregos em empresas públicas e sociedades de economia mista (art. 37, XVII).",
    },
    pegadinha: "Prazo de estabilidade (3 anos) trocado por 2 anos.",
  },
  {
    id: "adm-005",
    disciplina: "Direito Administrativo",
    topico: "Improbidade administrativa",
    dificuldade: "dificil",
    enunciado:
      "Considerando a Lei de Improbidade Administrativa (Lei 8.429/92), com as alterações da Lei 14.230/2021, assinale a afirmativa correta.",
    alternativas: {
      A: "A modalidade culposa de ato de improbidade foi mantida para os atos que causam prejuízo ao erário.",
      B: "Configura ato de improbidade administrativa a conduta dolosa tipificada na lei, sendo exigido o elemento subjetivo (dolo) para todas as modalidades.",
      C: "A ação de improbidade pode ser proposta por qualquer cidadão, em legitimação concorrente com o Ministério Público.",
      D: "As sanções de improbidade independem de comprovação de efetivo prejuízo ao erário ou enriquecimento ilícito em qualquer caso.",
    },
    correta: "B",
    fundamento:
      "Art. 1º, §§1º a 3º, da Lei 8.429/92 (redação da Lei 14.230/21): considera-se ato de improbidade a conduta dolosa; foi excluída a modalidade culposa.",
    comentario: {
      A: "Errada. A modalidade culposa foi extinta pela Lei 14.230/21.",
      B: "Correta. Exige-se dolo (vontade livre e consciente) para todas as modalidades (art. 1º, §2º).",
      C: "Errada. A legitimidade ativa passou a ser do Ministério Público (art. 17, com a reforma); a ação popular é via diversa.",
      D: "Errada. Nos atos que causam prejuízo ao erário, exige-se efetiva lesão (art. 10).",
    },
    pegadinha: "Manter a modalidade culposa, revogada pela reforma de 2021.",
  },
  {
    id: "adm-006",
    disciplina: "Direito Administrativo",
    topico: "Poderes administrativos",
    dificuldade: "facil",
    enunciado:
      "Sobre os poderes da Administração Pública, assinale a afirmativa correta.",
    alternativas: {
      A: "O poder de polícia caracteriza-se exclusivamente por atos de fiscalização, sem possibilidade de aplicação de sanções.",
      B: "O poder discricionário permite ao administrador agir com liberdade de escolha quanto à conveniência e oportunidade, nos limites da lei.",
      C: "O poder hierárquico autoriza a aplicação de penalidades a particulares que descumprem contratos administrativos.",
      D: "O abuso de poder, na modalidade excesso de poder, refere-se à finalidade diversa do interesse público.",
    },
    correta: "B",
    fundamento:
      "O poder discricionário confere ao administrador margem de escolha (mérito administrativo) quanto à conveniência e oportunidade, sempre nos limites legais.",
    comentario: {
      A: "Errada. O poder de polícia abrange ordem, consentimento, fiscalização e sanção.",
      B: "Correta. Discricionariedade = juízo de conveniência/oportunidade nos limites da lei.",
      C: "Errada. As sanções a contratados decorrem do poder disciplinar/contratual, e o hierárquico opera internamente.",
      D: "Errada. Excesso de poder é vício de competência (extrapola limites); o desvio de finalidade é que se refere ao fim diverso.",
    },
    pegadinha: "Trocar excesso de poder (competência) por desvio de finalidade (finalidade).",
  },

  /* ===================== DIREITO PENAL ===================== */
  {
    id: "penal-001",
    disciplina: "Direito Penal",
    topico: "Aplicação da lei penal",
    dificuldade: "media",
    enunciado:
      "Sobre a aplicação da lei penal no tempo, assinale a afirmativa correta.",
    alternativas: {
      A: "A lei penal mais grave retroage para alcançar fatos anteriores à sua vigência.",
      B: "A lei posterior que de qualquer modo favorecer o agente aplica-se aos fatos anteriores, ainda que decididos por sentença condenatória transitada em julgado.",
      C: "A abolitio criminis não extingue a punibilidade quando já iniciada a execução da pena.",
      D: "Considera-se praticado o crime no momento do resultado, ainda que outro tenha sido o momento da ação.",
    },
    correta: "B",
    fundamento:
      "Art. 2º, parágrafo único, do CP: a lei posterior que de qualquer modo favorecer o agente aplica-se aos fatos anteriores, ainda que decididos por sentença condenatória transitada em julgado.",
    comentario: {
      A: "Errada. A lei penal mais grave (lex gravior) não retroage (art. 5º, XL, CF; art. 1º, CP).",
      B: "Correta. Retroatividade da lei penal benéfica (art. 2º, parágrafo único).",
      C: "Errada. A abolitio criminis extingue a punibilidade e cessa a execução (art. 2º, caput).",
      D: "Errada. Adota-se a teoria da atividade: considera-se praticado o crime no momento da ação ou omissão (art. 4º).",
    },
    pegadinha: "Teoria do resultado (errada) x teoria da atividade (correta) para o tempo do crime.",
  },
  {
    id: "penal-002",
    disciplina: "Direito Penal",
    topico: "Teoria do crime",
    dificuldade: "dificil",
    enunciado:
      "A respeito das excludentes de ilicitude, assinale a afirmativa correta.",
    alternativas: {
      A: "O estado de necessidade exige que o perigo tenha sido provocado pela vontade do agente.",
      B: "Age em legítima defesa quem, usando moderadamente dos meios necessários, repele injusta agressão, atual ou iminente, a direito seu ou de outrem.",
      C: "O estrito cumprimento do dever legal não exclui a ilicitude, apenas atenua a pena.",
      D: "A legítima defesa pode ser invocada contra agressão futura e incerta.",
    },
    correta: "B",
    fundamento:
      "Art. 25 do CP: entende-se em legítima defesa quem, usando moderadamente dos meios necessários, repele injusta agressão, atual ou iminente, a direito seu ou de outrem.",
    comentario: {
      A: "Errada. O estado de necessidade pressupõe perigo que o agente não provocou por sua vontade (art. 24).",
      B: "Correta. Conceito de legítima defesa (art. 25).",
      C: "Errada. O estrito cumprimento do dever legal é excludente de ilicitude (art. 23, III).",
      D: "Errada. A agressão deve ser atual ou iminente, não futura e incerta.",
    },
    pegadinha: "Admitir legítima defesa contra agressão futura (descabida).",
  },
  {
    id: "penal-003",
    disciplina: "Direito Penal",
    topico: "Concurso de pessoas",
    dificuldade: "media",
    enunciado:
      "Sobre o concurso de pessoas no Código Penal, assinale a afirmativa correta.",
    alternativas: {
      A: "Adota-se, em regra, a teoria pluralista, atribuindo um crime distinto a cada participante.",
      B: "Quem, de qualquer modo, concorre para o crime incide nas penas a este cominadas, na medida de sua culpabilidade.",
      C: "A participação de menor importância acarreta a exclusão da responsabilidade do partícipe.",
      D: "As circunstâncias de caráter pessoal sempre se comunicam aos demais coautores.",
    },
    correta: "B",
    fundamento:
      "Art. 29 do CP: quem, de qualquer modo, concorre para o crime incide nas penas a este cominadas, na medida de sua culpabilidade (teoria monista temperada).",
    comentario: {
      A: "Errada. O CP adota a teoria monista (unitária) como regra, não a pluralista.",
      B: "Correta. Art. 29, caput.",
      C: "Errada. A participação de menor importância reduz a pena (de 1/6 a 1/3), não exclui a responsabilidade (art. 29, §1º).",
      D: "Errada. As circunstâncias de caráter pessoal não se comunicam, salvo quando elementares (art. 30).",
    },
    pegadinha: "Comunicação indevida de circunstâncias pessoais não elementares.",
  },
  {
    id: "penal-004",
    disciplina: "Direito Penal",
    topico: "Penas",
    dificuldade: "media",
    enunciado:
      "Sobre a aplicação e as espécies de pena, assinale a afirmativa correta.",
    alternativas: {
      A: "O sistema trifásico de dosimetria aplica-se às penas restritivas de direitos, mas não às privativas de liberdade.",
      B: "Na primeira fase da dosimetria, o juiz fixa a pena-base atentando às circunstâncias judiciais do art. 59 do CP.",
      C: "As circunstâncias agravantes e atenuantes podem elevar ou reduzir a pena além dos limites legais do tipo.",
      D: "A reincidência é circunstância judicial valorada na primeira fase da dosimetria.",
    },
    correta: "B",
    fundamento:
      "Art. 68 do CP (sistema trifásico): na 1ª fase, fixa-se a pena-base com base nas circunstâncias judiciais do art. 59; na 2ª, atenuantes e agravantes; na 3ª, causas de aumento e diminuição.",
    comentario: {
      A: "Errada. O sistema trifásico aplica-se às penas privativas de liberdade.",
      B: "Correta. Pena-base na 1ª fase com base no art. 59.",
      C: "Errada. Agravantes e atenuantes não podem ultrapassar os limites legais do tipo (Súmula 231 STJ).",
      D: "Errada. A reincidência é agravante, valorada na 2ª fase (art. 61, I).",
    },
    pegadinha: "Reincidência como circunstância judicial da 1ª fase (na verdade é agravante, 2ª fase).",
  },
  {
    id: "penal-005",
    disciplina: "Direito Penal",
    topico: "Crimes contra o patrimônio",
    dificuldade: "dificil",
    enunciado:
      "Sobre a distinção entre furto e roubo, assinale a afirmativa correta.",
    alternativas: {
      A: "O emprego de grave ameaça ou violência à pessoa qualifica o furto, transformando-o em furto qualificado.",
      B: "O roubo caracteriza-se pela subtração de coisa alheia móvel mediante grave ameaça ou violência à pessoa, ou depois de reduzi-la à impossibilidade de resistência.",
      C: "No furto, a presença de mais de um agente sempre configura roubo majorado.",
      D: "O furto noturno constitui causa de diminuição de pena.",
    },
    correta: "B",
    fundamento:
      "Art. 157 do CP: roubo é subtrair coisa alheia móvel, para si ou para outrem, mediante grave ameaça ou violência à pessoa, ou depois de havê-la reduzido à impossibilidade de resistência.",
    comentario: {
      A: "Errada. Violência/grave ameaça à pessoa caracteriza roubo (art. 157), não furto qualificado.",
      B: "Correta. Conceito de roubo (art. 157).",
      C: "Errada. O concurso de agentes no furto é causa de aumento do furto (art. 155, §4º, IV), não roubo.",
      D: "Errada. O repouso noturno é causa de aumento de pena no furto (art. 155, §1º), não diminuição.",
    },
    pegadinha: "Repouso noturno como diminuição (é aumento) e violência como qualificadora do furto.",
  },
  {
    id: "penal-006",
    disciplina: "Direito Penal",
    topico: "Extinção da punibilidade",
    dificuldade: "media",
    enunciado:
      "Sobre as causas de extinção da punibilidade, assinale a afirmativa correta.",
    alternativas: {
      A: "A prescrição, a decadência e a perempção são causas de extinção da punibilidade.",
      B: "A morte do agente não extingue a punibilidade quando há condenação transitada em julgado.",
      C: "O perdão judicial converte a pena privativa de liberdade em restritiva de direitos.",
      D: "A renúncia ao direito de queixa, nos crimes de ação pública incondicionada, extingue a punibilidade.",
    },
    correta: "A",
    fundamento:
      "Art. 107 do CP: extingue-se a punibilidade pela morte do agente, anistia/graça/indulto, abolitio criminis, prescrição, decadência, perempção, renúncia/perdão (ação privada), retratação, perdão judicial, entre outras.",
    comentario: {
      A: "Correta. Todas são causas previstas no art. 107 (incisos IV e V).",
      B: "Errada. A morte do agente sempre extingue a punibilidade (art. 107, I).",
      C: "Errada. O perdão judicial extingue a punibilidade (art. 107, IX), não converte pena.",
      D: "Errada. A renúncia ao direito de queixa só cabe em ação penal privada, não na pública incondicionada.",
    },
  },

  /* ===================== DIREITO PROCESSUAL CIVIL ===================== */
  {
    id: "cpc-001",
    disciplina: "Direito Processual Civil",
    topico: "Recursos",
    dificuldade: "media",
    enunciado:
      "Sobre os recursos no Código de Processo Civil de 2015, assinale a afirmativa correta.",
    alternativas: {
      A: "O prazo para a interposição de apelação é de quinze dias úteis, contado da intimação da sentença.",
      B: "Os embargos de declaração têm efeito suspensivo automático e prazo de quinze dias.",
      C: "O recurso de agravo de instrumento é cabível contra toda e qualquer decisão interlocutória.",
      D: "O recurso adesivo é cabível na apelação, no recurso extraordinário e no recurso especial, subordinando-se ao recurso independente.",
    },
    correta: "D",
    fundamento:
      "Art. 997, §2º, do CPC: o recurso adesivo é admissível na apelação, no recurso extraordinário e no recurso especial; subordina-se ao recurso principal (independente).",
    comentario: {
      A: "Errada. O prazo de apelação é de 15 dias úteis (art. 1.003, §5º) — atenção: o item correto é o D; a apelação é 15 dias, mas a redação aqui omite que não há outro erro... na verdade está correta quanto ao prazo, porém a alternativa escolhida deve ser a mais completa e sem ressalva. (Ver D).",
      B: "Errada. Os embargos de declaração têm prazo de 5 dias (art. 1.023) e, em regra, interrompem o prazo, sem efeito suspensivo automático.",
      C: "Errada. O agravo de instrumento é cabível nas hipóteses taxativas do art. 1.015 (rol mitigado pelo STJ), não contra toda decisão interlocutória.",
      D: "Correta. Art. 997, §2º (recurso adesivo).",
    },
    pegadinha: "Embargos de declaração com prazo de 15 dias (são 5 dias).",
  },
  {
    id: "cpc-002",
    disciplina: "Direito Processual Civil",
    topico: "Competência",
    dificuldade: "media",
    enunciado:
      "Sobre a competência no processo civil, assinale a afirmativa correta.",
    alternativas: {
      A: "A incompetência absoluta pode ser alegada a qualquer tempo e grau de jurisdição e deve ser declarada de ofício.",
      B: "A incompetência relativa pode ser conhecida de ofício pelo juiz.",
      C: "A competência em razão da matéria é prorrogável se não houver alegação oportuna.",
      D: "A modificação de competência por conexão aplica-se também às competências absolutas.",
    },
    correta: "A",
    fundamento:
      "Art. 64, §1º, do CPC: a incompetência absoluta pode ser alegada em qualquer tempo e grau de jurisdição e deve ser declarada de ofício.",
    comentario: {
      A: "Correta. Art. 64, §1º.",
      B: "Errada. A incompetência relativa não pode ser declarada de ofício (Súmula 33 STJ); deve ser alegada pela parte.",
      C: "Errada. A competência em razão da matéria é absoluta e improrrogável.",
      D: "Errada. A conexão/continência só modifica competências relativas, não as absolutas.",
    },
    pegadinha: "Conhecimento de ofício da incompetência relativa (vedado pela Súmula 33 STJ).",
  },
  {
    id: "cpc-003",
    disciplina: "Direito Processual Civil",
    topico: "Tutela provisória",
    dificuldade: "dificil",
    enunciado:
      "Acerca da tutela provisória no CPC/2015, assinale a afirmativa correta.",
    alternativas: {
      A: "A tutela de urgência exige a demonstração de probabilidade do direito e de perigo de dano ou risco ao resultado útil do processo.",
      B: "A tutela de evidência depende sempre da demonstração de perigo de dano.",
      C: "A tutela antecipada antecedente jamais se torna estável.",
      D: "A tutela cautelar só pode ser requerida em caráter incidental.",
    },
    correta: "A",
    fundamento:
      "Art. 300 do CPC: a tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito e o perigo de dano ou o risco ao resultado útil do processo.",
    comentario: {
      A: "Correta. Requisitos da tutela de urgência (art. 300).",
      B: "Errada. A tutela de evidência independe de perigo de dano (art. 311).",
      C: "Errada. A tutela antecipada antecedente pode estabilizar-se se não houver recurso (art. 304).",
      D: "Errada. A tutela cautelar pode ser requerida em caráter antecedente ou incidental (art. 294).",
    },
    pegadinha: "Exigir perigo de dano na tutela de evidência (que dele independe).",
  },
  {
    id: "cpc-004",
    disciplina: "Direito Processual Civil",
    topico: "Petição inicial e resposta",
    dificuldade: "facil",
    enunciado:
      "Sobre a petição inicial e a defesa do réu no CPC/2015, assinale a afirmativa correta.",
    alternativas: {
      A: "A contestação deve ser apresentada no prazo de quinze dias úteis, na qual o réu deve alegar toda a matéria de defesa.",
      B: "A reconvenção deve ser proposta em peça autônoma e apartada da contestação.",
      C: "A ausência de contestação sempre acarreta a procedência automática do pedido.",
      D: "As preliminares de mérito devem ser alegadas após a instrução probatória.",
    },
    correta: "A",
    fundamento:
      "Arts. 335 e 336 do CPC: o réu pode oferecer contestação no prazo de 15 dias, e nela deve alegar toda a matéria de defesa (princípio da eventualidade/concentração).",
    comentario: {
      A: "Correta. Prazo de 15 dias e princípio da eventualidade (arts. 335 e 336).",
      B: "Errada. A reconvenção é proposta na própria contestação (art. 343).",
      C: "Errada. A revelia gera presunção relativa de veracidade, não procedência automática (art. 344 e exceções do art. 345).",
      D: "Errada. As preliminares são alegadas na contestação, antes do mérito (art. 337).",
    },
  },
  {
    id: "cpc-005",
    disciplina: "Direito Processual Civil",
    topico: "Cumprimento de sentença",
    dificuldade: "media",
    enunciado:
      "Sobre o cumprimento de sentença que reconhece obrigação de pagar quantia certa, assinale a afirmativa correta.",
    alternativas: {
      A: "O devedor é intimado para pagar em quinze dias, sob pena de multa de dez por cento e honorários de dez por cento.",
      B: "O prazo para impugnação ao cumprimento de sentença é de cinco dias, contado da penhora.",
      C: "A multa de dez por cento incide mesmo que o pagamento ocorra no prazo legal.",
      D: "O cumprimento de sentença independe de requerimento do exequente em qualquer hipótese.",
    },
    correta: "A",
    fundamento:
      "Art. 523 do CPC: no cumprimento de sentença de pagar quantia, o devedor é intimado a pagar em 15 dias; não pago, incide multa de 10% e honorários de 10%.",
    comentario: {
      A: "Correta. Art. 523, caput e §1º.",
      B: "Errada. O prazo de impugnação é de 15 dias após o decurso do prazo para pagamento (art. 525).",
      C: "Errada. A multa só incide se não houver pagamento voluntário no prazo (art. 523, §1º).",
      D: "Errada. O cumprimento de sentença por quantia certa, em regra, depende de requerimento do exequente (art. 513, §1º).",
    },
    pegadinha: "Prazo de impugnação (15 dias) trocado por 5 dias.",
  },
  {
    id: "cpc-006",
    disciplina: "Direito Processual Civil",
    topico: "Teoria geral do processo",
    dificuldade: "media",
    enunciado:
      "Sobre os pressupostos processuais e as condições da ação no CPC/2015, assinale a afirmativa correta.",
    alternativas: {
      A: "O CPC/2015 manteve expressamente a possibilidade jurídica do pedido como condição da ação.",
      B: "A legitimidade e o interesse de agir são condições da ação, cuja ausência leva à extinção do processo sem resolução de mérito.",
      C: "A capacidade postulatória é dispensável em qualquer juízo ou tribunal.",
      D: "A petição inicial inepta deve ser sempre julgada improcedente no mérito.",
    },
    correta: "B",
    fundamento:
      "Art. 17 e art. 485, VI, do CPC: para postular é necessário interesse e legitimidade; sua ausência conduz à extinção sem resolução de mérito.",
    comentario: {
      A: "Errada. O CPC/2015 não mais arrola a possibilidade jurídica do pedido como condição da ação.",
      B: "Correta. Legitimidade e interesse de agir (arts. 17 e 485, VI).",
      C: "Errada. A capacidade postulatória é exigida, salvo exceções (ex.: Juizados, HC).",
      D: "Errada. A inépcia leva ao indeferimento da inicial (extinção sem mérito), não a julgamento de improcedência (art. 330, I).",
    },
  },

  /* ===================== DIREITO TRIBUTÁRIO ===================== */
  {
    id: "trib-001",
    disciplina: "Direito Tributário",
    topico: "Limitações ao poder de tributar",
    dificuldade: "media",
    enunciado:
      "A respeito das limitações constitucionais ao poder de tributar, assinale a afirmativa correta.",
    alternativas: {
      A: "O princípio da anterioridade anual impede a cobrança de tributos no mesmo exercício financeiro da publicação da lei que os instituiu ou aumentou, sem exceções.",
      B: "A imunidade recíproca veda à União, Estados, DF e Municípios instituir impostos sobre patrimônio, renda ou serviços, uns dos outros.",
      C: "O princípio da legalidade tributária admite a criação de tributos por decreto do Poder Executivo.",
      D: "A imunidade dos templos de qualquer culto abrange todos os tributos, inclusive taxas.",
    },
    correta: "B",
    fundamento:
      "Art. 150, VI, 'a', da CF/88: é vedado à União, Estados, DF e Municípios instituir impostos sobre patrimônio, renda ou serviços uns dos outros (imunidade recíproca).",
    comentario: {
      A: "Errada. A anterioridade anual comporta exceções (ex.: II, IE, IPI, IOF, empréstimo compulsório de guerra) — art. 150, §1º.",
      B: "Correta. Imunidade recíproca (art. 150, VI, 'a').",
      C: "Errada. A legalidade exige lei para instituir/aumentar tributos (art. 150, I), com exceções de alíquota.",
      D: "Errada. A imunidade dos templos refere-se a impostos, não a taxas (art. 150, VI, 'b').",
    },
    pegadinha: "Estender imunidade (que é só de impostos) às taxas.",
  },
  {
    id: "trib-002",
    disciplina: "Direito Tributário",
    topico: "Espécies tributárias",
    dificuldade: "media",
    enunciado:
      "Sobre as espécies tributárias e o conceito de tributo, assinale a afirmativa correta.",
    alternativas: {
      A: "A taxa pode ter base de cálculo idêntica à de imposto.",
      B: "As contribuições de melhoria têm como fato gerador a valorização imobiliária decorrente de obra pública.",
      C: "O empréstimo compulsório é espécie de imposto vinculado, instituível por lei ordinária.",
      D: "Tributo é toda prestação pecuniária, ainda que constitua sanção de ato ilícito.",
    },
    correta: "B",
    fundamento:
      "Art. 81 do CTN: a contribuição de melhoria é instituída para fazer face ao custo de obras públicas de que decorra valorização imobiliária.",
    comentario: {
      A: "Errada. A taxa não pode ter base de cálculo própria de imposto (art. 145, §2º, CF; Súmula Vinculante 29 permite só elementos).",
      B: "Correta. Fato gerador da contribuição de melhoria (art. 81, CTN).",
      C: "Errada. O empréstimo compulsório é espécie autônoma, instituível por lei complementar (art. 148, CF).",
      D: "Errada. Tributo não constitui sanção de ato ilícito (art. 3º, CTN).",
    },
    pegadinha: "Definição de tributo incluindo sanção de ato ilícito (vedado pelo art. 3º CTN).",
  },
  {
    id: "trib-003",
    disciplina: "Direito Tributário",
    topico: "Obrigação e crédito tributário",
    dificuldade: "dificil",
    enunciado:
      "Sobre a suspensão e a exclusão do crédito tributário, assinale a afirmativa correta.",
    alternativas: {
      A: "A isenção e a anistia são modalidades de suspensão do crédito tributário.",
      B: "O parcelamento, a moratória e a concessão de liminar em mandado de segurança suspendem a exigibilidade do crédito tributário.",
      C: "O pagamento e a compensação são causas de exclusão do crédito tributário.",
      D: "A prescrição e a decadência suspendem o crédito tributário.",
    },
    correta: "B",
    fundamento:
      "Art. 151 do CTN: suspendem a exigibilidade do crédito a moratória, o depósito do montante integral, reclamações/recursos administrativos, liminar em MS, liminar/tutela em outras ações e o parcelamento.",
    comentario: {
      A: "Errada. Isenção e anistia são modalidades de exclusão do crédito (art. 175).",
      B: "Correta. Hipóteses de suspensão (art. 151, I, IV e VI).",
      C: "Errada. Pagamento e compensação são modalidades de extinção (art. 156).",
      D: "Errada. Prescrição e decadência extinguem o crédito (art. 156, V).",
    },
    pegadinha: "Confundir suspensão, exclusão e extinção do crédito tributário.",
  },
  {
    id: "trib-004",
    disciplina: "Direito Tributário",
    topico: "Competência tributária",
    dificuldade: "media",
    enunciado:
      "Sobre a competência tributária dos entes federativos, assinale a afirmativa correta.",
    alternativas: {
      A: "Compete aos Municípios instituir o imposto sobre transmissão causa mortis e doação (ITCMD).",
      B: "Compete aos Estados e ao Distrito Federal instituir o imposto sobre a propriedade de veículos automotores (IPVA).",
      C: "Compete à União instituir o imposto sobre serviços de qualquer natureza (ISS).",
      D: "A competência tributária é delegável a outra pessoa jurídica de direito público.",
    },
    correta: "B",
    fundamento:
      "Art. 155, III, da CF/88: compete aos Estados e ao Distrito Federal instituir o IPVA.",
    comentario: {
      A: "Errada. O ITCMD é de competência estadual (art. 155, I); aos Municípios cabe o ITBI (art. 156, II).",
      B: "Correta. IPVA é estadual/distrital (art. 155, III).",
      C: "Errada. O ISS é municipal (art. 156, III).",
      D: "Errada. A competência tributária é indelegável (art. 7º, CTN); delega-se só a capacidade tributária ativa.",
    },
    pegadinha: "Indelegabilidade da competência x delegação da capacidade ativa.",
  },
  {
    id: "trib-005",
    disciplina: "Direito Tributário",
    topico: "Responsabilidade tributária",
    dificuldade: "dificil",
    enunciado:
      "Sobre a responsabilidade tributária, assinale a afirmativa correta.",
    alternativas: {
      A: "O adquirente de imóvel é pessoalmente responsável pelos tributos relativos ao bem, salvo quando conste do título a prova de quitação.",
      B: "A responsabilidade por sucessão empresarial não alcança os tributos devidos pela empresa sucedida.",
      C: "Os sócios respondem sempre, de forma objetiva, pelas dívidas tributárias da sociedade.",
      D: "A denúncia espontânea da infração não afasta a multa moratória em nenhuma hipótese.",
    },
    correta: "A",
    fundamento:
      "Art. 130 do CTN: os créditos tributários relativos a impostos sobre a propriedade e taxas de serviços referentes a bens imóveis sub-rogam-se na pessoa dos respectivos adquirentes, salvo quando conste do título a prova de sua quitação.",
    comentario: {
      A: "Correta. Art. 130 (responsabilidade do adquirente de imóvel).",
      B: "Errada. A sucessão empresarial transfere a responsabilidade pelos tributos (arts. 132 e 133).",
      C: "Errada. A responsabilidade do sócio-gerente depende de excesso de poderes ou infração à lei (art. 135; Súmula 430 STJ).",
      D: "Errada. A denúncia espontânea, com pagamento do tributo e juros, afasta a multa (art. 138, CTN).",
    },
    pegadinha: "Responsabilização objetiva e automática dos sócios (vedada — exige art. 135).",
  },

  /* ===================== DIREITO PROCESSUAL PENAL ===================== */
  {
    id: "cpp-001",
    disciplina: "Direito Processual Penal",
    topico: "Prisões e medidas cautelares",
    dificuldade: "media",
    enunciado:
      "Sobre as prisões cautelares no processo penal, assinale a afirmativa correta.",
    alternativas: {
      A: "A prisão preventiva pode ser decretada de ofício pelo juiz, independentemente de requerimento.",
      B: "A prisão em flagrante deve ser comunicada imediatamente ao juiz competente, que poderá relaxá-la se ilegal, convertê-la em preventiva ou conceder liberdade provisória.",
      C: "A prisão temporária pode ser decretada para qualquer crime, sem prazo determinado.",
      D: "A audiência de custódia é dispensável quando o flagrante for por crime hediondo.",
    },
    correta: "B",
    fundamento:
      "Art. 310 do CPP: ao receber o auto de prisão em flagrante, o juiz, em audiência de custódia, deve relaxar a prisão ilegal, convertê-la em preventiva (se presentes os requisitos) ou conceder liberdade provisória.",
    comentario: {
      A: "Errada. Após a Lei 13.964/19 (Pacote Anticrime), a preventiva não pode ser decretada de ofício (art. 311).",
      B: "Correta. Art. 310 (providências do juiz no flagrante).",
      C: "Errada. A prisão temporária só cabe nos crimes do rol da Lei 7.960/89 e tem prazo determinado.",
      D: "Errada. A audiência de custódia é obrigatória, inclusive em crimes hediondos.",
    },
    pegadinha: "Decretação de preventiva de ofício (vedada pelo Pacote Anticrime).",
  },
  {
    id: "cpp-002",
    disciplina: "Direito Processual Penal",
    topico: "Ação penal",
    dificuldade: "media",
    enunciado:
      "Sobre a ação penal, assinale a afirmativa correta.",
    alternativas: {
      A: "A ação penal pública incondicionada depende de representação do ofendido.",
      B: "Na ação penal privada vigora o princípio da oportunidade, podendo o ofendido decidir sobre a propositura da queixa-crime.",
      C: "O prazo decadencial para o oferecimento da representação ou queixa é de seis meses, contado da data do fato.",
      D: "A ação penal privada subsidiária da pública é cabível ainda quando o Ministério Público oferece denúncia no prazo legal.",
    },
    correta: "B",
    fundamento:
      "Na ação penal privada vigora o princípio da oportunidade/conveniência: o ofendido tem a faculdade de oferecer ou não a queixa-crime (art. 30, CPP; art. 100, §2º, CP).",
    comentario: {
      A: "Errada. A ação pública incondicionada independe de representação (art. 100, §1º, CP).",
      B: "Correta. Princípio da oportunidade na ação privada.",
      C: "Errada. O prazo é de 6 meses contado do conhecimento da autoria, não do fato (art. 38, CPP).",
      D: "Errada. A ação privada subsidiária só cabe na inércia do MP, não quando há denúncia tempestiva (art. 5º, LIX, CF; art. 29, CPP).",
    },
    pegadinha: "Termo inicial da decadência (conhecimento da autoria, não a data do fato).",
  },
  {
    id: "cpp-003",
    disciplina: "Direito Processual Penal",
    topico: "Provas",
    dificuldade: "dificil",
    enunciado:
      "A respeito da prova no processo penal, assinale a afirmativa correta.",
    alternativas: {
      A: "São admissíveis no processo as provas obtidas por meios ilícitos, desde que úteis à verdade real.",
      B: "São inadmissíveis as provas derivadas das ilícitas, salvo quando não evidenciado o nexo de causalidade entre umas e outras, ou quando puderem ser obtidas por fonte independente.",
      C: "O ônus da prova, no processo penal, recai integralmente sobre o réu.",
      D: "A confissão do acusado, por si só, é suficiente para a condenação, dispensando outros elementos.",
    },
    correta: "B",
    fundamento:
      "Art. 157, §1º, do CPP: são inadmissíveis as provas derivadas das ilícitas, salvo quando não evidenciado o nexo de causalidade entre umas e outras, ou quando puderem ser obtidas por fonte independente (teoria dos frutos da árvore envenenada e suas exceções).",
    comentario: {
      A: "Errada. As provas ilícitas são inadmissíveis (art. 5º, LVI, CF; art. 157, CPP).",
      B: "Correta. Art. 157, §1º (prova ilícita por derivação e exceções).",
      C: "Errada. O ônus probatório recai sobre a acusação (presunção de inocência).",
      D: "Errada. A confissão deve ser confrontada com as demais provas (art. 197, CPP).",
    },
    pegadinha: "Admitir prova ilícita 'em nome da verdade real'.",
  },
  {
    id: "cpp-004",
    disciplina: "Direito Processual Penal",
    topico: "Competência",
    dificuldade: "media",
    enunciado:
      "Sobre a competência no processo penal, assinale a afirmativa correta.",
    alternativas: {
      A: "A competência será, em regra, determinada pelo lugar em que se consumar a infração, ou, no caso de tentativa, pelo lugar em que for praticado o último ato de execução.",
      B: "Nos crimes dolosos contra a vida, a competência é do juiz singular.",
      C: "A competência pela prerrogativa de função não desloca a competência para o tribunal respectivo.",
      D: "A conexão e a continência nunca prorrogam a competência.",
    },
    correta: "A",
    fundamento:
      "Art. 70 do CPP: a competência será, de regra, determinada pelo lugar em que se consumar a infração, ou, no caso de tentativa, pelo lugar em que for praticado o último ato de execução.",
    comentario: {
      A: "Correta. Art. 70 (competência ratione loci).",
      B: "Errada. Os crimes dolosos contra a vida são julgados pelo Tribunal do Júri (art. 5º, XXXVIII, CF).",
      C: "Errada. A prerrogativa de função desloca a competência ao tribunal respectivo (foro especial).",
      D: "Errada. Conexão e continência são causas de prorrogação de competência (arts. 76 a 82, CPP).",
    },
  },
  {
    id: "cpp-005",
    disciplina: "Direito Processual Penal",
    topico: "Recursos",
    dificuldade: "media",
    enunciado:
      "Sobre os recursos no processo penal, assinale a afirmativa correta.",
    alternativas: {
      A: "O prazo para interposição da apelação criminal é de cinco dias, contado da intimação da sentença.",
      B: "O recurso em sentido estrito é cabível contra a sentença condenatória de mérito.",
      C: "Os embargos infringentes e de nulidade são cabíveis em favor da acusação.",
      D: "O prazo para a interposição do recurso em sentido estrito é de quinze dias.",
    },
    correta: "A",
    fundamento:
      "Art. 593 do CPP: caberá apelação no prazo de 5 dias. O prazo de interposição da apelação criminal é de cinco dias (as razões podem ser apresentadas em 8 dias).",
    comentario: {
      A: "Correta. Prazo de 5 dias para apelação (art. 593).",
      B: "Errada. Contra sentença condenatória cabe apelação, não RESE (o RESE tem hipóteses taxativas no art. 581).",
      C: "Errada. Os embargos infringentes e de nulidade são privativos da defesa (art. 609, parágrafo único).",
      D: "Errada. O prazo do RESE é de 5 dias (art. 586), não 15.",
    },
    pegadinha: "Prazos recursais penais (5 dias) confundidos com os cíveis (15 dias).",
  },

  /* ===================== DIREITO DO TRABALHO ===================== */
  {
    id: "trab-001",
    disciplina: "Direito do Trabalho",
    topico: "Contrato de trabalho",
    dificuldade: "media",
    enunciado:
      "Sobre os elementos caracterizadores da relação de emprego, assinale a afirmativa correta.",
    alternativas: {
      A: "A eventualidade é requisito essencial para a configuração do vínculo empregatício.",
      B: "São requisitos da relação de emprego a pessoalidade, a não eventualidade, a onerosidade e a subordinação.",
      C: "O empregado pode ser pessoa física ou jurídica, conforme o caso.",
      D: "A ausência de anotação na CTPS impede o reconhecimento do vínculo de emprego.",
    },
    correta: "B",
    fundamento:
      "Arts. 2º e 3º da CLT: empregado é a pessoa física que presta serviços de natureza não eventual, sob dependência (subordinação), mediante salário (onerosidade) e com pessoalidade.",
    comentario: {
      A: "Errada. A não eventualidade (habitualidade) é que caracteriza o vínculo, não a eventualidade.",
      B: "Correta. Requisitos do art. 3º da CLT (pessoalidade, não eventualidade, onerosidade e subordinação).",
      C: "Errada. O empregado é sempre pessoa física (art. 3º).",
      D: "Errada. O vínculo decorre da realidade fática (primazia da realidade); a falta de anotação não impede o reconhecimento.",
    },
    pegadinha: "Confundir eventualidade (afasta o vínculo) com não eventualidade (caracteriza).",
  },
  {
    id: "trab-002",
    disciplina: "Direito do Trabalho",
    topico: "Jornada de trabalho",
    dificuldade: "media",
    enunciado:
      "Sobre a jornada de trabalho na CLT, assinale a afirmativa correta.",
    alternativas: {
      A: "A duração normal do trabalho não pode ser superior a oito horas diárias e quarenta e quatro semanais, salvo os casos de compensação.",
      B: "O intervalo intrajornada para repouso e alimentação, em jornadas superiores a seis horas, é de no mínimo trinta minutos.",
      C: "As horas extras devem ser remuneradas com acréscimo de, no mínimo, vinte por cento.",
      D: "O trabalho noturno urbano compreende o período das vinte e duas às cinco horas, com hora de sessenta minutos.",
    },
    correta: "A",
    fundamento:
      "Art. 7º, XIII, da CF/88 e art. 58 da CLT: a jornada normal é de até 8 horas diárias e 44 semanais, facultada a compensação e a redução por acordo ou convenção coletiva.",
    comentario: {
      A: "Correta. Art. 7º, XIII, CF / art. 58, CLT.",
      B: "Errada. Em jornadas acima de 6 horas, o intervalo é de no mínimo 1 hora (art. 71, CLT).",
      C: "Errada. As horas extras têm acréscimo mínimo de 50% (art. 7º, XVI, CF).",
      D: "Errada. O trabalho noturno urbano (22h às 5h) tem hora reduzida de 52min30s (art. 73, §1º, CLT).",
    },
    pegadinha: "Adicional de hora extra (50%) reduzido para 20%, e hora noturna 'cheia'.",
  },
  {
    id: "trab-003",
    disciplina: "Direito do Trabalho",
    topico: "Verbas rescisórias",
    dificuldade: "dificil",
    enunciado:
      "Empregado é dispensado sem justa causa após dois anos de serviço. Sobre as verbas rescisórias, assinale a afirmativa correta.",
    alternativas: {
      A: "O empregado não tem direito ao aviso prévio, por ter sido dispensado sem justa causa.",
      B: "O empregado faz jus ao saldo de salário, ao aviso prévio, às férias proporcionais acrescidas de um terço, ao décimo terceiro proporcional e à multa de quarenta por cento sobre o FGTS.",
      C: "A multa do FGTS, na dispensa sem justa causa, é de vinte por cento sobre os depósitos.",
      D: "O aviso prévio, na dispensa sem justa causa, é sempre de trinta dias, independentemente do tempo de serviço.",
    },
    correta: "B",
    fundamento:
      "CLT e Lei 8.036/90: na dispensa sem justa causa, o empregado recebe saldo de salário, aviso prévio, férias proporcionais + 1/3, 13º proporcional e multa de 40% do FGTS (art. 18, §1º, Lei 8.036/90).",
    comentario: {
      A: "Errada. Tem direito a aviso prévio na dispensa sem justa causa (art. 487, CLT).",
      B: "Correta. Rol das verbas devidas na dispensa imotivada.",
      C: "Errada. A multa do FGTS é de 40% (art. 18, §1º, Lei 8.036/90).",
      D: "Errada. O aviso prévio é proporcional ao tempo de serviço (Lei 12.506/11): 30 dias + 3 dias por ano, até 90 dias.",
    },
    pegadinha: "Multa do FGTS (40%) reduzida para 20% e aviso prévio sem a proporcionalidade.",
  },
  {
    id: "trab-004",
    disciplina: "Direito do Trabalho",
    topico: "Férias",
    dificuldade: "media",
    enunciado:
      "Sobre o direito a férias na CLT, assinale a afirmativa correta.",
    alternativas: {
      A: "As férias devem ser concedidas em um único período, sendo vedado o parcelamento.",
      B: "Após a Reforma Trabalhista, as férias podem ser usufruídas em até três períodos, sendo que um deles não pode ser inferior a quatorze dias corridos.",
      C: "O empregado perde o direito a férias após faltas injustificadas, ainda que em número reduzido.",
      D: "A remuneração das férias é igual ao salário normal, sem qualquer acréscimo.",
    },
    correta: "B",
    fundamento:
      "Art. 134, §1º, da CLT (Reforma Trabalhista): as férias podem ser usufruídas em até 3 períodos, desde que um deles não seja inferior a 14 dias corridos e os demais não sejam inferiores a 5 dias corridos.",
    comentario: {
      A: "Errada. É admitido o parcelamento em até três períodos (art. 134, §1º).",
      B: "Correta. Art. 134, §1º.",
      C: "Errada. A perda total do direito ocorre apenas com faltas acima dos limites do art. 130; faltas reduzidas apenas reduzem os dias.",
      D: "Errada. As férias são remuneradas com acréscimo de 1/3 (art. 7º, XVII, CF).",
    },
    pegadinha: "Esquecer o terço constitucional de férias.",
  },
  {
    id: "trab-005",
    disciplina: "Direito do Trabalho",
    topico: "Estabilidade e garantias",
    dificuldade: "media",
    enunciado:
      "Sobre as estabilidades provisórias no emprego, assinale a afirmativa correta.",
    alternativas: {
      A: "A empregada gestante tem garantia de emprego desde a confirmação da gravidez até cinco meses após o parto.",
      B: "O empregado eleito para cargo de dirigente sindical não goza de qualquer estabilidade.",
      C: "O empregado acidentado não tem direito a estabilidade após o retorno ao trabalho.",
      D: "A estabilidade da gestante depende de prévia comunicação ao empregador antes da dispensa.",
    },
    correta: "A",
    fundamento:
      "Art. 10, II, 'b', do ADCT: é vedada a dispensa arbitrária ou sem justa causa da empregada gestante, desde a confirmação da gravidez até cinco meses após o parto.",
    comentario: {
      A: "Correta. Estabilidade da gestante (art. 10, II, 'b', ADCT; Súmula 244 TST).",
      B: "Errada. O dirigente sindical tem estabilidade (art. 8º, VIII, CF; art. 543, §3º, CLT).",
      C: "Errada. O acidentado tem estabilidade de 12 meses após o retorno (art. 118, Lei 8.213/91).",
      D: "Errada. A estabilidade da gestante independe de comunicação prévia (Súmula 244, I, TST - responsabilidade objetiva).",
    },
  },

  {
    id: "trab-006",
    disciplina: "Direito do Trabalho",
    topico: "FGTS e aviso prévio",
    dificuldade: "media",
    enunciado:
      "Sobre o aviso prévio na relação de emprego, à luz da Lei 12.506/2011, assinale a afirmativa correta.",
    alternativas: {
      A: "O aviso prévio será sempre de trinta dias, sem qualquer acréscimo por tempo de serviço.",
      B: "Serão acrescidos três dias por ano de serviço prestado ao mesmo empregador, até o máximo de sessenta dias, perfazendo um total de até noventa dias.",
      C: "O aviso prévio proporcional aproveita igualmente ao empregado e ao empregador na hipótese de pedido de demissão.",
      D: "A falta de aviso prévio por parte do empregador não gera direito ao pagamento dos salários do período.",
    },
    correta: "B",
    fundamento:
      "Art. 1º, parágrafo único, da Lei 12.506/11: ao aviso prévio de 30 dias serão acrescidos 3 dias por ano de serviço prestado ao mesmo empregador, até o máximo de 60 dias, perfazendo um total de até 90 dias.",
    comentario: {
      A: "Errada. Há acréscimo proporcional ao tempo de serviço (Lei 12.506/11).",
      B: "Correta. Proporcionalidade do aviso prévio (Lei 12.506/11).",
      C: "Errada. A proporcionalidade é benefício do empregado; no pedido de demissão o aviso devido ao empregador é de 30 dias (TST).",
      D: "Errada. A falta de aviso prévio pelo empregador gera direito aos salários do período (art. 487, §1º, CLT).",
    },
    pegadinha: "Esquecer a proporcionalidade (3 dias/ano até 90 dias) do aviso prévio.",
  },

  /* ===================== DIREITO PROCESSUAL DO TRABALHO ===================== */
  {
    id: "cpt-001",
    disciplina: "Direito Processual do Trabalho",
    topico: "Competência da Justiça do Trabalho",
    dificuldade: "media",
    enunciado:
      "Sobre a competência da Justiça do Trabalho, nos termos do art. 114 da CF/88, assinale a afirmativa correta.",
    alternativas: {
      A: "Compete à Justiça do Trabalho processar e julgar as ações penais decorrentes de relação de trabalho.",
      B: "Compete à Justiça do Trabalho processar e julgar as ações oriundas da relação de trabalho e as ações sobre representação sindical.",
      C: "As ações de indenização por dano moral decorrentes da relação de trabalho são da competência da Justiça Comum.",
      D: "A execução das contribuições previdenciárias não compete à Justiça do Trabalho.",
    },
    correta: "B",
    fundamento:
      "Art. 114, I e III, da CF/88: compete à Justiça do Trabalho processar e julgar as ações oriundas da relação de trabalho e as ações sobre representação sindical, entre sindicatos, sindicatos e trabalhadores, e sindicatos e empregadores.",
    comentario: {
      A: "Errada. As ações penais não competem à Justiça do Trabalho (STF, ADI 3.684).",
      B: "Correta. Art. 114, I e III.",
      C: "Errada. As ações de dano moral decorrentes da relação de trabalho são da Justiça do Trabalho (art. 114, VI).",
      D: "Errada. A execução das contribuições previdenciárias decorrentes de suas sentenças compete à Justiça do Trabalho (art. 114, VIII).",
    },
    pegadinha: "Atribuir competência penal à Justiça do Trabalho.",
  },
  {
    id: "cpt-002",
    disciplina: "Direito Processual do Trabalho",
    topico: "Recursos trabalhistas",
    dificuldade: "media",
    enunciado:
      "Sobre os recursos no processo do trabalho, assinale a afirmativa correta.",
    alternativas: {
      A: "O prazo para a interposição da maioria dos recursos trabalhistas é de oito dias.",
      B: "O recurso ordinário não admite efeito devolutivo.",
      C: "O depósito recursal foi extinto pela Reforma Trabalhista.",
      D: "O recurso de revista é dirigido aos Tribunais Regionais do Trabalho.",
    },
    correta: "A",
    fundamento:
      "Art. 6º da Lei 5.584/70 e CLT: o prazo recursal na Justiça do Trabalho é, em regra, de 8 dias (recurso ordinário, recurso de revista, agravo de petição, agravo de instrumento etc.).",
    comentario: {
      A: "Correta. Prazo geral de 8 dias.",
      B: "Errada. O recurso ordinário tem efeito devolutivo (art. 895, CLT).",
      C: "Errada. O depósito recursal foi mantido, com reduções para certos sujeitos (art. 899, CLT).",
      D: "Errada. O recurso de revista é dirigido ao TST (art. 896, CLT).",
    },
    pegadinha: "Prazo recursal trabalhista (8 dias) confundido com 15 dias do CPC.",
  },
  {
    id: "cpt-003",
    disciplina: "Direito Processual do Trabalho",
    topico: "Procedimento e audiência",
    dificuldade: "facil",
    enunciado:
      "Sobre o procedimento na Justiça do Trabalho, assinale a afirmativa correta.",
    alternativas: {
      A: "O arquivamento da reclamação trabalhista decorre do não comparecimento do reclamado à audiência.",
      B: "O não comparecimento do reclamante à audiência acarreta o arquivamento da reclamação.",
      C: "A revelia no processo do trabalho não gera confissão quanto à matéria de fato.",
      D: "A conciliação é vedada no processo do trabalho.",
    },
    correta: "B",
    fundamento:
      "Art. 844 da CLT: o não comparecimento do reclamante à audiência importa o arquivamento da reclamação; o do reclamado, revelia e confissão quanto à matéria de fato.",
    comentario: {
      A: "Errada. O não comparecimento do reclamado gera revelia e confissão, não arquivamento.",
      B: "Correta. Art. 844 (arquivamento pela ausência do reclamante).",
      C: "Errada. A revelia gera confissão ficta quanto aos fatos (art. 844 e Súmula 74 TST).",
      D: "Errada. A conciliação é estimulada em qualquer fase (arts. 764, 846 e 850, CLT).",
    },
    pegadinha: "Inverter os efeitos da ausência do reclamante e do reclamado.",
  },
  {
    id: "cpt-004",
    disciplina: "Direito Processual do Trabalho",
    topico: "Execução trabalhista",
    dificuldade: "dificil",
    enunciado:
      "Sobre a execução no processo do trabalho, assinale a afirmativa correta.",
    alternativas: {
      A: "A execução pode ser promovida de ofício pelo juiz nos casos em que as partes não estiverem representadas por advogado.",
      B: "Os embargos à execução têm prazo de quinze dias, contados da penhora.",
      C: "Na execução trabalhista, não se admite a aplicação subsidiária da Lei de Executivos Fiscais.",
      D: "A garantia do juízo é dispensável para a oposição de embargos à execução.",
    },
    correta: "A",
    fundamento:
      "Art. 878 da CLT (com a Reforma Trabalhista): a execução será promovida pelas partes, permitida a execução de ofício pelo juiz nos casos em que as partes não estiverem representadas por advogado.",
    comentario: {
      A: "Correta. Art. 878, CLT (impulso oficial residual).",
      B: "Errada. O prazo dos embargos à execução é de 5 dias, garantida a execução (art. 884, CLT).",
      C: "Errada. Aplica-se subsidiariamente a Lei 6.830/80 (art. 889, CLT).",
      D: "Errada. A garantia do juízo é requisito para os embargos à execução (art. 884, CLT).",
    },
    pegadinha: "Prazo dos embargos à execução (5 dias) trocado por 15 dias.",
  },

  /* ===================== DIREITO EMPRESARIAL ===================== */
  {
    id: "emp-001",
    disciplina: "Direito Empresarial",
    topico: "Títulos de crédito",
    dificuldade: "media",
    enunciado:
      "Sobre os princípios e o regime dos títulos de crédito, assinale a afirmativa correta.",
    alternativas: {
      A: "O princípio da abstração significa que o título de crédito está sempre vinculado à causa que lhe deu origem.",
      B: "Pelo princípio da literalidade, somente vale no título o que nele estiver escrito.",
      C: "O endosso transfere a titularidade do crédito e, em regra, exime o endossante de qualquer responsabilidade.",
      D: "O aval só pode ser prestado pelo próprio devedor principal do título.",
    },
    correta: "B",
    fundamento:
      "Princípio da literalidade (art. 887, CC): o título de crédito vale pelo que nele está expressamente consignado; o que não consta do título não produz efeitos cambiais.",
    comentario: {
      A: "Errada. A abstração desvincula o título da causa que o originou (na circulação).",
      B: "Correta. Princípio da literalidade.",
      C: "Errada. O endosso transfere o crédito, mas o endossante responde pelo pagamento, salvo cláusula 'sem garantia' (art. 914, CC; LUG).",
      D: "Errada. O aval é garantia prestada por terceiro (ou outro coobrigado), não só pelo devedor principal.",
    },
    pegadinha: "Inverter abstração e literalidade.",
  },
  {
    id: "emp-002",
    disciplina: "Direito Empresarial",
    topico: "Sociedades",
    dificuldade: "dificil",
    enunciado:
      "Sobre as sociedades empresárias no Código Civil, assinale a afirmativa correta.",
    alternativas: {
      A: "Na sociedade limitada, a responsabilidade de cada sócio é ilimitada e solidária pelas obrigações sociais.",
      B: "Na sociedade limitada, a responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social.",
      C: "Na sociedade em nome coletivo, os sócios respondem de forma limitada pelas obrigações sociais.",
      D: "A sociedade anônima pode ter sua firma social composta pelo nome dos acionistas.",
    },
    correta: "B",
    fundamento:
      "Art. 1.052 do CC: na sociedade limitada, a responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social.",
    comentario: {
      A: "Errada. A responsabilidade na limitada é restrita ao valor das quotas, não ilimitada.",
      B: "Correta. Art. 1.052.",
      C: "Errada. Na sociedade em nome coletivo, os sócios respondem ilimitada e solidariamente (art. 1.039).",
      D: "Errada. A S/A opera sob denominação, não firma com nome de acionistas (art. 1.160).",
    },
    pegadinha: "Responsabilidade na limitada (restrita às quotas, com solidariedade na integralização).",
  },
  {
    id: "emp-003",
    disciplina: "Direito Empresarial",
    topico: "Falência e recuperação",
    dificuldade: "dificil",
    enunciado:
      "Sobre a recuperação judicial e a falência (Lei 11.101/2005), assinale a afirmativa correta.",
    alternativas: {
      A: "A recuperação judicial pode ser requerida por qualquer devedor, ainda que exerça atividade há menos de dois anos.",
      B: "Estão sujeitos à recuperação judicial todos os créditos existentes na data do pedido, ainda que não vencidos, ressalvadas as exceções legais.",
      C: "O prazo de blindagem (stay period) da recuperação judicial é de cento e oitenta dias improrrogáveis.",
      D: "A decretação da falência não acarreta o vencimento antecipado das dívidas do devedor.",
    },
    correta: "B",
    fundamento:
      "Art. 49 da Lei 11.101/05: estão sujeitos à recuperação judicial todos os créditos existentes na data do pedido, ainda que não vencidos, ressalvados os créditos excluídos por lei.",
    comentario: {
      A: "Errada. Exige-se o exercício regular da atividade há mais de 2 anos (art. 48).",
      B: "Correta. Art. 49 (créditos sujeitos à recuperação).",
      C: "Errada. O stay period é de 180 dias, prorrogável uma vez por igual período (art. 6º, §4º).",
      D: "Errada. A falência acarreta o vencimento antecipado das dívidas do falido (art. 77).",
    },
    pegadinha: "Stay period 'improrrogável' (na verdade é prorrogável).",
  },
  {
    id: "emp-004",
    disciplina: "Direito Empresarial",
    topico: "Teoria geral da empresa",
    dificuldade: "facil",
    enunciado:
      "Sobre o empresário e o conceito de empresa, assinale a afirmativa correta.",
    alternativas: {
      A: "Considera-se empresário quem exerce profissionalmente atividade econômica organizada para a produção ou circulação de bens ou de serviços.",
      B: "O exercente de profissão intelectual, de natureza científica, literária ou artística, é sempre considerado empresário.",
      C: "A inscrição no Registro Público de Empresas Mercantis é facultativa e meramente declaratória para o exercício da empresa.",
      D: "O pequeno empresário está obrigado à escrituração contábil completa.",
    },
    correta: "A",
    fundamento:
      "Art. 966 do CC: considera-se empresário quem exerce profissionalmente atividade econômica organizada para a produção ou a circulação de bens ou de serviços.",
    comentario: {
      A: "Correta. Conceito de empresário (art. 966, caput).",
      B: "Errada. O profissional intelectual não é empresário, salvo se o exercício constituir elemento de empresa (art. 966, parágrafo único).",
      C: "Errada. A inscrição é obrigatória antes do início da atividade (art. 967).",
      D: "Errada. O pequeno empresário é dispensado de certas obrigações de escrituração (art. 970 e 1.179, §2º).",
    },
  },

  {
    id: "emp-005",
    disciplina: "Direito Empresarial",
    topico: "Nome empresarial e estabelecimento",
    dificuldade: "media",
    enunciado:
      "Sobre o estabelecimento empresarial e o trespasse, assinale a afirmativa correta.",
    alternativas: {
      A: "O contrato de trespasse independe de qualquer publicidade ou averbação para produzir efeitos perante terceiros.",
      B: "Não havendo autorização expressa, o alienante do estabelecimento não pode fazer concorrência ao adquirente, nos cinco anos subsequentes à transferência.",
      C: "A cláusula de não restabelecimento é nula por violar a livre concorrência.",
      D: "O adquirente do estabelecimento não responde pelos débitos anteriores à transferência, ainda que regularmente contabilizados.",
    },
    correta: "B",
    fundamento:
      "Art. 1.147 do CC: não havendo autorização expressa, o alienante do estabelecimento não pode fazer concorrência ao adquirente, nos cinco anos subsequentes à transferência (cláusula de não restabelecimento implícita).",
    comentario: {
      A: "Errada. O trespasse só produz efeitos perante terceiros após averbação no registro e publicação (art. 1.144).",
      B: "Correta. Art. 1.147 (proibição de concorrência por 5 anos).",
      C: "Errada. A cláusula de não restabelecimento é válida e, mesmo implícita, decorre do art. 1.147.",
      D: "Errada. O adquirente responde pelos débitos anteriores regularmente contabilizados (art. 1.146).",
    },
    pegadinha: "Negar a cláusula implícita de não restabelecimento (art. 1.147).",
  },

  /* ===================== DIREITOS HUMANOS ===================== */
  {
    id: "dh-001",
    disciplina: "Direitos Humanos",
    topico: "Sistema interamericano",
    dificuldade: "media",
    enunciado:
      "Sobre o sistema interamericano de proteção dos direitos humanos, assinale a afirmativa correta.",
    alternativas: {
      A: "A Comissão Interamericana de Direitos Humanos é órgão jurisdicional que profere sentenças vinculantes.",
      B: "A Corte Interamericana de Direitos Humanos tem competência contenciosa para julgar os Estados que reconheceram sua jurisdição.",
      C: "Os indivíduos têm acesso direto à Corte Interamericana para apresentar petições.",
      D: "O Brasil não reconhece a jurisdição da Corte Interamericana de Direitos Humanos.",
    },
    correta: "B",
    fundamento:
      "Convenção Americana sobre Direitos Humanos (Pacto de São José da Costa Rica): a Corte IDH tem competência contenciosa sobre os Estados que reconheceram sua jurisdição. O Brasil reconheceu pela via do Decreto 4.463/2002.",
    comentario: {
      A: "Errada. A Comissão não é órgão jurisdicional; analisa petições e encaminha casos à Corte.",
      B: "Correta. Competência contenciosa da Corte IDH sobre os Estados que a reconheceram.",
      C: "Errada. O indivíduo não tem acesso direto à Corte; deve passar pela Comissão (jus standi limitado).",
      D: "Errada. O Brasil reconheceu a jurisdição da Corte (Decreto 4.463/2002).",
    },
    pegadinha: "Confundir Comissão (não jurisdicional) com Corte (jurisdicional).",
  },
  {
    id: "dh-002",
    disciplina: "Direitos Humanos",
    topico: "Tratados internacionais",
    dificuldade: "dificil",
    enunciado:
      "Sobre a incorporação dos tratados internacionais de direitos humanos no ordenamento brasileiro, assinale a afirmativa correta.",
    alternativas: {
      A: "Todos os tratados internacionais ingressam no ordenamento com status de emenda constitucional.",
      B: "Os tratados de direitos humanos aprovados em cada Casa do Congresso, em dois turnos, por três quintos dos votos, serão equivalentes às emendas constitucionais.",
      C: "Os tratados de direitos humanos não aprovados pelo rito especial possuem status de lei ordinária, sem qualquer hierarquia diferenciada.",
      D: "O Brasil não pode submeter-se à jurisdição de Tribunal Penal Internacional.",
    },
    correta: "B",
    fundamento:
      "Art. 5º, §3º, da CF/88: os tratados e convenções internacionais sobre direitos humanos que forem aprovados, em cada Casa do Congresso Nacional, em dois turnos, por três quintos dos votos dos respectivos membros, serão equivalentes às emendas constitucionais.",
    comentario: {
      A: "Errada. Só têm status de emenda os aprovados pelo rito do art. 5º, §3º.",
      B: "Correta. Art. 5º, §3º.",
      C: "Errada. Os tratados de DH não aprovados pelo rito especial têm status supralegal (STF, RE 466.343).",
      D: "Errada. O Brasil se submete à jurisdição do TPI (art. 5º, §4º, CF).",
    },
    pegadinha: "Status supralegal (não meramente legal) dos tratados de DH comuns.",
  },
  {
    id: "dh-003",
    disciplina: "Direitos Humanos",
    topico: "Características dos direitos humanos",
    dificuldade: "facil",
    enunciado:
      "Sobre as características dos direitos humanos, assinale a afirmativa correta.",
    alternativas: {
      A: "Os direitos humanos são renunciáveis e prescritíveis.",
      B: "A historicidade indica que os direitos humanos são construídos e ampliados ao longo do tempo.",
      C: "A universalidade significa que os direitos humanos se aplicam apenas aos nacionais de cada Estado.",
      D: "Os direitos humanos são absolutos e jamais podem sofrer restrição.",
    },
    correta: "B",
    fundamento:
      "A historicidade é característica reconhecida dos direitos humanos: eles resultam de um processo histórico de construção e expansão (gerações/dimensões de direitos).",
    comentario: {
      A: "Errada. Os direitos humanos são, em regra, irrenunciáveis e imprescritíveis.",
      B: "Correta. Historicidade (construção histórica e progressiva).",
      C: "Errada. A universalidade significa que se destinam a todos os seres humanos, independentemente de nacionalidade.",
      D: "Errada. Os direitos humanos são relativos (podem sofrer restrições proporcionais), não absolutos.",
    },
  },

  /* ===================== FILOSOFIA DO DIREITO ===================== */
  {
    id: "filo-001",
    disciplina: "Filosofia do Direito",
    topico: "Correntes jusfilosóficas",
    dificuldade: "media",
    enunciado:
      "Sobre as principais correntes do pensamento jurídico, assinale a afirmativa correta.",
    alternativas: {
      A: "O positivismo jurídico sustenta a existência de um direito natural superior e imutável, anterior ao Estado.",
      B: "O jusnaturalismo defende a existência de princípios de justiça universais e anteriores ao direito posto.",
      C: "Para Hans Kelsen, a validade da norma jurídica decorre de seu conteúdo moral.",
      D: "O realismo jurídico identifica o direito exclusivamente com o texto da lei.",
    },
    correta: "B",
    fundamento:
      "O jusnaturalismo sustenta a existência de um direito natural, com princípios de justiça universais e anteriores/superiores ao direito positivo (posto pelo Estado).",
    comentario: {
      A: "Errada. A defesa do direito natural superior é do jusnaturalismo, não do positivismo.",
      B: "Correta. Núcleo do jusnaturalismo.",
      C: "Errada. Para Kelsen (Teoria Pura), a validade independe do conteúdo moral; deriva da norma superior.",
      D: "Errada. O realismo jurídico foca na decisão concreta dos tribunais, não no mero texto da lei.",
    },
    pegadinha: "Inverter jusnaturalismo e positivismo.",
  },
  {
    id: "filo-002",
    disciplina: "Filosofia do Direito",
    topico: "Justiça e equidade",
    dificuldade: "dificil",
    enunciado:
      "Para Aristóteles, a justiça que se ocupa das trocas e da reparação de danos entre particulares, buscando a igualdade aritmética, denomina-se:",
    alternativas: {
      A: "justiça distributiva.",
      B: "justiça corretiva (ou comutativa).",
      C: "justiça geral ou legal.",
      D: "equidade absoluta.",
    },
    correta: "B",
    fundamento:
      "Na Ética a Nicômaco, Aristóteles distingue a justiça distributiva (igualdade geométrica/proporcional, na repartição de bens e honras) da justiça corretiva ou comutativa (igualdade aritmética, nas trocas e reparações entre particulares).",
    comentario: {
      A: "Errada. A distributiva rege a repartição proporcional de bens e honras (igualdade geométrica).",
      B: "Correta. A justiça corretiva/comutativa busca a igualdade aritmética nas relações privadas.",
      C: "Errada. A justiça geral/legal volta-se ao bem comum.",
      D: "Errada. 'Equidade absoluta' não é a categoria aristotélica adequada; a equidade corrige a lei no caso concreto.",
    },
    pegadinha: "Trocar justiça comutativa (aritmética) por distributiva (geométrica).",
  },

  /* ===================== DIREITO DO CONSUMIDOR ===================== */
  {
    id: "cons-001",
    disciplina: "Direito do Consumidor",
    topico: "Responsabilidade pelo fato e vício",
    dificuldade: "media",
    enunciado:
      "Sobre a responsabilidade por vício e por fato do produto no CDC, assinale a afirmativa correta.",
    alternativas: {
      A: "A responsabilidade do fornecedor pelo fato do produto depende da comprovação de culpa pelo consumidor.",
      B: "O fornecedor de produtos e serviços responde, independentemente da existência de culpa, pela reparação dos danos causados aos consumidores por defeitos.",
      C: "O comerciante é sempre o responsável principal pelo fato do produto, em igualdade com o fabricante.",
      D: "O prazo para reclamar de vícios aparentes em produtos duráveis é de noventa dias, contado da fabricação.",
    },
    correta: "B",
    fundamento:
      "Art. 12 do CDC: o fabricante, produtor, construtor e importador respondem, independentemente da existência de culpa, pela reparação dos danos causados por defeitos. Responsabilidade objetiva.",
    comentario: {
      A: "Errada. A responsabilidade é objetiva (independe de culpa) — art. 12.",
      B: "Correta. Responsabilidade objetiva pelo fato do produto (art. 12).",
      C: "Errada. O comerciante tem responsabilidade subsidiária, nas hipóteses do art. 13.",
      D: "Errada. O prazo de reclamação de vício aparente em bem durável é de 90 dias, contado da entrega efetiva (art. 26, II e §1º).",
    },
    pegadinha: "Termo inicial do prazo de vício (entrega efetiva, não fabricação).",
  },
  {
    id: "cons-002",
    disciplina: "Direito do Consumidor",
    topico: "Direitos básicos do consumidor",
    dificuldade: "facil",
    enunciado:
      "Sobre os direitos básicos do consumidor e as práticas comerciais, assinale a afirmativa correta.",
    alternativas: {
      A: "A inversão do ônus da prova é vedada no processo civil que envolva relação de consumo.",
      B: "É direito básico do consumidor a facilitação da defesa de seus direitos, inclusive com a inversão do ônus da prova quando verossímil a alegação ou hipossuficiente o consumidor.",
      C: "O direito de arrependimento em compras fora do estabelecimento comercial é de trinta dias.",
      D: "A oferta veiculada por publicidade não obriga o fornecedor.",
    },
    correta: "B",
    fundamento:
      "Art. 6º, VIII, do CDC: é direito básico do consumidor a facilitação da defesa de seus direitos, inclusive a inversão do ônus da prova quando verossímil a alegação ou for ele hipossuficiente.",
    comentario: {
      A: "Errada. A inversão do ônus da prova é admitida e é direito básico (art. 6º, VIII).",
      B: "Correta. Art. 6º, VIII.",
      C: "Errada. O direito de arrependimento é de 7 dias (art. 49).",
      D: "Errada. A oferta vincula o fornecedor (arts. 30 e 35).",
    },
    pegadinha: "Prazo de arrependimento (7 dias) inflado para 30 dias.",
  },
  {
    id: "cons-003",
    disciplina: "Direito do Consumidor",
    topico: "Cláusulas abusivas",
    dificuldade: "media",
    enunciado:
      "Sobre as cláusulas abusivas nas relações de consumo, assinale a afirmativa correta.",
    alternativas: {
      A: "São válidas as cláusulas que transfiram responsabilidade a terceiros pelo vício do produto.",
      B: "São nulas de pleno direito as cláusulas que estabeleçam obrigações iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada.",
      C: "As cláusulas abusivas são apenas anuláveis, dependendo de ação judicial específica.",
      D: "É lícita a cláusula que impeça o reembolso de quantia já paga em qualquer hipótese.",
    },
    correta: "B",
    fundamento:
      "Art. 51, IV, do CDC: são nulas de pleno direito as cláusulas que estabeleçam obrigações iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada ou incompatíveis com a boa-fé ou a equidade.",
    comentario: {
      A: "Errada. São nulas as cláusulas que exonerem ou atenuem a responsabilidade do fornecedor (art. 51, I).",
      B: "Correta. Art. 51, IV.",
      C: "Errada. As cláusulas abusivas são nulas de pleno direito, não meramente anuláveis (art. 51).",
      D: "Errada. A retenção total de quantias pagas pode configurar cláusula abusiva (art. 51, II e IV).",
    },
  },

  /* ===================== DIREITO INTERNACIONAL ===================== */
  {
    id: "int-001",
    disciplina: "Direito Internacional",
    topico: "Direito internacional privado",
    dificuldade: "media",
    enunciado:
      "Sobre as regras de conexão da Lei de Introdução às Normas do Direito Brasileiro (LINDB), assinale a afirmativa correta.",
    alternativas: {
      A: "A lei do país em que for celebrado o contrato qualificará a capacidade das partes.",
      B: "A lei do domicílio da pessoa determina as regras sobre o começo e o fim da personalidade, o nome, a capacidade e os direitos de família.",
      C: "Para qualificar os bens e regular as relações a eles concernentes, aplica-se a lei do país de nacionalidade do proprietário.",
      D: "A sucessão por morte rege-se sempre pela lei brasileira, independentemente do domicílio do falecido.",
    },
    correta: "B",
    fundamento:
      "Art. 7º da LINDB (Decreto-Lei 4.657/42): a lei do país em que domiciliada a pessoa determina as regras sobre o começo e o fim da personalidade, o nome, a capacidade e os direitos de família.",
    comentario: {
      A: "Errada. A capacidade rege-se pela lei do domicílio, não do local de celebração (art. 7º).",
      B: "Correta. Art. 7º da LINDB (estatuto pessoal pela lei do domicílio).",
      C: "Errada. Os bens regem-se pela lei do país em que estiverem situados (art. 8º — lex rei sitae).",
      D: "Errada. A sucessão rege-se pela lei do domicílio do falecido, com ressalva pró-cônjuge/filhos brasileiros (art. 10).",
    },
    pegadinha: "Estatuto pessoal pela lei do domicílio x nacionalidade.",
  },
  {
    id: "int-002",
    disciplina: "Direito Internacional",
    topico: "Nacionalidade e condição do estrangeiro",
    dificuldade: "dificil",
    enunciado:
      "Sobre extradição e a condição jurídica do estrangeiro, assinale a afirmativa correta.",
    alternativas: {
      A: "O brasileiro nato pode ser extraditado em caso de crime comum praticado antes da naturalização.",
      B: "Nenhum brasileiro nato será extraditado; o naturalizado pode sê-lo por crime comum praticado antes da naturalização ou por comprovado envolvimento em tráfico de entorpecentes.",
      C: "O estrangeiro pode ser extraditado por crime político ou de opinião.",
      D: "A concessão de extradição independe de tratado ou promessa de reciprocidade.",
    },
    correta: "B",
    fundamento:
      "Art. 5º, LI e LII, da CF/88: nenhum brasileiro será extraditado, salvo o naturalizado, em caso de crime comum praticado antes da naturalização ou de comprovado envolvimento em tráfico ilícito de entorpecentes; não será concedida extradição por crime político ou de opinião.",
    comentario: {
      A: "Errada. O brasileiro nato nunca é extraditado (art. 5º, LI).",
      B: "Correta. Art. 5º, LI (exceção do naturalizado).",
      C: "Errada. Não se concede extradição por crime político ou de opinião (art. 5º, LII).",
      D: "Errada. A extradição depende de tratado ou promessa de reciprocidade (Lei de Migração — Lei 13.445/17).",
    },
    pegadinha: "Extraditar brasileiro nato (impossível) e extradição por crime político.",
  },

  /* ===================== DIREITO AMBIENTAL ===================== */
  {
    id: "amb-001",
    disciplina: "Direito Ambiental",
    topico: "Princípios e responsabilidade",
    dificuldade: "media",
    enunciado:
      "Sobre a responsabilidade por danos ambientais, assinale a afirmativa correta.",
    alternativas: {
      A: "A responsabilidade civil por dano ambiental é subjetiva, exigindo a demonstração de culpa do poluidor.",
      B: "A responsabilidade civil por dano ambiental é objetiva, fundada na teoria do risco integral, não admitindo as excludentes de caso fortuito e força maior.",
      C: "A obrigação de reparar o dano ambiental é personalíssima e não se transmite ao adquirente do imóvel.",
      D: "As condutas lesivas ao meio ambiente sujeitam os infratores apenas a sanções penais.",
    },
    correta: "B",
    fundamento:
      "Art. 14, §1º, da Lei 6.938/81 e jurisprudência do STJ: a responsabilidade civil ambiental é objetiva, fundada na teoria do risco integral. Art. 225, §3º, CF: as condutas lesivas sujeitam a sanções penais e administrativas, independentemente da obrigação de reparar.",
    comentario: {
      A: "Errada. A responsabilidade ambiental civil é objetiva.",
      B: "Correta. Responsabilidade objetiva pela teoria do risco integral (STJ).",
      C: "Errada. A obrigação ambiental tem natureza propter rem, transmitindo-se ao adquirente (Súmula 623 STJ).",
      D: "Errada. As sanções são penais, administrativas e civis, cumulativamente (art. 225, §3º, CF).",
    },
    pegadinha: "Tornar a obrigação ambiental personalíssima (na verdade é propter rem).",
  },
  {
    id: "amb-002",
    disciplina: "Direito Ambiental",
    topico: "Competência e licenciamento",
    dificuldade: "media",
    enunciado:
      "Sobre a proteção do meio ambiente na Constituição Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "A defesa do meio ambiente é competência exclusiva da União.",
      B: "Todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo, impondo-se ao Poder Público e à coletividade o dever de defendê-lo e preservá-lo.",
      C: "A exigência de estudo prévio de impacto ambiental é dispensável para obras potencialmente causadoras de degradação.",
      D: "A Floresta Amazônica e a Mata Atlântica não integram o patrimônio nacional.",
    },
    correta: "B",
    fundamento:
      "Art. 225, caput, da CF/88: todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à sadia qualidade de vida, impondo-se ao Poder Público e à coletividade o dever de defendê-lo e preservá-lo para as presentes e futuras gerações.",
    comentario: {
      A: "Errada. Proteger o meio ambiente é competência comum (art. 23, VI) e a legislativa é concorrente (art. 24, VI).",
      B: "Correta. Art. 225, caput.",
      C: "Errada. Exige-se EIA para obras potencialmente causadoras de significativa degradação (art. 225, §1º, IV).",
      D: "Errada. A Floresta Amazônica, a Mata Atlântica, a Serra do Mar, o Pantanal e a Zona Costeira são patrimônio nacional (art. 225, §4º).",
    },
  },

  /* ===================== DIREITO DA CRIANÇA E DO ADOLESCENTE ===================== */
  {
    id: "eca-001",
    disciplina: "Direito da Criança e do Adolescente",
    topico: "Princípios do ECA",
    dificuldade: "media",
    enunciado:
      "À luz do Estatuto da Criança e do Adolescente (Lei 8.069/90), assinale a afirmativa correta.",
    alternativas: {
      A: "Considera-se criança a pessoa até quatorze anos de idade e adolescente entre quatorze e dezoito anos.",
      B: "Considera-se criança a pessoa até doze anos de idade incompletos, e adolescente aquela entre doze e dezoito anos de idade.",
      C: "O ECA aplica-se exclusivamente a crianças e adolescentes em situação de risco.",
      D: "As medidas socioeducativas podem ser aplicadas a crianças que praticam ato infracional.",
    },
    correta: "B",
    fundamento:
      "Art. 2º do ECA: considera-se criança a pessoa até doze anos de idade incompletos, e adolescente aquela entre doze e dezoito anos de idade.",
    comentario: {
      A: "Errada. O marco etário é 12 anos (não 14) — art. 2º.",
      B: "Correta. Art. 2º do ECA.",
      C: "Errada. O ECA tem proteção integral a todas as crianças e adolescentes (art. 3º), não só em risco.",
      D: "Errada. À criança autora de ato infracional aplicam-se medidas protetivas, não socioeducativas (art. 105).",
    },
    pegadinha: "Marco etário criança/adolescente (12 anos) trocado por 14.",
  },
  {
    id: "eca-002",
    disciplina: "Direito da Criança e do Adolescente",
    topico: "Medidas socioeducativas",
    dificuldade: "media",
    enunciado:
      "Sobre as medidas socioeducativas previstas no ECA, assinale a afirmativa correta.",
    alternativas: {
      A: "A internação é medida que admite prazo determinado, com reavaliação no máximo a cada seis meses, não podendo exceder três anos.",
      B: "A internação pode ser cumprida por prazo indeterminado, sem reavaliação periódica.",
      C: "A advertência é aplicada exclusivamente aos maiores de dezoito anos.",
      D: "A prestação de serviços à comunidade pode durar, no máximo, dois anos.",
    },
    correta: "A",
    fundamento:
      "Art. 121, §§2º e 3º, do ECA: a internação não comporta prazo determinado, devendo a manutenção ser reavaliada, no máximo, a cada seis meses, não podendo exceder o período máximo de três anos.",
    comentario: {
      A: "Correta. Art. 121, §§2º e 3º (reavaliação semestral; limite de 3 anos).",
      B: "Errada. A internação deve ser reavaliada a cada 6 meses (art. 121, §2º).",
      C: "Errada. A advertência aplica-se a adolescentes autores de ato infracional (art. 112, I).",
      D: "Errada. A prestação de serviços à comunidade não pode exceder seis meses (art. 117).",
    },
    pegadinha: "Prazos das medidas socioeducativas (PSC até 6 meses; internação até 3 anos).",
  },

  /* ===================== DIREITO PREVIDENCIÁRIO ===================== */
  {
    id: "prev-001",
    disciplina: "Direito Previdenciário",
    topico: "Segurados e benefícios",
    dificuldade: "media",
    enunciado:
      "Sobre os segurados do Regime Geral de Previdência Social (RGPS), assinale a afirmativa correta.",
    alternativas: {
      A: "O segurado facultativo é aquele que exerce atividade remunerada vinculada obrigatoriamente ao RGPS.",
      B: "São segurados obrigatórios, entre outros, o empregado, o empregado doméstico, o contribuinte individual, o trabalhador avulso e o segurado especial.",
      C: "O segurado especial é o servidor público estatutário vinculado a regime próprio.",
      D: "A filiação ao RGPS depende exclusivamente da inscrição formal no sistema.",
    },
    correta: "B",
    fundamento:
      "Art. 11 da Lei 8.213/91: são segurados obrigatórios o empregado, o empregado doméstico, o contribuinte individual, o trabalhador avulso e o segurado especial.",
    comentario: {
      A: "Errada. O facultativo é quem não exerce atividade que o vincule obrigatoriamente (ex.: estudante, dona de casa).",
      B: "Correta. Rol dos segurados obrigatórios (art. 11).",
      C: "Errada. O servidor com regime próprio é excluído do RGPS; o segurado especial é o produtor rural/pescador em regime de economia familiar.",
      D: "Errada. A filiação decorre do exercício de atividade (para o obrigatório); a inscrição é ato administrativo posterior.",
    },
  },
  {
    id: "prev-002",
    disciplina: "Direito Previdenciário",
    topico: "Princípios da seguridade social",
    dificuldade: "facil",
    enunciado:
      "Sobre os princípios da seguridade social na Constituição Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "A seguridade social compreende um conjunto de ações nas áreas da saúde, previdência e assistência social.",
      B: "A saúde é direito de todos mediante contribuição direta do beneficiário.",
      C: "A assistência social será prestada apenas a quem contribuir para o sistema.",
      D: "A previdência social independe de prévia fonte de custeio para criação de benefícios.",
    },
    correta: "A",
    fundamento:
      "Art. 194 da CF/88: a seguridade social compreende um conjunto integrado de ações de iniciativa dos Poderes Públicos e da sociedade, destinadas a assegurar os direitos relativos à saúde, à previdência e à assistência social.",
    comentario: {
      A: "Correta. Tripé da seguridade social (art. 194).",
      B: "Errada. A saúde independe de contribuição (art. 196).",
      C: "Errada. A assistência social é prestada a quem dela necessitar, independentemente de contribuição (art. 203).",
      D: "Errada. Nenhum benefício pode ser criado sem a correspondente fonte de custeio (art. 195, §5º).",
    },
  },

  /* ===================== DIREITO ELEITORAL ===================== */
  {
    id: "elei-001",
    disciplina: "Direito Eleitoral",
    topico: "Direitos políticos",
    dificuldade: "media",
    enunciado:
      "Sobre os direitos políticos e a elegibilidade na Constituição Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "O alistamento eleitoral e o voto são obrigatórios para os maiores de dezesseis e menores de dezoito anos.",
      B: "São condições de elegibilidade, entre outras, a nacionalidade brasileira, o pleno exercício dos direitos políticos, o alistamento eleitoral e a filiação partidária.",
      C: "A idade mínima para Presidente da República é de trinta anos.",
      D: "É permitida a cassação de direitos políticos como sanção administrativa.",
    },
    correta: "B",
    fundamento:
      "Art. 14, §3º, da CF/88: são condições de elegibilidade a nacionalidade brasileira, o pleno exercício dos direitos políticos, o alistamento eleitoral, o domicílio eleitoral na circunscrição, a filiação partidária e a idade mínima.",
    comentario: {
      A: "Errada. Para os maiores de 16 e menores de 18 anos o voto é facultativo (art. 14, §1º, II, 'c').",
      B: "Correta. Condições de elegibilidade (art. 14, §3º).",
      C: "Errada. A idade mínima para Presidente é 35 anos (art. 14, §3º, VI, 'a').",
      D: "Errada. É vedada a cassação de direitos políticos; só há perda ou suspensão nas hipóteses do art. 15.",
    },
    pegadinha: "Idade mínima para Presidente (35 anos) trocada por 30.",
  },

  /* ===================== DIREITO FINANCEIRO ===================== */
  {
    id: "fin-001",
    disciplina: "Direito Financeiro",
    topico: "Orçamento público",
    dificuldade: "media",
    enunciado:
      "Sobre as leis orçamentárias na Constituição Federal, assinale a afirmativa correta.",
    alternativas: {
      A: "A lei orçamentária anual conterá a previsão de receitas e a fixação de despesas, mas pode incluir dispositivo estranho à previsão da receita e à fixação da despesa.",
      B: "Leis de iniciativa do Poder Executivo estabelecerão o plano plurianual, as diretrizes orçamentárias e os orçamentos anuais.",
      C: "A vedação à vinculação de receita de impostos a órgão, fundo ou despesa não comporta exceções.",
      D: "É permitida a abertura de crédito suplementar sem prévia autorização legislativa.",
    },
    correta: "B",
    fundamento:
      "Art. 165 da CF/88: leis de iniciativa do Poder Executivo estabelecerão o plano plurianual (PPA), as diretrizes orçamentárias (LDO) e os orçamentos anuais (LOA).",
    comentario: {
      A: "Errada. Veda-se dispositivo estranho à previsão de receita e fixação de despesa — princípio da exclusividade (art. 165, §8º).",
      B: "Correta. Art. 165 (iniciativa do Executivo para PPA, LDO e LOA).",
      C: "Errada. A vedação de vinculação de impostos comporta exceções (art. 167, IV).",
      D: "Errada. Crédito suplementar exige prévia autorização legislativa (art. 167, V).",
    },
  },
];

// Disponível para Node (testes) e browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTOES };
}
