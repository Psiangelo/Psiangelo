'use client';

/**
 * sitedata — camada de leitura/escrita do conteúdo gerenciado pelo admin.
 *
 * Todo conteúdo do site (trilhas, cartografia, textos editoriais)
 * tem um "default" hardcoded em src/data/* e pode ser sobrescrito
 * pelo admin gravando no localStorage. As páginas públicas chamam
 * `getX()` que devolve o gerenciado, ou cai no default.
 *
 * Padrão é compatível com server-render: getters retornam default
 * quando window não existe; o componente cliente reidrata via useEffect.
 */

import { trilhas as TRILHAS_DEFAULT } from '@/data/trilhas';
import {
  materials as MATERIALS_DEFAULT,
  comingSoon as COMING_SOON_DEFAULT,
} from '@/data/materials';

export const SITEDATA_KEYS = {
  trilhas:        'angelo_admin_trilhas',
  cartoNodes:     'angelo_admin_cartography_nodes',
  cartoEdges:     'angelo_admin_cartography_edges',
  homepage:       'angelo_admin_homepage',
  bio:            'angelo_admin_bio',
  visibility:     'angelo_admin_visibility',
  materials:      'angelo_admin_materials',
  comingSoon:     'angelo_admin_coming_soon',
  testimonials:   'angelo_admin_testimonials',
  faqs:           'angelo_admin_faqs',
  settings:       'angelo_admin_settings',
  atlasOverrides: 'angelo_admin_atlas_overrides',
  therapy:        'angelo_admin_therapy',
};

/* ===================================================================
   DEFAULTS
=================================================================== */

export const DEFAULT_CARTO_NODES = [
  { id: 'self',     label: 'Self',                  x: 400, y: 260, size: 28, tone: 'accent',   axiom: 'centro arquetípico',         href: '/trilhas' },
  { id: 'ego',      label: 'Ego',                   x: 290, y: 200, size: 18, tone: 'bright',   axiom: 'sujeito da consciência',     href: '' },
  { id: 'persona',  label: 'Persona',               x: 200, y: 130, size: 16, tone: 'bright',   axiom: 'máscara social',             href: '' },
  { id: 'sombra',   label: 'Sombra',                x: 250, y: 360, size: 22, tone: 'rubedo',   axiom: 'o que não se quis ser',      href: '/materiais#projecao' },
  { id: 'anima',    label: 'Anima',                 x: 540, y: 170, size: 20, tone: 'citrinit', axiom: 'feminino interior',          href: '' },
  { id: 'animus',   label: 'Animus',                x: 600, y: 330, size: 20, tone: 'citrinit', axiom: 'masculino interior',         href: '' },
  { id: 'incol',    label: 'Inconsciente Coletivo', x: 700, y: 200, size: 18, tone: 'accent',   axiom: 'substrato comum',            href: '' },
  { id: 'arc',      label: 'Arquétipo',             x: 660, y: 100, size: 16, tone: 'bright',   axiom: 'forma a priori',             href: '/materiais#hermeneutica-psicologia' },
  { id: 'complexo', label: 'Complexo',              x: 130, y: 280, size: 18, tone: 'bright',   axiom: 'núcleo afetivo autônomo',    href: '/materiais#consciencia-complexo-ego' },
  { id: 'sincron',  label: 'Sincronicidade',        x: 130, y: 440, size: 16, tone: 'rubedo',   axiom: 'sentido sem causa',          href: '' },
  { id: 'individ',  label: 'Individuação',          x: 460, y: 460, size: 24, tone: 'accent',   axiom: 'tornar-se quem se é',        href: '/trilhas#aprofundando-na-clinica' },
  { id: 'mito',     label: 'Mito Pessoal',          x: 690, y: 450, size: 16, tone: 'citrinit', axiom: 'narrativa da alma',          href: '/blog' },
];

export const DEFAULT_CARTO_EDGES = [
  ['self', 'ego'],
  ['self', 'individ'],
  ['self', 'incol'],
  ['ego', 'persona'],
  ['ego', 'sombra'],
  ['ego', 'complexo'],
  ['sombra', 'individ'],
  ['anima', 'self'],
  ['animus', 'self'],
  ['anima', 'arc'],
  ['animus', 'arc'],
  ['arc', 'incol'],
  ['complexo', 'sombra'],
  ['complexo', 'sincron'],
  ['individ', 'mito'],
  ['mito', 'incol'],
  ['sincron', 'incol'],
];

