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
  therapy:        'angelo_admin_therapy',
  homeSections:   'angelo_admin_home_sections',
  categories:     'angelo_admin_categories',
  contentTypes:   'angelo_admin_content_types',
  materiaisPage:  'angelo_admin_materiais_page',
  glossario:      'angelo_admin_glossario',
  glossarioCategories: 'angelo_admin_glossario_categories',
  glossarioPage:  'angelo_admin_glossario_page',
  estudosPage:    'angelo_admin_estudos_page',
  cartographies:  'angelo_admin_cartographies',
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
    eyebrow: 'Clínica · Estudo · Escrita · Psicologia Analítica',
    titlePrefix: 'Psi',
    titleEmphasis: 'angelo',
    tagline: 'Uma escuta para a sua vida.',
    lead: 'A casa de Ângelo: clínica junguiana online em todo o Brasil, e um trabalho público de estudo e escrita sobre a obra de Jung. Aqui você encontra a porta de entrada para tudo isso.',
  },
  bussola: {
    eyebrow: 'Por onde começar',
    title: 'Cinco portas',
    emphasis: 'desta clínica e da casa.',
    lead:
      'A clínica e o trabalho público caminham juntos aqui. Esta é a entrada — escolha por onde começar.',
    portals: [
      { id: 'atendo',    visKey: 'psicoterapia', href: '/psicoterapia-analitica', glyph: '◈', eyebrow: 'Clínica',     title: 'Atendo',    body: 'Psicoterapia analítica online, em todo o Brasil — adolescentes, adultos e idosos.', cta: 'Conhecer o atendimento' },
      { id: 'blog',      visKey: 'blog',         href: '/blog',                   glyph: '✶', eyebrow: 'Ensaios',     title: 'Escrevo',   body: 'Textos sobre clínica, sonhos e símbolos — publicados periodicamente.',          cta: 'Ler os ensaios' },
      { id: 'trilhas',   visKey: 'trilhas',      href: '/trilhas',                glyph: '✦', eyebrow: 'Estudo',      title: 'Trilhas',   body: 'Percursos guiados de leitura para entrar na obra de Jung pela porta certa.',     cta: 'Começar uma trilha' },
      { id: 'materiais', visKey: 'materiais',    href: '/materiais',              glyph: '◆', eyebrow: 'Sínteses',    title: 'Materiais', body: 'Resumos e mapas mentais para estudar e revisitar conceitos junguianos.',          cta: 'Ver materiais' },
      { id: 'glossario', visKey: 'glossario',    href: '/glossario',              glyph: '※', eyebrow: 'Léxico',      title: 'Glossário', body: 'Verbetes vivos da abordagem — definições curtas e remissões cruzadas.',          cta: 'Abrir o glossário' },
    ],
  },
  prelude: {
    body: 'Atendo adolescentes, adultos e idosos em psicoterapia analítica, 100% online, em todo o Brasil. Aqui você conhece a abordagem, a minha trajetória e o que publico sobre psicologia junguiana.',
    tagline: 'γνῶθι σεαυτόν',
  },
  about: {
    title: 'Sobre',
    paragraph1: 'Atendo em clínica desde o terceiro período da graduação, em estágio supervisionado pela Associação Allos. A abordagem é a psicologia analítica — a prática clínica desenvolvida a partir do trabalho de Carl Gustav Jung.',
    paragraph2: 'Além do atendimento, conduzo grupos de estudo para estudantes e profissionais que buscam aprofundar a prática clínica junguiana, participo de intervisões e da Liga de Psicologia Analítica da UNICAP. O que publico aqui — materiais, trilhas, ensaios — nasce desse atravessamento entre estudo e clínica.',
    quoteText: 'Quem olha para fora, sonha; quem olha para dentro, desperta.',
    quoteAuthor: 'Carl Gustav Jung',
    credentials: [
      { mark: '◆', label: 'Atendimento', detail: '100% online · Brasil inteiro' },
      { mark: '◇', label: 'Estágio',     detail: 'Clínico · Associação Allos' },
      { mark: '◆', label: 'Supervisão',  detail: 'Intervisão e supervisão clínica' },
      { mark: '◇', label: 'Facilitação', detail: 'Liga de Psicologia Analítica · UNICAP' },
      { mark: '◆', label: 'Abordagem',   detail: 'Psicologia analítica (C. G. Jung)' },
    ],
    milestones: [
      { year: 'III',    label: 'Início clínico', detail: '3º período da graduação' },
      { year: 'Allos',  label: 'Estágio',        detail: 'Supervisionado' },
      { year: 'UNICAP', label: 'Liga',           detail: 'Psicologia Analítica' },
      { year: 'Hoje',   label: 'Clínica',        detail: 'Atendimento online BR' },
    ],
    images: [
      {
        src: '/images/sobre/aprimoramento-clinico.jpg',
        alt: 'Aprimoramento clínico de habilidades terapêuticas conduzido por Ângelo',
        caption: 'Aprimoramento clínico de habilidades terapêuticas que conduzi.',
      },
      {
        src: '/images/sobre/grupo-estudos.jpg',
        alt: 'Grupo de estudos sobre a prática da psicoterapia',
        caption: 'Grupo de estudos sobre a prática da psicoterapia.',
      },
    ],
  },
  contact: {
    sectionLabel: 'Agendar',
    title: 'Pronto para uma primeira conversa?',
    lead: 'Uma conversa inicial sem compromisso — você me conta o que traz e avaliamos juntos se faz sentido seguir. Atendimento 100% online, por videochamada, em todo o Brasil.',
    primaryLabel: 'Canal principal',
    primaryHeadingPrefix: 'Marque pelo',
    primaryHeadingEmphasis: 'WhatsApp',
    primaryText: 'Me conta brevemente o que te traz e combinamos um horário. Costumo responder no mesmo dia.',
    primaryButton: 'Marcar conversa inicial',
    whatsappNumber: '5581987349114',
    instagramLabel: 'Instagram',
    instagramValue: '@psiangelo',
    instagramUrl: 'https://instagram.com/psiangelo',
    emailLabel: 'E-mail',
    emailValue: '',
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
/* ===================================================================
   CARTOGRAFIAS — multi (admin gerencia N cartografias, cada uma com slug)
   - Cartografia "home" é a padrão (substitui o singular antigo)
   - source: 'manual' | 'blog' | 'glossario' (nodes/edges são auto-gerados quando != 'manual')
   - layout: 'manual' (posições x/y fixas) | 'force' (d3-force calcula)
   - Retrocompat: getCartoNodes/setCartoNodes etc. continuam funcionando
     lendo/escrevendo a cartografia 'home'
=================================================================== */

export const DEFAULT_CARTOGRAPHIES = [
  {
    id: 'home',
    name: 'Cartografia (home)',
    slug: 'home',
    source: 'manual',
    layout: 'manual',
    title: 'Conceitos',
    titleEmphasis: 'junguianos',
    description: 'Um mapa vivo dos conceitos junguianos. Passe o mouse sobre cada nó para ler o axioma, e veja como as ideias se conectam.',
    viewBox: { w: 800, h: 520 },
    nodes: DEFAULT_CARTO_NODES,
    edges: DEFAULT_CARTO_EDGES,
  },
];

function normalizeCartography(c, i = 0) {
  const slug = c?.slug || c?.id || `carto-${i}`;
  return {
    id: c?.id || slug,
    slug,
    name: c?.name || 'Cartografia',
    source: ['manual', 'blog', 'glossario'].includes(c?.source) ? c.source : 'manual',
    layout: ['manual', 'force', 'radial'].includes(c?.layout) ? c.layout : 'manual',
    title: c?.title || '',
    titleEmphasis: c?.titleEmphasis || '',
    description: c?.description || '',
    viewBox: c?.viewBox || { w: 800, h: 520 },
    nodes: Array.isArray(c?.nodes) ? c.nodes : [],
    edges: Array.isArray(c?.edges) ? c.edges : [],
  };
}

export function getCartographies() {
  // Tenta ler a estrutura nova primeiro
  const stored = readJson(SITEDATA_KEYS.cartographies, null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map(normalizeCartography);
  }
  // Migração: lê do singular antigo e retorna como cartografia 'home'
  const oldNodes = readJson(SITEDATA_KEYS.cartoNodes, null);
  const oldEdges = readJson(SITEDATA_KEYS.cartoEdges, null);
  if (oldNodes || oldEdges) {
    return [{
      ...DEFAULT_CARTOGRAPHIES[0],
      nodes: Array.isArray(oldNodes) ? oldNodes : DEFAULT_CARTO_NODES,
      edges: Array.isArray(oldEdges) ? oldEdges : DEFAULT_CARTO_EDGES,
    }];
  }
  return DEFAULT_CARTOGRAPHIES;
}
export const setCartographies = (v) => writeJson(SITEDATA_KEYS.cartographies, v);

export function getCartographyBySlug(slug) {
  return getCartographies().find((c) => c.slug === slug) || null;
}

/* Facade pra retrocompat — operam na cartografia 'home' */
export const getCartoNodes = () => {
  const home = getCartographyBySlug('home');
  return home?.nodes || DEFAULT_CARTO_NODES;
};
export const setCartoNodes = (v) => {
  const list = getCartographies();
  const idx = list.findIndex((c) => c.slug === 'home');
  if (idx < 0) {
    setCartographies([{ ...DEFAULT_CARTOGRAPHIES[0], nodes: v }, ...list]);
  } else {
    list[idx] = { ...list[idx], nodes: v };
    setCartographies(list);
  }
};
export const getCartoEdges = () => {
  const home = getCartographyBySlug('home');
  return home?.edges || DEFAULT_CARTO_EDGES;
};
export const setCartoEdges = (v) => {
  const list = getCartographies();
  const idx = list.findIndex((c) => c.slug === 'home');
  if (idx < 0) {
    setCartographies([{ ...DEFAULT_CARTOGRAPHIES[0], edges: v }, ...list]);
  } else {
    list[idx] = { ...list[idx], edges: v };
    setCartographies(list);
  }
};
// Markers de copy legada (anterior ao reposicionamento clínico de 2026-04-23).
// Quando detectados, a seção é migrada pro default novo e re-persistida no
// localStorage — caso contrário o "Publicar" levaria a copy antiga pro Supabase.
const HOMEPAGE_LEGACY_MARKERS = {
  hero: [
    'nosce te ipsum',
    'estudante de psicologia, estagiário clínico e futuro psicólogo',
    // 2026-05-03: hero pré-reposicionamento "casa" repetia copy da landing clínica
    'psicoterapia analítica · abordagem junguiana · 100% online',
    'atendimento clínico em psicoterapia analítica, online, para adolescentes',
  ],
  contact: [
    'aprofundar seus estudos',
    'formação em psicologia analítica',
    'sobre os materiais',
    'monte um pacote',
    'abrir conversa',
  ],
  prelude: [
    'materiais, trilhas, anotações de clínica e textos',
  ],
};

function looksLegacy(section, markers) {
  if (!section) return false;
  const s = JSON.stringify(section).toLowerCase();
  return markers.some((m) => s.includes(m));
}

let _homepageMigrated = false;

export const getHomepage = () => {
  // Merge profundo: garante que campos novos do default apareçam mesmo
  // se o admin tiver salvo antes de existirem.
  const stored = readJson(SITEDATA_KEYS.homepage, null);
  if (!stored) return DEFAULT_HOMEPAGE;

  const hero = looksLegacy(stored.hero, HOMEPAGE_LEGACY_MARKERS.hero)
    ? DEFAULT_HOMEPAGE.hero
    : { ...DEFAULT_HOMEPAGE.hero, ...(stored.hero || {}) };
  const prelude = looksLegacy(stored.prelude, HOMEPAGE_LEGACY_MARKERS.prelude)
    ? DEFAULT_HOMEPAGE.prelude
    : { ...DEFAULT_HOMEPAGE.prelude, ...(stored.prelude || {}) };
  const contact = looksLegacy(stored.contact, HOMEPAGE_LEGACY_MARKERS.contact)
    ? DEFAULT_HOMEPAGE.contact
    : { ...DEFAULT_HOMEPAGE.contact, ...(stored.contact || {}) };
  const about = { ...DEFAULT_HOMEPAGE.about, ...(stored.about || {}) };
  // bussola: merge raso, mas mantém portals do default quando o admin não tocou
  const storedBussola = stored.bussola || {};
  const bussola = {
    ...DEFAULT_HOMEPAGE.bussola,
    ...storedBussola,
    portals: Array.isArray(storedBussola.portals) && storedBussola.portals.length
      ? storedBussola.portals
      : DEFAULT_HOMEPAGE.bussola.portals,
  };

  // Se houve migração, persiste uma vez por sessão pra que o snapshot publicado
  // no Supabase reflita a copy nova (e não volte o legacy quando outros devices sincronizam).
  if (!_homepageMigrated && typeof window !== 'undefined') {
    const migratedHero    = hero    !== undefined && looksLegacy(stored.hero,    HOMEPAGE_LEGACY_MARKERS.hero);
    const migratedContact = contact !== undefined && looksLegacy(stored.contact, HOMEPAGE_LEGACY_MARKERS.contact);
    const migratedPrelude = prelude !== undefined && looksLegacy(stored.prelude, HOMEPAGE_LEGACY_MARKERS.prelude);
    if (migratedHero || migratedContact || migratedPrelude) {
      _homepageMigrated = true;
      try {
        localStorage.setItem(SITEDATA_KEYS.homepage, JSON.stringify({ hero, bussola, prelude, about, contact }));
        // não dispara evento aqui pra evitar loop de re-render; o resultado retornado já tem a copy correta
      } catch {
        /* quota cheia — migração só em memória */
      }
    } else {
      _homepageMigrated = true;
    }
  }

  return { hero, bussola, prelude, about, contact };
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
  estudos:    true,
  glossario:  true,
  psicoterapia: true, // visível por padrão — atendimento online ativo (adolescentes, adultos, idosos)
  // Seções só da home
  prelude:           true,
  about:             true,
  bussola:           true,  // 2026-05-03: nova porta de entrada da home (substitui audience+approach+faq)
  audience:          false, // 2026-05-03: público canônico vai pra /psicoterapia-analitica/ (anti-canibalização SEO)
  approach:          false, // idem — princípios canônicos vivem na landing clínica
  cartografia:       false, // rebaixada na home clínica (fica acessível via /trilhas e nav)
  depoimentos:       false, // vedado publicar depoimentos de pacientes (CFP) — mantém oculto na home
  disclaimerEstagio: true,  // faixa "estagiário + supervisão" logo abaixo do hero
  faq:               false, // 2026-05-03: FAQ canônico vive na landing clínica (anti-canibalização)
  contato:           true,
  // Extras
  whatsappFlutuante: true,
};

/* ===================================================================
   HOME SECTIONS ORDER — ordem vertical das seções da página inicial
=================================================================== */

export const HOME_SECTION_META = [
  { id: 'hero',         label: 'Hero (topo)',                           fixed: true  },
  { id: 'disclaimer',   label: 'Faixa de status (estagiário)',          visKey: 'disclaimerEstagio' },
  { id: 'seoIntro',     label: 'Manifesto (texto editorial)' },
  { id: 'bussola',      label: 'Bússola (mapa das portas)',             visKey: 'bussola' },
  { id: 'audience',     label: 'Para quem atendo (3 públicos)',         visKey: 'audience' },
  { id: 'approach',     label: 'Como trabalho (3 princípios)',          visKey: 'approach' },
  { id: 'about',        label: 'Sobre mim',                             visKey: 'about' },
  { id: 'prelude',      label: 'Prelúdio (editorial)',                  visKey: 'prelude' },
  { id: 'trilhas',      label: 'Trilhas de estudo',                     visKey: 'trilhas' },
  { id: 'jungQuote',    label: 'Citação de Jung' },
  { id: 'materials',    label: 'Materiais (preview)',                   visKey: 'materiais' },
  { id: 'blog',         label: 'Blog (preview)',                        visKey: 'blog' },
  { id: 'cursos',       label: 'Cursos (preview)',                      visKey: 'cursos' },
  { id: 'cartografia',  label: 'Cartografia de conceitos',              visKey: 'cartografia' },
  { id: 'depoimentos',  label: 'Depoimentos',                           visKey: 'depoimentos' },
  { id: 'faq',          label: 'FAQ',                                   visKey: 'faq' },
  { id: 'contato',      label: 'Contato (CTA final)',                   visKey: 'contato' },
];

export const DEFAULT_HOME_SECTIONS = HOME_SECTION_META.map((s) => s.id);

export const getHomeSections = () => {
  const stored = readJson(SITEDATA_KEYS.homeSections, null);
  if (!Array.isArray(stored)) return DEFAULT_HOME_SECTIONS;
  // Valida + deduplica (user pode ter salvo ordem corrompida com duplicatas)
  const seen = new Set();
  const valid = [];
  for (const id of stored) {
    if (DEFAULT_HOME_SECTIONS.includes(id) && !seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }
  // Insere seções novas do default na posição relativa correta (e não no final),
  // pra que adições futuras (ex.: bussola em 2026-05-03) entrem onde fazem
  // sentido editorialmente, sem bagunçar a ordem que o admin já salvou.
  DEFAULT_HOME_SECTIONS.forEach((id, defaultIdx) => {
    if (seen.has(id)) return;
    // próxima seção do default que JÁ está em valid → ancora a inserção antes dela
    let insertAt = valid.length;
    for (let j = defaultIdx + 1; j < DEFAULT_HOME_SECTIONS.length; j++) {
      const nextId = DEFAULT_HOME_SECTIONS[j];
      const k = valid.indexOf(nextId);
      if (k !== -1) { insertAt = k; break; }
    }
    valid.splice(insertAt, 0, id);
    seen.add(id);
  });
  return valid;
};
export const setHomeSections = (v) => writeJson(SITEDATA_KEYS.homeSections, v);

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
          'Se fizer sentido, começamos. Uma ou duas sessões por semana, conforme combinarmos. Atendimento 100% online, em todo o Brasil.',
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
    modalities: ['Online · Brasil inteiro'],
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
      q: 'Você atende online em todo o Brasil?',
      a: 'Sim. Todo o atendimento é online — basta uma conexão estável e um lugar tranquilo. Atendo pessoas em qualquer estado do país e brasileiros vivendo no exterior.',
    },
    {
      q: 'Para quais públicos você atende?',
      a: 'Adolescentes (a partir de 14 anos, com consentimento dos responsáveis), adultos e idosos. Cada faixa etária tem suas particularidades, e ajusto o trabalho a quem está comigo.',
    },
    {
      q: 'Atendimento online funciona tão bem quanto presencial?',
      a: 'Sim. O vínculo clínico se estabelece pela palavra e pela continuidade — o essencial é a presença e o cuidado, não o espaço físico. A literatura clínica recente confirma a eficácia da psicoterapia online.',
    },
    {
      q: 'Quanto tempo dura o processo?',
      a: 'Depende do momento e do que aparece no trabalho. Pode ser meses, pode ser anos. O tempo é acompanhado, não prescrito.',
    },
    {
      q: 'Quais são as demandas mais comuns que você atende?',
      a: 'Ansiedade, questões de sentido, relacionamentos, sonhos recorrentes, crises de transição (adolescência, meia-idade, aposentadoria), luto, busca de autoconhecimento. Na primeira conversa avaliamos juntos se faz sentido para a abordagem.',
    },
    {
      q: 'O que é a abordagem junguiana?',
      a: 'É a psicologia analítica desenvolvida por Carl Gustav Jung. Trabalha com símbolos, sonhos, complexos e o processo de individuação — o caminho de tornar-se quem você verdadeiramente é. É uma escuta que valoriza o singular de cada vida.',
    },
    {
      q: 'E se eu precisar faltar?',
      a: 'Combinamos na primeira conversa. Há uma política simples de ausência, explicada antes de começarmos.',
    },
    {
      q: 'Como funciona o sigilo?',
      a: 'Absoluto, conforme o Código de Ética da profissão. Nada do que você trouxer sai daqui. Em casos de adolescente, o sigilo também é resguardado — converso com a família apenas o necessário e sempre com transparência prévia.',
    },
  ],
  schedule: {
    show: true,
    sectionLabel: 'Janelas de atendimento',
    note: 'Atendo de tarde para noite. Escolha o dia e horário que prefere — vamos combinar pelo WhatsApp.',
    // Janelas recorrentes por dia da semana (0=dom, 1=seg, ..., 6=sáb)
    windows: [
      { dow: 1, label: 'Segunda', startHour: 14, endHour: 21 },
      { dow: 2, label: 'Terça',   startHour: 14, endHour: 21 },
      { dow: 3, label: 'Quarta',  startHour: 14, endHour: 21 },
      { dow: 4, label: 'Quinta',  startHour: 14, endHour: 21 },
      { dow: 5, label: 'Sexta',   startHour: 14, endHour: 21 },
    ],
    stepHour: 1, // granularidade da grade: 1 = horários inteiros, 0.5 = de meia em meia
    // Slots recorrentemente ocupados (ex.: paciente fixo). Formato: "dow-hour" como string.
    blockedSlots: [],
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
    modalTitleStep2: 'Para qual público?',
    formats: ['Para mim (adulto)', 'Para um(a) adolescente', 'Para um(a) idoso(a)'],
    modalTitleStep3: 'Mensagem',
    messageTemplate:
      'Oi Gabriel, vim pelo seu site e gostaria de marcar uma primeira conversa online.\n\nMotivação: {{motivation}}\nPúblico: {{format}}{{slot}}\n\nAguardo retorno.',
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
   MATERIAIS · CATEGORIAS · TIPOS · PÁGINA
   - Categorias e tipos de conteúdo são listas gerenciáveis pelo admin
   - Defaults reproduzem o estado pré-2026-05-18 (livro/tema, resumo-mapa/resumo/mapa)
   - Página /materiais ganha textos editáveis (hero, explanation, catalog)
=================================================================== */

export const DEFAULT_CATEGORIES = [
  { slug: 'livro', label: 'Livros', singular: 'Livro', displayMode: 'full',    ordem: 0 },
  { slug: 'tema',  label: 'Temas',  singular: 'Tema',  displayMode: 'compact', ordem: 1 },
];

export const DEFAULT_CONTENT_TYPES = [
  { slug: 'resumo-mapa', label: 'Resumo + Mapa Mental', color: '#B48C50', ordem: 0 },
  { slug: 'resumo',      label: 'Apenas Resumo',         color: '#B8AD9E', ordem: 1 },
  { slug: 'mapa',        label: 'Mapa Mental',           color: '#B48C50', ordem: 2 },
];

export const DEFAULT_MATERIAIS_PAGE = {
  hero: {
    eyebrow: 'Catálogo · Resumos & Mapas Mentais',
    title: 'Materiais',
    emphasis: 'de estudo',
    kicker: 'Resumos e mapas no Obsidian',
    lead: 'Materiais que uso para estudar e ensinar — resumos, mapas e diagramas. Cada item indica seu formato.',
    primaryCtaLabel: 'Ir ao catálogo',
    primaryCtaHref: '#catalogo',
    secondaryCtaLabel: 'Ver cartografia',
    secondaryCtaHref: '/#cartografia',
  },
  explanation: {
    show: true,
    features: [
      { icon: 'graph',    title: 'Feitos no Obsidian',      body: 'Resumos interconectados com links entre conceitos.' },
      { icon: 'mindmap',  title: 'Mapas mentais completos', body: 'Diagramas detalhados — alguns bastam por si só.' },
      { icon: 'eye',      title: 'Percepção clínica',       body: 'Misturados com experiência de atendimento.' },
    ],
  },
  catalog: {
    sectionLabel: 'Catálogo',
    searchPlaceholder: 'Buscar…',
    emptyMessage: 'Nenhum material com esses filtros.',
    comingSoonLabel: 'Em breve',
    filterLabels: { category: 'Categoria', format: 'Formato', author: 'Autor', tags: 'Tags' },
  },
};

function normalizeCategories(stored) {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_CATEGORIES;
  return stored.map((c, i) => ({
    slug: c.slug ?? `cat-${i}`,
    label: c.label ?? 'Categoria',
    singular: c.singular ?? c.label ?? 'Item',
    displayMode: c.displayMode === 'full' ? 'full' : 'compact',
    ordem: typeof c.ordem === 'number' ? c.ordem : i,
  })).sort((a, b) => a.ordem - b.ordem);
}

function normalizeContentTypes(stored) {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_CONTENT_TYPES;
  return stored.map((t, i) => ({
    slug: t.slug ?? `tipo-${i}`,
    label: t.label ?? 'Tipo',
    color: t.color ?? '#B48C50',
    ordem: typeof t.ordem === 'number' ? t.ordem : i,
  })).sort((a, b) => a.ordem - b.ordem);
}

export const getCategories = () => normalizeCategories(readJson(SITEDATA_KEYS.categories, null));
export const setCategories = (v) => writeJson(SITEDATA_KEYS.categories, v);

export const getContentTypes = () => normalizeContentTypes(readJson(SITEDATA_KEYS.contentTypes, null));
export const setContentTypes = (v) => writeJson(SITEDATA_KEYS.contentTypes, v);

export const getMateriaisPage = () => {
  const stored = readJson(SITEDATA_KEYS.materiaisPage, null);
  if (!stored) return DEFAULT_MATERIAIS_PAGE;
  const hero = { ...DEFAULT_MATERIAIS_PAGE.hero, ...(stored.hero || {}) };
  const explanation = {
    ...DEFAULT_MATERIAIS_PAGE.explanation,
    ...(stored.explanation || {}),
    features: Array.isArray(stored.explanation?.features) && stored.explanation.features.length
      ? stored.explanation.features
      : DEFAULT_MATERIAIS_PAGE.explanation.features,
  };
  const catalog = {
    ...DEFAULT_MATERIAIS_PAGE.catalog,
    ...(stored.catalog || {}),
    filterLabels: { ...DEFAULT_MATERIAIS_PAGE.catalog.filterLabels, ...(stored.catalog?.filterLabels || {}) },
  };
  return { hero, explanation, catalog };
};
export const setMateriaisPage = (v) => writeJson(SITEDATA_KEYS.materiaisPage, v);

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
  { id: 'faq-clin-1', group: 'Clínica', question: 'Como é a primeira conversa?',
    answer: 'É uma conversa curta, sem compromisso. Serve para você me conhecer, me contar o que traz e avaliarmos juntos se faz sentido seguir. Marcamos pelo WhatsApp.' },
  { id: 'faq-clin-2', group: 'Clínica', question: 'Você atende online em todo o Brasil?',
    answer: 'Sim. Todo o atendimento é online, por videochamada — basta uma conexão estável e um lugar tranquilo. Atendo pessoas em qualquer estado do Brasil e brasileiros vivendo no exterior, em português.' },
  { id: 'faq-clin-3', group: 'Clínica', question: 'Para quais públicos você atende?',
    answer: 'Adolescentes a partir de 14 anos (com consentimento dos responsáveis), adultos e idosos. Cada faixa etária tem suas particularidades clínicas e o trabalho é ajustado a quem chega.' },
  { id: 'faq-clin-4', group: 'Clínica', question: 'Quanto tempo dura um processo de psicoterapia?',
    answer: 'Depende do momento e do que aparece no trabalho. Pode ser meses, pode ser anos. O tempo é acompanhado, não prescrito — não há promessa de prazo.' },
  { id: 'faq-abor-1', group: 'Abordagem', question: 'O que é psicoterapia analítica?',
    answer: 'Também conhecida como psicologia analítica ou abordagem junguiana, é a prática clínica desenvolvida a partir do trabalho de Carl Gustav Jung. Trabalha com símbolos, sonhos, complexos e o processo de individuação — o caminho de tornar-se quem você é.' },
  { id: 'faq-abor-2', group: 'Abordagem', question: 'Atendimento online funciona tão bem quanto presencial?',
    answer: 'Sim. O vínculo clínico se estabelece pela palavra e pela continuidade — o essencial é a presença e o cuidado, não o espaço físico. A literatura clínica recente é consistente em demonstrar a eficácia da psicoterapia online para a maioria das demandas.' },
  { id: 'faq-abor-3', group: 'Abordagem', question: 'Vocês fazem análise de sonhos?',
    answer: 'Sim, quando faz sentido. A análise de sonhos é uma das ferramentas centrais da psicologia analítica — não como decifração de manuais, mas como escuta cuidadosa do que o inconsciente está dizendo na sua linguagem própria.' },
  { id: 'faq-etic-1', group: 'Ética e sigilo', question: 'Como funciona o sigilo?',
    answer: 'Absoluto, conforme o Código de Ética da profissão. Nada do que você trouxer sai daqui. No atendimento de adolescente, o sigilo também é resguardado — converso com a família apenas o necessário e sempre com transparência prévia.' },
  { id: 'faq-etic-2', group: 'Ética e sigilo', question: 'Você é psicólogo formado?',
    answer: 'Ainda não. Atendo como estagiário de psicologia em estágio clínico supervisionado pela Associação Allos. Ao concluir a graduação e obter registro no CRP, esta indicação será atualizada.' },
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
  whatsappMessage: 'Oi Gabriel, vim pelo seu site e gostaria de marcar uma primeira conversa online.',
  instagramLink: 'https://instagram.com/psiangelo',
  youtubeLink: '',
  emailAddress: '',
  siteTitle: 'Psiangelo — Psicoterapia Junguiana Online',
  siteDescription: 'Psicoterapia analítica online em abordagem junguiana — adolescentes, adultos e idosos, em todo o Brasil.',
  accentColor: '#B48C50',
};

