'use client';

/**
 * Biblioteca de SVGs ilustrativos pros cards do /bio.
 *
 * Anatomia inspirada nos cards do /bio da Tulipa (SVG no topo do card "rich"),
 * mas com vocabulário visual do Psiangelo: hermético-alquímico em paleta
 * dourado · sépia · creme, sem rose/sage/violet.
 *
 * Cada SVG é 100x100, currentColor-aware quando faz sentido, e usa gradients
 * estáticos pra evocar selo metálico/pergaminho. Renderizar dentro de uma
 * .bio-card__media (relação ~ 16:10) que esmaece pro fundo do card.
 */

// Paleta de referência (igual ao tailwind config):
//   gold-bright (citrinit) #D4A853
//   gold         (accent)  #B48C50
//   gold-soft             #9A7A48
//   gold-deep             #6E5530
//   sepia       (text)     #B8AD9E
//   sepia-bright (albedo)  #E8DDD0
//   ink         (nigredo)  #1C1410
//   bg-card                #1A1714

const MANDALA = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioMandalaGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#D4A853" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#bioMandalaGlow)" />
    <g fill="none" stroke="#B48C50" strokeWidth="0.6" opacity="0.9">
      <circle cx="50" cy="50" r="42" strokeWidth="0.35" />
      <circle cx="50" cy="50" r="34" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="24" />
      <circle cx="50" cy="50" r="12" strokeWidth="0.8" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x1 = 50 + Math.cos(angle) * 24;
        const y1 = 50 + Math.sin(angle) * 24;
        const x2 = 50 + Math.cos(angle) * 42;
        const y2 = 50 + Math.sin(angle) * 42;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={i % 4 === 0 ? 0.7 : 0.3}
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const cx = 50 + Math.cos(angle) * 18;
        const cy = 50 + Math.sin(angle) * 18;
        return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#D4A853" stroke="none" />;
      })}
    </g>
    <circle cx="50" cy="50" r="2.5" fill="#D4A853" />
  </svg>
);

const BOOK = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bioBookGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D4A853" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#6E5530" stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <path
      d="M22 22 C 36 18 46 22 50 28 L50 84 C 46 78 36 74 22 78 Z"
      fill="url(#bioBookGold)"
      stroke="#E8DDD0"
      strokeWidth="0.5"
      strokeOpacity="0.6"
    />
    <path
      d="M78 22 C 64 18 54 22 50 28 L50 84 C 54 78 64 74 78 78 Z"
      fill="url(#bioBookGold)"
      stroke="#E8DDD0"
      strokeWidth="0.5"
      strokeOpacity="0.6"
    />
    <line x1="50" y1="28" x2="50" y2="84" stroke="#1C1410" strokeWidth="0.8" opacity="0.6" />
    <g stroke="#E8DDD0" strokeWidth="0.8" strokeOpacity="0.55" fill="none" strokeLinecap="round">
      <path d="M30 36 L44 34 M30 44 L44 42 M30 52 L42 50 M30 60 L43 58" />
      <path d="M56 34 L70 36 M58 42 L70 44 M58 50 L68 52 M58 58 L70 60" />
    </g>
    <g fill="#E8DDD0" opacity="0.85">
      <circle cx="50" cy="40" r="1.2" />
      <circle cx="50" cy="56" r="1.2" />
      <circle cx="50" cy="72" r="1.2" />
    </g>
  </svg>
);

const WHATSAPP = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioWaGlow" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#E8DDD0" stopOpacity="0.92" />
        <stop offset="100%" stopColor="#B48C50" stopOpacity="0.9" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="34" fill="url(#bioWaGlow)" stroke="#1C1410" strokeWidth="0.8" />
    <path
      d="M38 36 C 36 38 35 42 36 46 C 38 54 46 62 54 64 C 58 65 62 64 64 62 L62 56 L56 58 C 54 56 50 52 48 50 L50 44 L46 38 Z"
      fill="#1C1410"
      opacity="0.85"
    />
    <circle cx="50" cy="50" r="34" fill="none" stroke="#D4A853" strokeWidth="0.4" opacity="0.6" />
  </svg>
);

const STAR = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioStarG" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#B48C50" />
      </radialGradient>
    </defs>
    <g transform="translate(50 50)">
      <path
        d="M0 -34 L9 -10 L34 -8 L14 6 L20 30 L0 16 L-20 30 L-14 6 L-34 -8 L-9 -10 Z"
        fill="url(#bioStarG)"
        stroke="#1C1410"
        strokeWidth="0.6"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M0 -22 L6 -6 L22 -4 L9 4 L13 20 L0 10 L-13 20 L-9 4 L-22 -4 L-6 -6 Z"
        fill="#1C1410"
        opacity="0.35"
      />
    </g>
  </svg>
);

