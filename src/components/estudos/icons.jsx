/**
 * icons.jsx — biblioteca de ícones cerimoniais usados em /estudos.
 *
 * Cada ícone:
 *  - viewBox 24x24, fill=none, stroke=currentColor, strokeWidth dinâmico
 *  - strokeLinecap/Linejoin=round
 *  - Sem 'use client': render puro de SVG, safe em server e client components
 *
 * Quando o `name` não existe, cai no ícone `compass` como fallback silencioso.
 *
 * Uso:
 *   <TrilhaIcon name="compass" size={32} />
 *   <IconSeal name="vessel" size={72} color="#B48C50" />
 */

/* ---------- Trilhas (passagem / arquétipo do caminho) ---------- */

const COMPASS = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 4 L13.6 12 L12 13.5 L10.4 12 Z" fill="currentColor" />
    <path d="M10.4 12 L12 20 L13.6 12 L12 10.5 Z" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </>
);

const SPIRAL = (
  <path d="M19 12 a7 7 0 1 0 -7 7 m0 -2 a5 5 0 1 1 5 -5 m-2 0 a3 3 0 1 0 -3 3 m0 -2 a1.1 1.1 0 1 1 1.1 -1.1" />
);

const FLAME = (
  <>
    <path d="M12 21.5 c-4 0 -6 -3 -6 -6.2 c0 -2.6 1.8 -4 2.7 -6.3 c0.4 1.4 1.6 2 2 3.2 c1 -2.3 0.6 -4.4 -0.4 -6.2 c4.4 1.2 6.5 5.8 6.5 9.3 c0 3.2 -1.8 6.2 -4.8 6.2 z" />
    <path d="M12 18.5 c-1.5 0 -2.3 -1.2 -2.3 -2.4 c0 -1 0.7 -1.5 1 -2.4 c0.2 0.5 0.6 0.8 0.7 1.2 c0.4 -0.9 0.2 -1.7 -0.1 -2.4 c1.6 0.5 2.4 2.2 2.4 3.6 c0 1.3 -0.7 2.4 -1.7 2.4 z" />
  </>
);

const EYE = (
  <>
    <path d="M2.5 12 c3.5 -6.5 16 -6.5 19 0 c-3.5 6.5 -16 6.5 -19 0 z" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </>
);

const KEY = (
  <>
    <circle cx="8" cy="12" r="4" />
    <circle cx="8" cy="12" r="1.2" fill="currentColor" />
    <path d="M12 12 L21 12 M21 12 L21 15 M18 12 L18 14.5" />
  </>
);

const MOUNTAIN = (
  <>
    <path d="M2.5 19.5 L8.5 9 L13 15 L17 7 L21.5 19.5 Z" />
    <path d="M7 13 L8.5 11.5 L10 13" />
    <circle cx="17" cy="7" r="0" fill="currentColor" />
  </>
);

const BRIDGE = (
  <>
    <path d="M3 13.5 c3 -8 15 -8 18 0" />
    <path d="M3 13.5 L3 20 M21 13.5 L21 20" />
    <path d="M3 20 L21 20" />
    <path d="M9 11 L9 16 M15 11 L15 16 M12 9.5 L12 16" />
  </>
);

const VESSEL = (
  <>
    <path d="M7.5 4 L16.5 4 L15.5 9.5 c0 3.5 -2 5.5 -3.5 5.5 c-1.5 0 -3.5 -2 -3.5 -5.5 Z" />
    <path d="M12 15 L12 20" />
    <path d="M9 20 L15 20" />
    <path d="M10 7 L14 7" strokeOpacity="0.5" />
  </>
);

const LABYRINTH = (
  <>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M3 12 L9 12 L9 6 L15 6 L15 18 L6 18" />
    <path d="M21 12 L13 12 L13 9 L17 9 L17 21" strokeOpacity="0.7" />
  </>
);