export const getSettings = () => {
  const stored = readJson(SITEDATA_KEYS.settings, null);
  if (!stored) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...stored };
};
export const setSettings = (v) => writeJson(SITEDATA_KEYS.settings, v);

/* ===================================================================
   GLOSSÁRIO — verbetes, categorias e textos da página /glossario
   Defaults: importados de src/data/glossario.js (mantém SSG do build)
=================================================================== */

import { glossario as GLOSSARIO_DEFAULT, CATEGORIES as GLOSSARIO_CATEGORIES_DEFAULT } from '@/data/glossario';

// Categorias do glossário viram lista gerenciável (label + slug + ordem)
export const DEFAULT_GLOSSARIO_CATEGORIES = Object.entries(GLOSSARIO_CATEGORIES_DEFAULT).map(([slug, info], i) => ({
  slug,
  label: info.label,
  tone: info.tone,
  ordem: i,
}));

function normalizeGlossarioCategories(stored) {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_GLOSSARIO_CATEGORIES;
  return stored.map((c, i) => ({
    slug: c.slug ?? `cat-${i}`,
    label: c.label ?? 'Categoria',
    tone: c.tone ?? 'accent',
    ordem: typeof c.ordem === 'number' ? c.ordem : i,
  })).sort((a, b) => a.ordem - b.ordem);
}