export const CARTO_TONES = ['accent', 'bright', 'citrinit', 'rubedo'];

export const DEFAULT_HOMEPAGE = {
  hero: {
    eyebrow: 'Psicologia Analítica · Jung',
    titlePrefix: 'Psi',
    titleEmphasis: 'angelo',
    tagline: 'Nosce te ipsum',
    lead: 'Estudante de psicologia, estagiário clínico e futuro psicólogo. Aqui você encontra quem eu sou, o que produzo e como a psicologia analítica guia minha prática e meu olhar sobre o mundo.',
  },
  prelude: {
    body: 'Aqui você encontra o que estudo, atendo e ensino — materiais, trilhas, anotações de clínica e textos sobre psicologia analítica.',
    tagline: 'γνῶθι σεαυτόν',
  },
  about: {
    title: 'Sobre',
    paragraph1: 'Atendo em clínica desde o terceiro período da graduação. Faço estágio na Associação Allos, com supervisão e pesquisa.',
    paragraph2: 'Também conduzo grupos de estudo para estudantes e psicólogos que buscam se aprimorar na prática clínica. Dou aulas, conduzo intervisões e participo da Liga de Psicologia Analítica da UNICAP.',
    quoteText: 'Quem olha para fora, sonha; quem olha para dentro, desperta.',
    quoteAuthor: 'Carl Gustav Jung',
    credentials: [
      { mark: '◆', label: 'Estágio',     detail: 'Clínico · Associação Allos' },
      { mark: '◇', label: 'Facilitação', detail: 'Liga de Psicologia Analítica · UNICAP' },
      { mark: '◆', label: 'Formação',    detail: 'Intervisão e supervisão clínica' },
      { mark: '◇', label: 'Método',      detail: 'Prática deliberada para psicoterapeutas' },
      { mark: '◆', label: 'Atuação',     detail: 'Plantão psicológico' },
    ],
    milestones: [
      { year: 'III',    label: 'Início clínico', detail: '3º período da graduação' },
      { year: 'Allos',  label: 'Estágio',         detail: 'Processo seletivo' },
      { year: 'UNICAP', label: 'Liga',            detail: 'Psicologia Analítica' },
      { year: 'Hoje',   label: 'Clínica',         detail: 'Atendimento e ensino' },
    ],
  },
  contact: {
    sectionLabel: 'Contato',
    title: 'Pronto para aprofundar seus estudos?',
    lead: 'Dê o próximo passo na sua formação em psicologia analítica. Entre em contato pelo WhatsApp — é o canal mais rápido para conversarmos.',
    primaryLabel: 'Canal principal',
    primaryHeadingPrefix: 'Fale comigo no',
    primaryHeadingEmphasis: 'WhatsApp',
    primaryText: 'Tire dúvidas sobre os materiais, monte um pacote, ou apenas converse sobre psicologia analítica.',
    primaryButton: 'Abrir conversa',
    whatsappNumber: '5581987349114',
    instagramLabel: 'Instagram',
    instagramValue: '@psiangelo',
    instagramUrl: 'https://instagram.com/psiangelo',
    emailLabel: 'E-mail',
    emailValue: 'contato@angelopsicologia.com',
  },
};

export const DEFAULT_BIO = {
  name: 'Psiangelo',
  tagline: 'Psicologia Analítica · Jung',
  bio: 'Estudante de psicologia, estagiário clínico. Aqui divido o que estudo, atendo e ensino.',
  avatar: '/images/angelo-portrait.png',
  images: [],
  links: [
    {
      label: 'Contato comigo',
      href: 'https://wa.me/5581987349114',
      image: '',
      description: '',
    },
    {
      label: 'Resumos e materiais',
      href: '/materiais',
      image: '',
      description: '',
    },
    {
      label: 'Blog e ensaios',
      href: '/blog',
      image: '',
      description: '',
    },
    {
      label: 'Cursos',
      href: '/cursos',
      image: '',
      description: '',
    },
  ],
};

/* ===================================================================
   READ HELPERS — server-safe (devolvem default sem window)
=================================================================== */

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // storage event só dispara entre abas; emitimos custom pra reagir na mesma aba
    try {
      window.dispatchEvent(new CustomEvent('sitedata:changed', { detail: { key } }));
    } catch {
      /* noop */
    }
    return true;
  } catch (err) {
    console.error(`[sitedata] falha ao salvar ${key}:`, err);
    return false;
  }
}