const SUN = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5 L12 5 M12 19 L12 21.5 M2.5 12 L5 12 M19 12 L21.5 12" />
    <path d="M5.3 5.3 L7 7 M17 17 L18.7 18.7 M18.7 5.3 L17 7 M7 17 L5.3 18.7" />
  </>
);

const MOON = (
  <path d="M20 13.5 A8 8 0 1 1 10.5 4 A6.2 6.2 0 0 0 20 13.5 z" />
);

const TREE = (
  <>
    <path d="M12 22 L12 14" />
    <path d="M12 15 c-5.2 0 -6.5 -4.5 -3.5 -7.5 c0.5 -3.5 6 -3.5 7 0 c3 3 1.7 7.5 -3.5 7.5 z" />
    <path d="M9 22 L15 22" />
  </>
);

const ANCHOR = (
  <>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7 L12 20" />
    <path d="M8 11 L16 11" />
    <path d="M5 16 c0 3.5 3.5 4.5 7 4.5 c3.5 0 7 -1 7 -4.5" />
  </>
);

const STAR = (
  <polygon points="12,2.5 14.7,9.5 22,9.7 16.2,14 18.3,21 12,16.8 5.7,21 7.8,14 2,9.7 9.3,9.5" />
);

const GATE = (
  <>
    <path d="M5 21 L5 12 A7 7 0 0 1 19 12 L19 21" />
    <path d="M3.5 21 L20.5 21" />
    <path d="M12 5 L12 21" />
    <path d="M8.5 12 L8.5 13.5 M15.5 12 L15.5 13.5" />
  </>
);

const MIRROR = (
  <>
    <circle cx="12" cy="9" r="6" />
    <circle cx="12" cy="9" r="3.5" strokeOpacity="0.4" />
    <path d="M9 14.5 L7 21 M15 14.5 L17 21" />
    <path d="M6.5 21 L17.5 21" />
  </>
);

/* ---------- Etapas (ato / modalidade da prática) ---------- */

const BOOK = (
  <>
    <path d="M3 5 c3 0 6 1 9 3 c3 -2 6 -3 9 -3 L21 19 c-3 0 -6 1 -9 3 c-3 -2 -6 -3 -9 -3 Z" />
    <path d="M12 8 L12 22" />
  </>
);

const MAP = (
  <>
    <path d="M3 6 L9 4 L15 6 L21 4 L21 18 L15 20 L9 18 L3 20 Z" />
    <path d="M9 4 L9 18 M15 6 L15 20" />
  </>
);

const VIDEO = (
  <>
    <circle cx="12" cy="12" r="9" />
    <polygon points="10,8 16.5,12 10,16" fill="currentColor" />
  </>
);

const ESSAY = (
  <>
    <rect x="5" y="3" width="14" height="18" rx="0.5" />
    <path d="M8 8 L16 8 M8 12 L16 12 M8 16 L13 16" />
  </>
);

const QUOTE = (
  <>
    <path d="M5 14 L5 11 c0 -2.2 1.8 -3.5 4 -3.5 L9 9.5 c-1.2 0 -2 0.7 -2 1.5 L9 11 L9 14 Z" />
    <path d="M14 14 L14 11 c0 -2.2 1.8 -3.5 4 -3.5 L18 9.5 c-1.2 0 -2 0.7 -2 1.5 L18 11 L18 14 Z" />
  </>
);

const HEADPHONES = (
  <>
    <path d="M4 14 L4 12 a8 8 0 0 1 16 0 L20 14" />
    <rect x="3" y="14" width="4" height="6" rx="1" />
    <rect x="17" y="14" width="4" height="6" rx="1" />
  </>
);

const CARTOGRAPHY = (
  <>
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="5" cy="6" r="1.5" />
    <circle cx="19" cy="7" r="1.5" />
    <circle cx="6" cy="18.5" r="1.5" />
    <circle cx="18.5" cy="17.5" r="1.5" />
    <path d="M6.2 7 L10.2 10.8 M17.7 8 L13.8 10.8 M7 17 L10.5 13.2 M17 16.5 L13.6 13.2" strokeOpacity="0.6" />
  </>
);