export const getGlossarioCategories = () =>
  normalizeGlossarioCategories(readJson(SITEDATA_KEYS.glossarioCategories, null));
export const setGlossarioCategories = (v) => writeJson(SITEDATA_KEYS.glossarioCategories, v);

// Verbete: defaults + campos novos opcionais (`links`, `hidden`).
function normalizeGlossario(stored) {
  const base = Array.isArray(stored) && stored.length > 0 ? stored : GLOSSARIO_DEFAULT;
  return base.map((g, i) => ({
    slug: g.slug ?? `verbete-${i}`,
    term: g.term ?? 'Verbete',
    aliases: Array.isArray(g.aliases) ? g.aliases : [],
    category: g.category ?? 'estrutura',
    short: g.short ?? '',
    full: g.full ?? '',
    related: {
      terms: g.related?.terms ?? [],
      materials: g.related?.materials ?? [],
    },
    links: Array.isArray(g.links) ? g.links : [],  // [{kind, value, label}]
    hidden: !!g.hidden,
    ordem: typeof g.ordem === 'number' ? g.ordem : i,
  }));
}

export const getGlossario = () => normalizeGlossario(readJson(SITEDATA_KEYS.glossario, null));
export const setGlossario = (v) => writeJson(SITEDATA_KEYS.glossario, v);