export const getTrilhas    = () => readJson(SITEDATA_KEYS.trilhas, TRILHAS_DEFAULT);
export const setTrilhas    = (v) => writeJson(SITEDATA_KEYS.trilhas, v);
export const getCartoNodes = () => readJson(SITEDATA_KEYS.cartoNodes, DEFAULT_CARTO_NODES);
export const setCartoNodes = (v) => writeJson(SITEDATA_KEYS.cartoNodes, v);
export const getCartoEdges = () => readJson(SITEDATA_KEYS.cartoEdges, DEFAULT_CARTO_EDGES);
export const setCartoEdges = (v) => writeJson(SITEDATA_KEYS.cartoEdges, v);
export const getHomepage   = () => {
  // Merge profundo: garante que campos novos do default apareçam mesmo
  // se o admin tiver salvo antes de existirem.
  const stored = readJson(SITEDATA_KEYS.homepage, null);
  if (!stored) return DEFAULT_HOMEPAGE;
  return {
    hero:    { ...DEFAULT_HOMEPAGE.hero,    ...(stored.hero    || {}) },
    prelude: { ...DEFAULT_HOMEPAGE.prelude, ...(stored.prelude || {}) },
    about:   { ...DEFAULT_HOMEPAGE.about,   ...(stored.about   || {}) },
    contact: { ...DEFAULT_HOMEPAGE.contact, ...(stored.contact || {}) },
  };
};
export const setHomepage = (v) => writeJson(SITEDATA_KEYS.homepage, v);

export const getBio = () => {
  const stored = readJson(SITEDATA_KEYS.bio, null);
  if (!stored) return DEFAULT_BIO;
  const links = Array.isArray(stored.links) ? stored.links : DEFAULT_BIO.links;
  const images = Array.isArray(stored.images) ? stored.images : DEFAULT_BIO.images;
  return {
    ...DEFAULT_BIO,
    ...stored,
    images: images.map((img) => ({
      url: img.url ?? '',
      alt: img.alt ?? '',
      hidden: img.hidden ?? false,
    })),
    links: links.map((l) => ({
      label: l.label ?? '',
      href: l.href ?? '',
      image: l.image ?? '',
      description: l.description ?? '',
      hidden: l.hidden ?? false,
    })),
  };
};
export const setBio = (v) => writeJson(SITEDATA_KEYS.bio, v);

/* ===================================================================
   VISIBILITY — controla o que aparece no site público
   (por módulo: blog, cursos, materiais, trilhas, etc)
=================================================================== */

export const DEFAULT_VISIBILITY = {
  // Módulos com página dedicada: oculta página + preview na home + link no nav
  blog:       true,
  cursos:     true,
  materiais:  true,
  trilhas:    true,
  bio:        true,
  atlas:      true,
  glossario:  true,
  psicoterapia: false, // oculta por padrão — ativa no admin quando começar a atender
  // Seções só da home
  prelude:      true,
  about:        true,
  cartografia:  true,
  depoimentos:  true,
  faq:          true,
  contato:      true,
  // Extras
  whatsappFlutuante: true,
};

export const getSiteVisibility = () => {
  const stored = readJson(SITEDATA_KEYS.visibility, null);
  if (!stored) return DEFAULT_VISIBILITY;
  return { ...DEFAULT_VISIBILITY, ...stored };
};
export const setSiteVisibility = (v) => writeJson(SITEDATA_KEYS.visibility, v);

/** É visível? Safe em SSR — devolve default quando sem window. */
export const isVisible = (key) => {
  if (typeof window === 'undefined') return DEFAULT_VISIBILITY[key] ?? true;
  return getSiteVisibility()[key] ?? true;
};

/* ===================================================================
   ATLAS OVERRIDES — curadoria de publicação por nota/pasta
=================================================================== */

export const DEFAULT_ATLAS_OVERRIDES = {
  hiddenNotes: [],   // array de "section/slug"
  hiddenFolders: [], // array de "section/raw1/raw2/..." (path completo desde a seção)
};