const FEATHER = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bioFeatherG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8DDD0" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#9A7A48" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path
      d="M28 76 L66 30 C 76 20 84 22 84 32 C 84 48 70 64 50 70 L30 76 Z"
      fill="url(#bioFeatherG)"
      stroke="#1C1410"
      strokeWidth="0.6"
    />
    <g stroke="#1C1410" strokeWidth="0.4" opacity="0.45" fill="none">
      <path d="M52 38 L40 70" />
      <path d="M58 32 L46 72" />
      <path d="M64 28 L52 72" />
      <path d="M70 26 L60 70" />
    </g>
    <line
      x1="30"
      y1="74"
      x2="22"
      y2="86"
      stroke="#1C1410"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

const COMPASS = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioCompassG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1C1410" stopOpacity="0" />
        <stop offset="100%" stopColor="#1C1410" stopOpacity="0.7" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="34" fill="#1A1714" stroke="#B48C50" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="34" fill="url(#bioCompassG)" />
    <circle cx="50" cy="50" r="28" fill="none" stroke="#B48C50" strokeWidth="0.4" opacity="0.5" />
    {/* tics dos 4 pontos cardeais */}
    <g stroke="#D4A853" strokeWidth="1.4" strokeLinecap="round">
      <line x1="50" y1="20" x2="50" y2="26" />
      <line x1="50" y1="74" x2="50" y2="80" />
      <line x1="20" y1="50" x2="26" y2="50" />
      <line x1="74" y1="50" x2="80" y2="50" />
    </g>
    {/* tics diagonais */}
    <g stroke="#B48C50" strokeWidth="0.6" strokeLinecap="round" opacity="0.6">
      <line x1="30" y1="30" x2="34" y2="34" />
      <line x1="70" y1="30" x2="66" y2="34" />
      <line x1="30" y1="70" x2="34" y2="66" />
      <line x1="70" y1="70" x2="66" y2="66" />
    </g>
    {/* agulha */}
    <path d="M50 28 L54 50 L50 72 L46 50 Z" fill="#D4A853" stroke="#1C1410" strokeWidth="0.4" />
    <path d="M50 28 L54 50 L50 50 Z" fill="#E8DDD0" opacity="0.9" />
    <circle cx="50" cy="50" r="3" fill="#1C1410" stroke="#D4A853" strokeWidth="0.6" />
  </svg>
);

const KEY = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bioKeyG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="60%" stopColor="#B48C50" />
        <stop offset="100%" stopColor="#6E5530" />
      </linearGradient>
    </defs>
    {/* aro */}
    <circle cx="30" cy="50" r="16" fill="none" stroke="url(#bioKeyG)" strokeWidth="4" />
    <circle cx="30" cy="50" r="8" fill="#1A1714" stroke="#B48C50" strokeWidth="0.6" />
    <circle cx="30" cy="50" r="3" fill="#D4A853" />
    {/* haste */}
    <rect x="46" y="48" width="34" height="4" fill="url(#bioKeyG)" />
    {/* dentes */}
    <rect x="62" y="52" width="4" height="8" fill="url(#bioKeyG)" />
    <rect x="70" y="52" width="4" height="6" fill="url(#bioKeyG)" />
    <rect x="76" y="52" width="4" height="9" fill="url(#bioKeyG)" />
  </svg>
);

const EYE = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioEyeIris" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1C1410" />
        <stop offset="60%" stopColor="#6E5530" />
        <stop offset="100%" stopColor="#D4A853" />
      </radialGradient>
      <radialGradient id="bioEyeWhite" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#B8AD9E" />
      </radialGradient>
    </defs>
    <path
      d="M14 50 C 28 30 72 30 86 50 C 72 70 28 70 14 50 Z"
      fill="url(#bioEyeWhite)"
      stroke="#1C1410"
      strokeWidth="0.8"
    />
    <circle cx="50" cy="50" r="14" fill="url(#bioEyeIris)" />
    <circle cx="50" cy="50" r="5" fill="#1C1410" />
    <circle cx="46" cy="46" r="2" fill="#E8DDD0" opacity="0.85" />
    {/* raios sutis */}
    <g stroke="#B48C50" strokeWidth="0.5" strokeLinecap="round" opacity="0.7">
      <line x1="50" y1="16" x2="50" y2="22" />
      <line x1="50" y1="78" x2="50" y2="84" />
      <line x1="20" y1="32" x2="24" y2="36" />
      <line x1="80" y1="32" x2="76" y2="36" />
      <line x1="20" y1="68" x2="24" y2="64" />
      <line x1="80" y1="68" x2="76" y2="64" />
    </g>
  </svg>
);