// Textos da página /glossario (hero + intro)
export const DEFAULT_GLOSSARIO_PAGE = {
  hero: {
    eyebrow: 'Vocabulário · Psicologia Analítica',
    title: 'Glossário',
    emphasis: 'junguiano',
    kicker: 'Conceitos essenciais, interligados',
    lead: 'Termos fundamentais — Self, Sombra, Individuação, Arquétipo, Sincronicidade — com definições claras e links entre ideias.',
  },
  empty: {
    sectionLabel: 'Categorias',
    emptyMessage: 'Nenhum verbete ainda.',
  },
};

export const getGlossarioPage = () => {
  const stored = readJson(SITEDATA_KEYS.glossarioPage, null);
  if (!stored) return DEFAULT_GLOSSARIO_PAGE;
  return {
    hero: { ...DEFAULT_GLOSSARIO_PAGE.hero, ...(stored.hero || {}) },
    empty: { ...DEFAULT_GLOSSARIO_PAGE.empty, ...(stored.empty || {}) },
  };
};
export const setGlossarioPage = (v) => writeJson(SITEDATA_KEYS.glossarioPage, v);

/* ===================================================================
   /ESTUDOS — hub editorial (segunda home para quem quer estudar)
   Estrutura por blocos reordenáveis, com seleção de conteúdo por bloco.
=================================================================== */