export const getAtlasOverrides = () => {
  const stored = readJson(SITEDATA_KEYS.atlasOverrides, null);
  if (!stored) return DEFAULT_ATLAS_OVERRIDES;
  return { ...DEFAULT_ATLAS_OVERRIDES, ...stored };
};
export const setAtlasOverrides = (v) => writeJson(SITEDATA_KEYS.atlasOverrides, v);

/* ===================================================================
   THERAPY — configuração da landing /psicoterapia-analitica
=================================================================== */

export const DEFAULT_THERAPY = {
  hero: {
    eyebrow: 'Psicoterapia analítica · abordagem junguiana',
    title: 'Um trabalho para escutar',
    emphasis: 'quem você é',
    lead:
      'Não parto de nenhum pressuposto sobre você. O trabalho começa do que você me conta e do que ressoa entre nós — e o que se segue é único para a sua vida.',
  },
  approach: {
    sectionLabel: 'Como trabalho',
    intro: 'Três princípios que atravessam a clínica aqui.',
    items: [
      {
        title: 'Cada pessoa é única',
        body:
          'Não aplico uma teoria pronta. Para cada pessoa que procura o consultório, faço uma psicologia inteiramente nova — porque cada vida tem sua própria forma.',
      },
      {
        title: 'É uma relação, não um enquadramento',
        body:
          'A postura é dialética: estou tão presente quanto você. O que surge na clínica é o que surge entre nós dois — escutar, perceber, dialogar.',
      },
      {
        title: 'Escuta, não suposição',
        body:
          'Saberemos de você pelo que você conta e pelo que acontece no contato. É a partir daí — e só daí — que o trabalho toma forma.',
      },
    ],
  },
  process: {
    sectionLabel: 'Como funciona',
    steps: [
      {
        title: 'Uma primeira conversa',
        body:
          'Uma conversa curta, sem custo e sem compromisso. Serve pra você me conhecer, me contar o que traz e a gente avaliar juntos se faz sentido seguir.',
      },
      {
        title: 'O processo',
        body:
          'Se fizer sentido, começamos. Uma ou duas sessões por semana, conforme combinarmos. Online ou presencial, em Recife.',
      },
      {
        title: 'O tempo é seu',
        body:
          'Não há tempo pré-definido. O processo acompanha você até onde fizer sentido — o ritmo e a duração são parte do que vamos descobrindo.',
      },
    ],
  },
  format: {
    sectionLabel: 'Formato',
    modalityLabel: 'Modalidade',
    modalities: ['Online', 'Presencial · Recife'],
    durationLabel: 'Duração',
    duration: '50 minutos',
    frequencyLabel: 'Frequência',
    frequency: '1 a 2 vezes por semana',
  },
  values: {
    show: false, // default oculto por conta da Nota Técnica CFP 01/2022
    sectionLabel: 'Valores',
    perSession: 'R$ 120',
    perMonth: 'R$ 400',
    note: 'Valor conversável conforme o contexto.',
    fallback: 'Conversamos sobre valor e frequência na primeira conversa.',
  },
  faq: [
    {
      q: 'Quanto tempo dura o processo?',
      a: 'Depende do momento e do que aparece no trabalho. Pode ser meses, pode ser anos. O tempo é acompanhado, não prescrito.',
    },
    {
      q: 'Atendimento online funciona tão bem quanto presencial?',
      a: 'Sim. O vínculo clínico se estabelece pela palavra — o essencial é a presença e a continuidade, não o espaço físico.',
    },
    {
      q: 'E se eu precisar faltar?',
      a: 'Combinamos na primeira conversa. Há uma política simples de ausência, explicada antes de começarmos.',
    },
    {
      q: 'Sigilo',
      a: 'Absoluto, conforme o Código de Ética da profissão. Nada do que você trazer sai daqui.',
    },
    {
      q: 'Você atende quais demandas?',
      a: 'Demandas adultas — ansiedade, questões de sentido, relacionamentos, sonhos, crises. Na primeira conversa avaliamos se é pertinente para a minha abordagem.',
    },
  ],
  schedule: {
    show: true,
    sectionLabel: 'Janelas de atendimento',
    note: 'Atendo de tarde para noite. Selecione um horário — vamos combinar pelo WhatsApp.',
    // Janelas recorrentes por dia da semana (0=dom, 1=seg, ..., 6=sáb)
    windows: [
      { dow: 1, label: 'Segunda', startHour: 14, endHour: 21 },
      { dow: 2, label: 'Terça',   startHour: 14, endHour: 21 },
      { dow: 3, label: 'Quarta',  startHour: 14, endHour: 21 },
      { dow: 4, label: 'Quinta',  startHour: 14, endHour: 21 },
      { dow: 5, label: 'Sexta',   startHour: 14, endHour: 21 },
    ],
    slotMinutes: 60,
  },
  cta: {
    primaryLabel: 'Marcar uma primeira conversa',
    helper: 'Sem custo e sem compromisso.',
    modalTitleStep1: 'O que te traz?',
    motivations: [
      'Escuta e elaboração',
      'Ansiedade e angústia',
      'Relacionamentos',
      'Sonhos e vida simbólica',
      'Autoconhecimento',
      'Não tenho certeza ainda',
    ],
    modalTitleStep2: 'Como você prefere?',
    formats: ['Online', 'Presencial em Recife'],
    modalTitleStep3: 'Mensagem',
    messageTemplate:
      'Oi Gabriel, vim pelo seu site e gostaria de marcar uma primeira conversa.\n\nMotivação: {{motivation}}\nFormato: {{format}}{{slot}}\n\nAguardo retorno.',
  },
  deontology: {
    show: true,
    text:
      'Atendo como estagiário em psicologia, sob supervisão clínica da Associação Allos. Quando concluir a graduação e obtiver registro no CRP, esta indicação será atualizada.',
    crp: '',
  },
  whatsappNumber: '5581987349114',
};

