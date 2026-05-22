/**
 * Paleta de cores ("accents") dos cards do /bio.
 * Cada accent tem 3 cores: flat (corpo do card), media1 (escuro da mídia) e
 * media2 (claro da mídia) — usadas pelo CSS em bio-cards.css via data-accent.
 *
 * As cores estão duplicadas aqui em JS pra renderizar os swatches do picker
 * no admin sem precisar parsear o CSS. Se mexer no bio-cards.css, atualizar
 * aqui também (e vice-versa).
 */

export const BIO_ACCENTS = [
  {
    value: 'gold',
    label: 'Ouro',
    description: 'dourado clássico, signature',
    flat: '#F4E4B8',
    media1: '#2A1A06',
    media2: '#6E5530',
  },
  {
    value: 'sepia',
    label: 'Sépia',
    description: 'bronze acinzentado, antigo',
    flat: '#E5D5A8',
    media1: '#2E1F12',
    media2: '#6E5530',
  },
  {
    value: 'cream',
    label: 'Pergaminho',
    description: 'creme luminoso, papel',
    flat: '#EDDFC2',
    media1: '#1E1408',
    media2: '#6E5530',
  },
  {
    value: 'rubedo',
    label: 'Rubedo',
    description: 'vermelho alquímico discreto',
    flat: '#F0D2C6',
    media1: '#3D1108',
    media2: '#8B3A2E',
  },
  {
    value: 'ink',
    label: 'Nigredo',
    description: 'preto profundo, mídia dourada (inversão)',
    flat: '#1A1714',
    media1: '#B48C50',
    media2: '#D4A853',
  },
  {
    value: 'albedo',
    label: 'Albedo',
    description: 'marfim luminoso, contemplativo',
    flat: '#F4ECD5',
    media1: '#2E2418',
    media2: '#6E5A40',
  },
  {
    value: 'citrinit',
    label: 'Citrinit',
    description: 'amarelo cítrico, solar',
    flat: '#F4D88A',
    media1: '#4A3208',
    media2: '#8B6F1E',
  },
  {
    value: 'bronze',
    label: 'Bronze',
    description: 'metálico antigo, terroso',
    flat: '#C9A678',
    media1: '#1A0F06',
    media2: '#543820',
  },
  {
    value: 'olive',
    label: 'Oliva',
    description: 'verde-oliva apagado, lúgubre',
    flat: '#D5CCA8',
    media1: '#2A2E14',
    media2: '#5C5230',
  },
  {
    value: 'wine',
    label: 'Vinho',
    description: 'rosa-vinho desbotado, tinto',
    flat: '#D9B8B0',
    media1: '#2A0A0C',
    media2: '#6E1F1E',
  },
];

export const BIO_ACCENT_VALUES = new Set(BIO_ACCENTS.map((a) => a.value));

// Ciclo padrão usado quando o link não tem accent escolhido (intercala
// cards claros e o ink escuro pra dar contraste rítmico).
export const BIO_ACCENT_CYCLE = [
  'gold',
  'cream',
  'sepia',
  'rubedo',
  'ink',
  'albedo',
  'citrinit',
  'bronze',
  'olive',
  'wine',
];

export function accentByValue(value) {
  return BIO_ACCENTS.find((a) => a.value === value) || null;
}