export const ESTUDOS_BLOCK_TYPES = [
  { id: 'hero',        label: 'Hero (topo)' },
  { id: 'trilhas',     label: 'Trilhas em destaque' },
  { id: 'glossario',   label: 'Glossário em destaque' },
  { id: 'materiais',   label: 'Materiais recomendados' },
  { id: 'cursos',      label: 'Cursos recomendados' },
  { id: 'blog',        label: 'Posts do blog selecionados' },
  { id: 'cartografia', label: 'Cartografia de conceitos' },
  { id: 'manifesto',   label: 'Bússola de estudos (texto livre)' },
];

export const DEFAULT_ESTUDOS_PAGE = {
  hero: {
    eyebrow: 'Sala de estudos',
    title: 'Estudos',
    emphasis: 'em psicologia analítica',
    kicker: 'Por onde começar, o que ler, em que ordem',
    lead: 'Curadoria do que publico aqui — trilhas, verbetes, materiais e ensaios — pensada para quem está chegando ou para quem quer aprofundar.',
    primaryCtaLabel: 'Começar uma trilha',
    primaryCtaHref: '#trilhas',
    secondaryCtaLabel: 'Ver glossário',
    secondaryCtaHref: '/glossario',
  },
  blocks: [
    { id: 'hero',      visible: true,  config: {} },
    { id: 'manifesto', visible: false, config: { title: 'Como estudar Jung', body: '' } },
    { id: 'trilhas',   visible: true,  config: { title: 'Trilhas', subtitle: 'Sequências curadas — por onde começar.', selected: [] } },
    { id: 'glossario', visible: true,  config: { title: 'Glossário em foco', subtitle: 'Verbetes-chave para começar.', selected: [], limit: 8 } },
    { id: 'materiais', visible: true,  config: { title: 'Materiais', subtitle: 'Resumos, mapas e ensaios.', selected: [], limit: 6 } },
    { id: 'cursos',    visible: false, config: { title: 'Cursos', subtitle: 'Formação aprofundada.', selected: [] } },
    { id: 'blog',      visible: true,  config: { title: 'Ensaios', subtitle: 'Textos sobre clínica e símbolos.', selected: [], limit: 4 } },
    { id: 'cartografia', visible: false, config: { title: 'Cartografia', subtitle: 'Mapa dos conceitos centrais e suas conexões.', source: 'home' } },
  ],
};