export const getTherapy = () => {
  const stored = readJson(SITEDATA_KEYS.therapy, null);
  if (!stored) return DEFAULT_THERAPY;
  // merge profundo em 1 nível (objeto com subobjetos)
  const merged = { ...DEFAULT_THERAPY };
  for (const k of Object.keys(DEFAULT_THERAPY)) {
    if (typeof DEFAULT_THERAPY[k] === 'object' && !Array.isArray(DEFAULT_THERAPY[k]) && DEFAULT_THERAPY[k] !== null) {
      merged[k] = { ...DEFAULT_THERAPY[k], ...(stored[k] || {}) };
    } else if (stored[k] !== undefined) {
      merged[k] = stored[k];
    }
  }
  return merged;
};
export const setTherapy = (v) => writeJson(SITEDATA_KEYS.therapy, v);

/* ===================================================================
   MATERIALS · COMING SOON
=================================================================== */

export const getMaterials  = () => readJson(SITEDATA_KEYS.materials,  MATERIALS_DEFAULT);
export const setMaterials  = (v) => writeJson(SITEDATA_KEYS.materials, v);
export const getComingSoon = () => readJson(SITEDATA_KEYS.comingSoon, COMING_SOON_DEFAULT);
export const setComingSoon = (v) => writeJson(SITEDATA_KEYS.comingSoon, v);

/* ===================================================================
   TESTIMONIALS · FAQS
=================================================================== */

export const DEFAULT_TESTIMONIALS = [
  {
    id: 'test-1',
    quote: 'Os resumos de Jung são incrivelmente didáticos. Consegui finalmente entender conceitos que me travavam há semestres. Material indispensável para qualquer estudante sério de psicologia analítica.',
    name: 'Mariana S.',
    role: 'Estudante de Psicologia',
    audience: 'estudantes',
    archetype: 'Persona',
  },
  {
    id: 'test-2',
    quote: 'Estava perdida no meio de tanta bibliografia para o TCC e esses materiais me deram uma direção clara. A síntese é precisa sem perder a profundidade. Me salvou muito tempo de estudo.',
    name: 'Letícia A.',
    role: 'Estudante de Psicologia',
    audience: 'estudantes',
    archetype: 'Anima',
  },
  {
    id: 'test-3',
    quote: 'Uso os materiais do Ângelo como apoio na minha prática clínica. A forma como ele organiza os conceitos facilita demais a revisão antes das sessões. Recomendo para todos os colegas.',
    name: 'Rafael M.',
    role: 'Psicólogo Clínico',
    audience: 'clinicos',
    archetype: 'Self',
  },
  {
    id: 'test-4',
    quote: 'Procurei por muito tempo um material que fosse ao mesmo tempo aprofundado e acessível. Encontrei nos resumos dele exatamente isso. A qualidade é de outro nível.',
    name: 'Camila R.',
    role: 'Psicanalista',
    audience: 'clinicos',
    archetype: 'Sombra',
  },
  {
    id: 'test-5',
    quote: 'Como supervisor de estágio, indico os materiais do Ângelo para os estagiários. A clareza conceitual e a organização são exemplares. Um trabalho sério e cuidadoso.',
    name: 'Dr. Fernando L.',
    role: 'Professor de Psicologia',
    audience: 'professores',
    archetype: 'Self',
  },
];

