/**
 * trilhaIcons — vocabulário de ícones cerimoniais usados em /estudos
 *
 * No Bloco 1 só carrega a LISTA de slugs disponíveis (pro admin escolher).
 * No Bloco 2 cada slug ganha um SVG dedicado em src/components/estudos/icons.jsx.
 *
 * Trilha = passagem / arquétipo do caminho   (compass, spiral, gate, ...)
 * Etapa  = ato / modalidade da prática       (book, map, video, ritual, ...)
 *
 * `ALL_ICON_SLUGS` é a união sem duplicatas — útil pra dropdowns mistos.
 */

export const TRILHA_ICON_SLUGS = [
  'compass',
  'spiral',
  'flame',
  'eye',
  'key',
  'mountain',
  'bridge',
  'vessel',
  'labyrinth',
  'sun',
  'moon',
  'tree',
  'anchor',
  'star',
  'gate',
  'mirror',
];

export const STAGE_ICON_SLUGS = [
  'book',
  'map',
  'video',
  'essay',
  'quote',
  'headphones',
  'cartography',
  'ritual',
  'scroll',
  'lantern',
  'threshold',
];

export const ALL_ICON_SLUGS = Array.from(new Set([...TRILHA_ICON_SLUGS, ...STAGE_ICON_SLUGS]));

/** Mapeia o `kind` antigo da etapa pro ícone novo. */
export const KIND_TO_ICON = {
  livro:   'book',
  leitura: 'scroll',
  mapa:    'map',
  curso:   'ritual',
  ensaio:  'essay',
  video:   'video',
  extra:   'star',
};

export function defaultIconForKind(kind) {
  return KIND_TO_ICON[kind] || 'book';
}

export const DEFAULT_TRILHA_ICON = 'compass';
export const DEFAULT_STAGE_ICON  = 'book';

/** Rótulo amigável pra mostrar no admin (humanização do slug). */
const LABELS = {
  compass: 'Bússola',
  spiral: 'Espiral',
  flame: 'Chama',
  eye: 'Olho',
  key: 'Chave',
  mountain: 'Montanha',
  bridge: 'Ponte',
  vessel: 'Vaso',
  labyrinth: 'Labirinto',
  sun: 'Sol',
  moon: 'Lua',
  tree: 'Árvore',
  anchor: 'Âncora',
  star: 'Estrela',
  gate: 'Portal',
  mirror: 'Espelho',
  book: 'Livro',
  map: 'Mapa',
  video: 'Vídeo',
  essay: 'Ensaio',
  quote: 'Citação',
  headphones: 'Fones',
  cartography: 'Cartografia',
  ritual: 'Ritual',
  scroll: 'Pergaminho',
  lantern: 'Lanterna',
  threshold: 'Limiar',
};

export function iconLabel(slug) {
  return LABELS[slug] || slug;
}