function normalizeEstudosPage(stored) {
  if (!stored) return DEFAULT_ESTUDOS_PAGE;
  const hero = { ...DEFAULT_ESTUDOS_PAGE.hero, ...(stored.hero || {}) };
  const knownIds = new Set(ESTUDOS_BLOCK_TYPES.map((b) => b.id));
  const storedBlocks = Array.isArray(stored.blocks) ? stored.blocks : [];
  const seen = new Set();
  const blocks = [];
  // 1) preserva ordem do admin
  for (const b of storedBlocks) {
    if (!b?.id || !knownIds.has(b.id) || seen.has(b.id)) continue;
    seen.add(b.id);
    const def = DEFAULT_ESTUDOS_PAGE.blocks.find((d) => d.id === b.id);
    blocks.push({
      id: b.id,
      visible: typeof b.visible === 'boolean' ? b.visible : (def?.visible ?? true),
      config: { ...(def?.config || {}), ...(b.config || {}) },
    });
  }
  // 2) adiciona blocos novos do default que ainda não estavam salvos
  for (const def of DEFAULT_ESTUDOS_PAGE.blocks) {
    if (seen.has(def.id)) continue;
    blocks.push({ ...def });
  }
  return { hero, blocks };
}

export const getEstudosPage = () => normalizeEstudosPage(readJson(SITEDATA_KEYS.estudosPage, null));
export const setEstudosPage = (v) => writeJson(SITEDATA_KEYS.estudosPage, v);