const RITUAL = (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12" />
  </>
);

const SCROLL = (
  <>
    <path d="M6 3 c-2 0 -2 4 0 4 L17 7 c2 0 2 -4 0 -4 Z" />
    <path d="M6 7 L6 19 c0 1.5 1.5 3 3 3 L18 22 c-2 0 -3 -1.5 -3 -3 L15 7" />
    <path d="M9 11 L13 11 M9 15 L13 15" strokeOpacity="0.6" />
  </>
);

const LANTERN = (
  <>
    <rect x="6.5" y="6.5" width="11" height="13" rx="5.5" />
    <path d="M6.5 11 L17.5 11 M6.5 15.5 L17.5 15.5" strokeOpacity="0.7" />
    <path d="M12 3 L12 6.5 M12 19.5 L12 22" />
  </>
);

const THRESHOLD = (
  <>
    <path d="M5 3 L5 21 L11 19.5 L11 4.5 Z" />
    <path d="M14 4.5 L20 3 L20 21 L14 19.5 Z" />
    <circle cx="9.5" cy="12" r="0.6" fill="currentColor" />
    <circle cx="15.5" cy="12" r="0.6" fill="currentColor" />
  </>
);

/* ---------- Mapa nome → JSX + rótulo ---------- */

const ICON_PATHS = {
  // Trilhas
  compass: COMPASS,
  spiral: SPIRAL,
  flame: FLAME,
  eye: EYE,
  key: KEY,
  mountain: MOUNTAIN,
  bridge: BRIDGE,
  vessel: VESSEL,
  labyrinth: LABYRINTH,
  sun: SUN,
  moon: MOON,
  tree: TREE,
  anchor: ANCHOR,
  star: STAR,
  gate: GATE,
  mirror: MIRROR,
  // Etapas
  book: BOOK,
  map: MAP,
  video: VIDEO,
  essay: ESSAY,
  quote: QUOTE,
  headphones: HEADPHONES,
  cartography: CARTOGRAPHY,
  ritual: RITUAL,
  scroll: SCROLL,
  lantern: LANTERN,
  threshold: THRESHOLD,
};

export const AVAILABLE_ICONS = Object.keys(ICON_PATHS);

/**
 * <TrilhaIcon name="compass" size={32} strokeWidth={1.5} ariaLabel="..." />
 *
 * Sem 'use client' — pode ser usado em RSC, em rotas SSG, em e-mails de OG, etc.
 * Decorativo por padrão (aria-hidden); passe `ariaLabel` para semantizar.
 */
export default function TrilhaIcon({
  name,
  size = 24,
  strokeWidth,
  className = '',
  style,
  ariaLabel,
}) {
  const paths = ICON_PATHS[name] || ICON_PATHS.compass;
  // Stroke afina sutilmente em tamanhos grandes pra não engrossar visualmente
  const sw = strokeWidth ?? (size >= 64 ? 1.3 : size >= 32 ? 1.5 : 1.6);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-label={ariaLabel || undefined}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? 'img' : undefined}
    >
      {paths}
    </svg>
  );
}

/**
 * <IconSeal name="vessel" size={72} color="#B48C50" />
 *
 * Wrapper circular pronto pros heros das trilhas/etapas (Bloco 3+).
 * Borda dupla discreta + ícone centralizado. Cor opcional (default currentColor).
 */
export function IconSeal({
  name,
  size = 64,
  color,
  ringWidth = 1.5,
  className = '',
  style,
}) {
  const sealStyle = {
    width: size,
    height: size,
    color: color || 'currentColor',
    borderColor: color ? `${color}66` : 'currentColor',
    boxShadow: color ? `inset 0 0 0 1px ${color}22` : undefined,
    borderWidth: ringWidth,
    ...style,
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${className}`}
      style={sealStyle}
    >
      <TrilhaIcon name={name} size={Math.round(size * 0.52)} strokeWidth={1.3} />
    </span>
  );
}