export const getTestimonials = () => {
  const stored = readJson(SITEDATA_KEYS.testimonials, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) return DEFAULT_TESTIMONIALS;
  return stored.map((t) => ({
    // hidrata campos faltando com defaults razoáveis
    audience: 'todos',
    archetype: 'Self',
    ...t,
  }));
};
export const setTestimonials = (v) => writeJson(SITEDATA_KEYS.testimonials, v);

export const DEFAULT_FAQS = [
  { id: 'faq-1', group: 'Entrega', question: 'Como recebo os materiais após a compra?',
    answer: 'Após a confirmação do pagamento, os materiais são enviados diretamente pelo WhatsApp e/ou e-mail. Todos os arquivos são em formato PDF digital, prontos para leitura imediata no celular, tablet ou computador.' },
  { id: 'faq-2', group: 'Entrega', question: 'Os mapas mentais são editáveis?',
    answer: 'Os mapas mentais são entregues em formato PDF, otimizados tanto para estudo digital quanto para impressão. O layout foi pensado para facilitar a visualização das conexões entre conceitos, funcionando como um guia visual de estudo.' },
  { id: 'faq-3', group: 'Entrega', question: 'Tem desconto para compra de vários materiais?',
    answer: 'Sim! Ofereço condições especiais para quem deseja adquirir mais de um material. Entre em contato pelo WhatsApp para combinarmos um pacote personalizado de acordo com suas necessidades de estudo.' },
  { id: 'faq-4', group: 'Catálogo', question: 'Posso solicitar um material sobre um tema específico?',
    answer: 'Com certeza! Estou sempre aberto a sugestões e pedidos. Se existe um tema da psicologia analítica ou da prática clínica que você gostaria de ver em formato de resumo ou mapa mental, entre em contato e conversamos sobre a viabilidade.' },
  { id: 'faq-5', group: 'Catálogo', question: 'Posso usar os materiais para estudar para concursos?',
    answer: 'Sim! O conteúdo cobre os principais conceitos exigidos em provas e concursos da área de psicologia. Os resumos são úteis para revisão rápida e fixação.' },
  { id: 'faq-6', group: 'Conteúdo', question: 'Os materiais são baseados em quais autores?',
    answer: 'Os materiais são elaborados com base nas Obras Completas de C. G. Jung, em autores pós-junguianos e na minha experiência clínica e de supervisão.' },
  { id: 'faq-7', group: 'Conteúdo', question: 'Qual a diferença entre resumo e mapa mental?',
    answer: 'O resumo é uma síntese textual do conteúdo — organizado em tópicos, com as ideias principais explicadas de forma clara e objetiva. Já o mapa mental é um diagrama visual que conecta conceitos-chave, facilitando a memorização e a compreensão das relações entre os temas.' },
];

export const getFaqs = () => {
  const stored = readJson(SITEDATA_KEYS.faqs, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) return DEFAULT_FAQS;
  return stored;
};
export const setFaqs = (v) => writeJson(SITEDATA_KEYS.faqs, v);

/* ===================================================================
   SETTINGS — canais de contato e metadados editáveis
=================================================================== */

export const DEFAULT_SETTINGS = {
  whatsappNumber: '5581987349114',
  whatsappMessage: 'Olá! Vi seu site e gostaria de saber mais sobre seus materiais de psicologia.',
  instagramLink: '',
  youtubeLink: '',
  emailAddress: '',
  siteTitle: 'Psiangelo — Psicologia Analítica & Prática Clínica',
  siteDescription: 'Resumos, mapas mentais e materiais de estudo com experiência clínica junguiana.',
  accentColor: '#B48C50',
};

export const getSettings = () => {
  const stored = readJson(SITEDATA_KEYS.settings, null);
  if (!stored) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...stored };
};
export const setSettings = (v) => writeJson(SITEDATA_KEYS.settings, v);