const LUNAR = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioLuna" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#9A7A48" />
      </radialGradient>
    </defs>
    <path
      d="M62 18 C 38 22 22 38 22 60 C 22 74 30 84 44 86 C 30 78 26 64 30 50 C 36 32 50 22 62 18 Z"
      fill="url(#bioLuna)"
      stroke="#1C1410"
      strokeWidth="0.6"
    />
    {/* estrelas sutis */}
    <g fill="#D4A853" opacity="0.85">
      <circle cx="72" cy="32" r="1.3" />
      <circle cx="80" cy="50" r="1" />
      <circle cx="68" cy="68" r="1.2" />
      <path
        d="M76 22 L77 26 L81 26 L78 28 L79 32 L76 30 L73 32 L74 28 L71 26 L75 26 Z"
        opacity="0.65"
      />
    </g>
  </svg>
);

const SOLAR = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioSol" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="60%" stopColor="#D4A853" />
        <stop offset="100%" stopColor="#6E5530" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="20" fill="url(#bioSol)" stroke="#1C1410" strokeWidth="0.7" />
    <g stroke="#D4A853" strokeWidth="1.6" strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 50 + Math.cos(a) * 26;
        const y1 = 50 + Math.sin(a) * 26;
        const x2 = 50 + Math.cos(a) * (i % 2 === 0 ? 36 : 32);
        const y2 = 50 + Math.sin(a) * (i % 2 === 0 ? 36 : 32);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
    <circle cx="50" cy="50" r="6" fill="#1C1410" opacity="0.7" />
    <circle cx="50" cy="50" r="2" fill="#D4A853" />
  </svg>
);

const COLUMN = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bioCol" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6E5530" />
        <stop offset="50%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#6E5530" />
      </linearGradient>
    </defs>
    {/* capitel */}
    <rect x="30" y="18" width="40" height="6" fill="url(#bioCol)" stroke="#1C1410" strokeWidth="0.6" />
    <rect x="32" y="24" width="36" height="4" fill="url(#bioCol)" />
    {/* fuste com cannelure */}
    <rect x="36" y="28" width="28" height="50" fill="url(#bioCol)" stroke="#1C1410" strokeWidth="0.6" />
    <g stroke="#1C1410" strokeWidth="0.4" opacity="0.6">
      <line x1="40" y1="28" x2="40" y2="78" />
      <line x1="46" y1="28" x2="46" y2="78" />
      <line x1="50" y1="28" x2="50" y2="78" />
      <line x1="54" y1="28" x2="54" y2="78" />
      <line x1="60" y1="28" x2="60" y2="78" />
    </g>
    {/* base */}
    <rect x="32" y="78" width="36" height="4" fill="url(#bioCol)" />
    <rect x="28" y="82" width="44" height="6" fill="url(#bioCol)" stroke="#1C1410" strokeWidth="0.6" />
  </svg>
);

const FLAME = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bioFlame" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#8B3A2E" />
        <stop offset="50%" stopColor="#D4A853" />
        <stop offset="100%" stopColor="#E8DDD0" />
      </linearGradient>
    </defs>
    <path
      d="M50 18 C 40 32 30 44 30 60 C 30 76 42 86 50 86 C 58 86 70 76 70 60 C 70 50 64 44 60 38 C 56 50 54 54 50 54 C 50 42 56 32 50 18 Z"
      fill="url(#bioFlame)"
      stroke="#1C1410"
      strokeWidth="0.6"
    />
    <path
      d="M50 56 C 44 64 42 72 48 80 C 50 76 54 70 56 64 C 52 64 50 60 50 56 Z"
      fill="#1C1410"
      opacity="0.55"
    />
  </svg>
);

const SCROLL = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bioScroll" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#B8AD9E" />
      </linearGradient>
    </defs>
    <path
      d="M24 26 C 24 22 28 20 32 20 L74 20 C 70 24 70 30 70 38 L70 70 C 70 76 74 80 78 80 L36 80 C 32 80 28 78 28 72 L28 38 C 28 32 26 30 24 26 Z"
      fill="url(#bioScroll)"
      stroke="#6E5530"
      strokeWidth="0.7"
    />
    <g stroke="#6E5530" strokeWidth="0.7" strokeOpacity="0.65" strokeLinecap="round" fill="none">
      <line x1="38" y1="34" x2="64" y2="34" />
      <line x1="38" y1="42" x2="64" y2="42" />
      <line x1="38" y1="50" x2="60" y2="50" />
      <line x1="38" y1="58" x2="62" y2="58" />
      <line x1="38" y1="66" x2="56" y2="66" />
    </g>
    {/* rolinhos */}
    <ellipse cx="24" cy="26" rx="6" ry="3" fill="#6E5530" />
    <ellipse cx="78" cy="80" rx="6" ry="3" fill="#6E5530" />
    {/* selo */}
    <circle cx="68" cy="72" r="5" fill="#8B3A2E" stroke="#1C1410" strokeWidth="0.5" />
    <text x="68" y="74" textAnchor="middle" fontSize="6" fill="#E8DDD0" fontFamily="serif">⚝</text>
  </svg>
);

