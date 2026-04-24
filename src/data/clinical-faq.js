/**
 * FAQ clínica compartilhada entre as landings de /psicoterapia-analitica/*.
 *
 * Perguntas práticas que valem pros 3 públicos (adolescentes, adultos, idosos).
 * Landings filhas importam e concatenam ao FAQ local (no final, depois das
 * perguntas específicas do público).
 *
 * IMPORTANTE: Conselho Federal de Psicologia (CFP) regula o que pode ser
 * divulgado. A resposta sobre "valor" é mantida genérica — o valor atual
 * é informado na primeira conversa, não publicado abertamente.
 */

export const CLINICAL_FAQ_FINANCIAL = [
  {
    q: 'Quanto custa uma sessão?',
    a: 'O valor atual é informado na primeira conversa, junto com as condições (frequência, pacotes, possíveis ajustes). Trabalho com transparência total sobre investimento antes de qualquer sessão começar.',
  },
  {
    q: 'Você aceita convênio ou plano de saúde?',
    a: 'Não atendo por convênio. O atendimento é particular. Emito recibo com todas as informações necessárias para que você solicite reembolso ao seu plano (quando houver cobertura) ou use como despesa médica no Imposto de Renda.',
  },
  {
    q: 'Como funciona o recibo para Imposto de Renda?',
    a: 'Emito recibo digital ao final de cada mês, com os campos exigidos pela Receita Federal (CPF, data, valor). Despesas com psicoterapia são dedutíveis integralmente na declaração de IR.',
  },
];

export const CLINICAL_FAQ_PRACTICAL = [
  {
    q: 'Quantas sessões são necessárias?',
    a: 'Não há número fixo. A psicoterapia analítica não segue protocolos por tempo determinado — o processo tem o ritmo de cada pessoa. Em geral começamos com sessões semanais e revisamos juntos, periodicamente, como o processo está caminhando e o que faz sentido.',
  },
  {
    q: 'Com que frequência acontecem as sessões?',
    a: 'Tradicionalmente semanais, com 50 minutos de duração. Em momentos específicos pode haver maior frequência (sessões quinzenais são possíveis, mas raramente são o ponto de partida ideal para a abordagem analítica).',
  },
  {
    q: 'O que acontece se eu precisar cancelar ou remarcar?',
    a: 'Remarcações com até 24 horas de antecedência são combinadas sem custo. Dentro das 24 horas a sessão é cobrada integralmente, salvo imprevistos sérios de saúde. Essa regra protege o espaço clínico — a continuidade do processo depende da regularidade.',
  },
];

export const CLINICAL_FAQ_SIGILO = [
  {
    q: 'O sigilo é garantido mesmo sendo online?',
    a: 'Sim. O sigilo profissional é absoluto e está previsto no Código de Ética do Psicólogo. As sessões acontecem em plataformas seguras, não são gravadas e nenhum conteúdo é compartilhado. Do seu lado, recomendo escolher um espaço privado — onde a conversa não possa ser ouvida por outra pessoa.',
  },
  {
    q: 'As sessões são gravadas?',
    a: 'Nunca. Não gravo sessões em nenhuma circunstância. Não uso ferramentas de transcrição, IA ou qualquer tecnologia que capture o conteúdo. As anotações que faço são minhas, manuscritas, e ficam sob sigilo.',
  },
  {
    q: 'E em relação à LGPD?',
    a: 'Os dados que você compartilha em contato inicial (nome, telefone, e-mail) são guardados apenas pelo tempo necessário ao contato e nunca são usados para outro fim. Não faço lista de e-mail marketing, não vendo dados, não cruzo informações com plataformas externas.',
  },
];

export const CLINICAL_FAQ = [
  ...CLINICAL_FAQ_PRACTICAL,
  ...CLINICAL_FAQ_FINANCIAL,
  ...CLINICAL_FAQ_SIGILO,
];
