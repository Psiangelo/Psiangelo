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

export const SITEDATA_KEYS = {
  trilhas:    'angelo_admin_trilhas',
  cartoNodes: 'angelo_admin_cartography_nodes',
  cartoEdges: 'angelo_admin_cartography_edges',
  homepage:   'angelo_admin_homepage',
  bio:        'angelo_admin_bio',
  visibility: 'angelo_admin_visibility',
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
    titleEmphasis: 'ângelo',
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
};

export const DEFAULT_BIO = {
  name: 'Psiângelo',
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