const VESSEL = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioVessel" cx="50%" cy="55%" r="55%">
        <stop offset="0%" stopColor="#E8DDD0" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#9A7A48" stopOpacity="0.95" />
      </radialGradient>
    </defs>
    {/* pescoço */}
    <rect x="44" y="18" width="12" height="14" fill="url(#bioVessel)" stroke="#1C1410" strokeWidth="0.6" />
    <rect x="42" y="16" width="16" height="4" fill="#1C1410" opacity="0.7" />
    {/* corpo */}
    <path
      d="M30 38 C 30 30 40 30 50 30 C 60 30 70 30 70 38 L74 78 C 74 84 68 86 50 86 C 32 86 26 84 26 78 Z"
      fill="url(#bioVessel)"
      stroke="#1C1410"
      strokeWidth="0.7"
    />
    {/* líquido */}
    <path
      d="M32 62 C 38 58 42 62 50 62 C 58 62 62 58 68 62 L70 78 C 70 82 64 84 50 84 C 36 84 30 82 30 78 Z"
      fill="#D4A853"
      opacity="0.7"
    />
    {/* selo */}
    <circle cx="50" cy="50" r="6" fill="none" stroke="#1C1410" strokeWidth="0.6" opacity="0.6" />
    <path d="M50 45 L50 55 M45 50 L55 50" stroke="#1C1410" strokeWidth="0.5" opacity="0.55" />
  </svg>
);

const HEART = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bioHeart" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#8B3A2E" />
      </radialGradient>
    </defs>
    <path
      d="M50 86 C 28 66 14 52 14 36 C 14 26 22 18 32 18 C 40 18 46 24 50 30 C 54 24 60 18 68 18 C 78 18 86 26 86 36 C 86 52 72 66 50 86 Z"
      fill="url(#bioHeart)"
      stroke="#1C1410"
      strokeWidth="0.6"
    />
    {/* coração interno (sutil) */}
    <path
      d="M50 70 C 38 58 30 50 30 40 C 30 34 34 30 40 30 C 44 30 47 32 50 36 C 53 32 56 30 60 30 C 66 30 70 34 70 40 C 70 50 62 58 50 70 Z"
      fill="#1C1410"
      opacity="0.18"
    />
  </svg>
);

const SVG_BY_ICON = {
  mandala: MANDALA,
  book: BOOK,
  whatsapp: WHATSAPP,
  star: STAR,
  feather: FEATHER,
  compass: COMPASS,
  key: KEY,
  eye: EYE,
  lunar: LUNAR,
  solar: SOLAR,
  column: COLUMN,
  flame: FLAME,
  scroll: SCROLL,
  vessel: VESSEL,
  heart: HEART,
};

export const BIO_ICON_OPTIONS = [
  { value: '',          label: '— sem ícone —' },
  { value: 'mandala',   label: 'Mandala'   },
  { value: 'book',      label: 'Livro'     },
  { value: 'scroll',    label: 'Pergaminho'},
  { value: 'feather',   label: 'Pena'      },
  { value: 'compass',   label: 'Bússola'   },
  { value: 'key',       label: 'Chave'     },
  { value: 'eye',       label: 'Olho'      },
  { value: 'lunar',     label: 'Lua'       },
  { value: 'solar',     label: 'Sol'       },
  { value: 'star',      label: 'Estrela'   },
  { value: 'column',    label: 'Coluna'    },
  { value: 'flame',     label: 'Chama'     },
  { value: 'vessel',    label: 'Vaso'      },
  { value: 'whatsapp',  label: 'WhatsApp'  },
  { value: 'heart',     label: 'Coração'   },
];

export function BioCardIcon({ name, className = '' }) {
  const svg = SVG_BY_ICON[name];
  if (!svg) return null;
  return <div className={`relative w-full h-full flex items-center justify-center ${className}`}>{svg}</div>;
}

export function hasBioIcon(name) {
  return !!SVG_BY_ICON[name];
}
