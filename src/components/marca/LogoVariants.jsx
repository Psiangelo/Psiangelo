/**
 * Variações tipográficas do logo "Psiangelo".
 *
 * Cada componente é um SVG auto-contido com viewBox próprio.
 * Todos usam `currentColor` para accent (dourado) e um segundo
 * tom passado via CSS, permitindo variação sem duplicar marcação.
 *
 * Paleta padrão (herdada via className):
 *   accent: #B48C50 (dourado)
 *   bright: #E8DDD0 (texto claro)
 *   bg:     #0E0C0A (fundo escuro)
 */

/* eslint-disable react/jsx-key */

const COMMON = {
  accent: '#B48C50',
  bright: '#E8DDD0',
  dim: '#B8AD9E',
  bg: '#0E0C0A',
};

/* ================================
   1. MONOGRAMA ψ — minimalismo puro
================================ */
export function LogoMonograma() {
  return (
    <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
      {/* halo externo */}
      <circle cx="160" cy="160" r="146" fill="none" stroke={COMMON.accent} strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="160" cy="160" r="118" fill="none" stroke={COMMON.accent} strokeOpacity="0.4" strokeWidth="0.8" />

      {/* raios sutis */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 160 + Math.cos(a) * 120;
        const y1 = 160 + Math.sin(a) * 120;
        const x2 = 160 + Math.cos(a) * 146;
        const y2 = 160 + Math.sin(a) * 146;
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COMMON.accent} strokeOpacity={i % 3 === 0 ? 0.6 : 0.18} strokeWidth="0.8" />;
      })}

      {/* ψ gigante */}
      <text
        x="160"
        y="218"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="200"
        fill={COMMON.accent}
      >
        ψ
      </text>
    </svg>
  );
}

/* ================================
   2. SERIF CLÁSSICA — editorial elegante
================================ */
export function LogoSerifClassica() {
  return (
    <svg viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg">
      {/* Eyebrow em mono */}
      <text
        x="400"
        y="42"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize="16"
        fill={COMMON.accent}
        letterSpacing="6"
      >
        PSICOLOGIA ANALÍTICA
      </text>

      {/* linha sob o eyebrow */}
      <line x1="340" y1="58" x2="460" y2="58" stroke={COMMON.accent} strokeOpacity="0.45" strokeWidth="1" />

      {/* Wordmark principal */}
      <text
        x="400"
        y="148"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="96"
        fill={COMMON.bright}
        letterSpacing="-2"
      >
        Psiangelo
      </text>

      {/* serifa dourada embaixo */}
      <line x1="260" y1="168" x2="540" y2="168" stroke={COMMON.accent} strokeWidth="1.2" />
      <line x1="390" y1="172" x2="410" y2="172" stroke={COMMON.accent} strokeWidth="3" />

      {/* Subtítulo grego */}
      <text
        x="400"
        y="200"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontStyle="italic"
        fill={COMMON.dim}
        opacity="0.75"
      >
        γνῶθι σεαυτόν
      </text>
    </svg>
  );
}

/* ================================
   3. MONOLINEAR — P S I A N G E L O espaçado
================================ */
export function LogoMonolinear() {
  return (
    <svg viewBox="0 0 800 180" xmlns="http://www.w3.org/2000/svg">
      {/* ψ pequeno à esquerda */}
      <text x="60" y="110" fontFamily="Georgia, serif" fontStyle="italic" fontSize="72" fill={COMMON.accent}>ψ</text>

      {/* Linha decorativa */}
      <line x1="110" y1="95" x2="150" y2="95" stroke={COMMON.accent} strokeOpacity="0.5" strokeWidth="0.8" />

      {/* Wordmark espaçado */}
      <text
        x="160"
        y="108"
        fontFamily="'Courier New', monospace"
        fontSize="36"
        fill={COMMON.bright}
        letterSpacing="18"
      >
        PSIANGELO
      </text>

      {/* Tagline discreta */}
      <text
        x="160"
        y="142"
        fontFamily="'Courier New', monospace"
        fontSize="11"
        fill={COMMON.accent}
        letterSpacing="4"
        opacity="0.7"
      >
        NOSCE · TE · IPSUM
      </text>
    </svg>
  );
}

/* ================================
   4. PSI-COMO-P — ψ substitui o P inicial
================================ */
export function LogoPsiComoP() {
  return (
    <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg">
      {/* ψ grande como primeira letra */}
      <text
        x="60"
        y="160"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="180"
        fill={COMMON.accent}
      >
        ψ
      </text>

      {/* "siangelo" como resto */}
      <text
        x="220"
        y="160"
        fontFamily="Georgia, serif"
        fontSize="120"
        fill={COMMON.bright}
        letterSpacing="-2"
      >
        siangelo
      </text>

      {/* Linha horizontal embaixo */}
      <line x1="220" y1="184" x2="680" y2="184" stroke={COMMON.accent} strokeOpacity="0.5" strokeWidth="1" />

      {/* Subtexto */}
      <text
        x="224"
        y="210"
        fontFamily="'Courier New', monospace"
        fontSize="11"
        fill={COMMON.accent}
        letterSpacing="4"
        opacity="0.8"
      >
        PSICOLOGIA · ANALÍTICA
      </text>
    </svg>
  );
}

/* ================================
   5. VITRUVIANO — círculo + inscrição
================================ */
export function LogoVitruviano() {
  return (
    <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="arcTop" d="M 210,210 m -160,0 a 160,160 0 1,1 320,0" fill="none" />
        <path id="arcBottom" d="M 50,210 a 160,160 0 1,0 320,0" fill="none" />
      </defs>

      {/* círculos concêntricos */}
      <circle cx="210" cy="210" r="188" fill="none" stroke={COMMON.accent} strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="210" cy="210" r="160" fill="none" stroke={COMMON.accent} strokeOpacity="0.5" strokeWidth="1" />
      <circle cx="210" cy="210" r="120" fill="none" stroke={COMMON.accent} strokeOpacity="0.2" strokeWidth="0.6" />

      {/* Texto superior curvo */}
      <text fontFamily="'Courier New', monospace" fontSize="14" fill={COMMON.accent} letterSpacing="6">
        <textPath xlinkHref="#arcTop" startOffset="50%" textAnchor="middle">
          γνῶθι σεαυτόν · CONHECE-TE
        </textPath>
      </text>

      {/* Wordmark central */}
      <text
        x="210"
        y="202"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="52"
        fill={COMMON.bright}
        letterSpacing="-1"
      >
        Psiangelo
      </text>

      {/* ψ abaixo do nome */}
      <text
        x="210"
        y="258"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="48"
        fill={COMMON.accent}
      >
        ψ
      </text>

      {/* linha sob o psi */}
      <line x1="186" y1="270" x2="234" y2="270" stroke={COMMON.accent} strokeOpacity="0.5" strokeWidth="0.8" />

      {/* Inferior curvo */}
      <text fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="4" opacity="0.7">
        <textPath xlinkHref="#arcBottom" startOffset="50%" textAnchor="middle">
          A · TI · MESMO · ·
        </textPath>
      </text>
    </svg>
  );
}

/* ================================
   6. ALQUÍMICO — 4 selos ao redor
================================ */
export function LogoAlquimico() {
  const seals = [
    { cx: 80,  cy: 110, label: '☉', name: 'sol' },       // ouro
    { cx: 720, cy: 110, label: '☽', name: 'lua' },       // prata
    { cx: 80,  cy: 190, label: '🜔', name: 'sal' },       // sal
    { cx: 720, cy: 190, label: '🜍', name: 'enxofre' },   // enxofre
  ];
  return (
    <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      {/* Selos nas bordas */}
      {seals.map((s) => (
        <g>
          <circle cx={s.cx} cy={s.cy} r="26" fill="none" stroke={COMMON.accent} strokeOpacity="0.45" strokeWidth="1" />
          <text x={s.cx} y={s.cy + 10} textAnchor="middle" fontSize="28" fill={COMMON.accent}>
            {s.label}
          </text>
        </g>
      ))}

      {/* linhas conectoras */}
      <line x1="110" y1="110" x2="690" y2="110" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="2 4" />
      <line x1="110" y1="190" x2="690" y2="190" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="2 4" />

      {/* Eyebrow */}
      <text x="400" y="72" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="13" fill={COMMON.accent} letterSpacing="7">
        OPUS · MAGNUM
      </text>

      {/* Wordmark caveado */}
      <text
        x="400"
        y="170"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="84"
        fill={COMMON.bright}
        letterSpacing="10"
      >
        PSIANGELO
      </text>

      {/* Quaternidade na base */}
      <text
        x="400"
        y="232"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="20"
        fill={COMMON.dim}
        opacity="0.75"
      >
        nigredo · albedo · citrinitas · rubedo
      </text>
    </svg>
  );
}

/* ================================
   7. STACKED — 3 linhas editoriais
================================ */
export function LogoStacked() {
  return (
    <svg viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg">
      {/* "PSI" gigante */}
      <text
        x="280"
        y="160"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="180"
        fill={COMMON.bright}
        letterSpacing="8"
      >
        PSI
      </text>

      {/* "angelo" italic accent sobreposto na base do PSI */}
      <text
        x="280"
        y="232"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="84"
        fill={COMMON.accent}
        letterSpacing="-1"
      >
        angelo
      </text>

      {/* linha decorativa */}
      <line x1="170" y1="260" x2="390" y2="260" stroke={COMMON.accent} strokeOpacity="0.5" strokeWidth="0.8" />
      <circle cx="280" cy="260" r="3" fill={COMMON.accent} />

      {/* Tagline base */}
      <text
        x="280"
        y="300"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize="13"
        fill={COMMON.accent}
        letterSpacing="6"
      >
        NOSCE · TE · IPSUM
      </text>

      {/* grego */}
      <text
        x="280"
        y="330"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="20"
        fill={COMMON.dim}
        opacity="0.7"
      >
        γνῶθι σεαυτόν
      </text>
    </svg>
  );
}

/* ================================
   8. LAPIDAR — inscrição romana em caixa
================================ */
export function LogoLapidar() {
  return (
    <svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg">
      {/* caixa dupla */}
      <rect x="40" y="40" width="720" height="160" fill="none" stroke={COMMON.accent} strokeOpacity="0.4" strokeWidth="1" />
      <rect x="52" y="52" width="696" height="136" fill="none" stroke={COMMON.accent} strokeOpacity="0.2" strokeWidth="0.6" />

      {/* cantos ornamentais */}
      {[
        [52, 52], [748, 52], [52, 188], [748, 188],
      ].map(([x, y]) => (
        <g>
          <circle cx={x} cy={y} r="3" fill={COMMON.accent} />
        </g>
      ))}

      {/* Divisores decorativos */}
      <text x="104" y="132" fontFamily="Georgia, serif" fontStyle="italic" fontSize="56" fill={COMMON.accent}>ψ</text>
      <text x="716" y="132" fontFamily="Georgia, serif" fontStyle="italic" fontSize="56" fill={COMMON.accent} textAnchor="end">ψ</text>

      {/* wordmark caveado */}
      <text
        x="400"
        y="132"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="76"
        fill={COMMON.bright}
        letterSpacing="14"
      >
        PSIANGELO
      </text>

      {/* linhas verticais sutis sob letras centrais */}
      <line x1="400" y1="150" x2="400" y2="172" stroke={COMMON.accent} strokeOpacity="0.4" strokeWidth="0.8" />

      {/* tagline */}
      <text
        x="400"
        y="176"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize="11"
        fill={COMMON.accent}
        letterSpacing="6"
      >
        ANIMA · INCLINATA
      </text>
    </svg>
  );
}

/* ================================
   9. GEOMÉTRICO — letras construídas com linhas
================================ */
export function LogoGeometrico() {
  return (
    <svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
      {/* triângulo vazado acima do wordmark */}
      <polygon points="400,34 424,80 376,80" fill="none" stroke={COMMON.accent} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="400" cy="62" r="3" fill={COMMON.accent} />

      {/* Linhas horizontais enquadrando */}
      <line x1="120" y1="110" x2="680" y2="110" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <line x1="120" y1="200" x2="680" y2="200" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />

      {/* Wordmark em serifa larga */}
      <text
        x="400"
        y="176"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="88"
        fill={COMMON.bright}
        letterSpacing="-1"
      >
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>

      {/* pontos cardeais */}
      {[[120, 110], [680, 110], [120, 200], [680, 200]].map(([x, y]) => (
        <circle cx={x} cy={y} r="2.5" fill={COMMON.accent} />
      ))}

      {/* tagline */}
      <text
        x="400"
        y="238"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize="12"
        fill={COMMON.accent}
        letterSpacing="6"
        opacity="0.85"
      >
        PSICOLOGIA · ANALÍTICA
      </text>
    </svg>
  );
}

/* ================================
   10. GLYPH — monograma compacto P+ψ
================================ */
export function LogoGlyph() {
  return (
    <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
      {/* quadrado ornamental */}
      <rect x="40" y="40" width="240" height="240" fill="none" stroke={COMMON.accent} strokeOpacity="0.3" strokeWidth="1" />
      <rect x="52" y="52" width="216" height="216" fill="none" stroke={COMMON.accent} strokeOpacity="0.15" strokeWidth="0.6" />

      {/* P serif grande */}
      <text
        x="112"
        y="222"
        fontFamily="Georgia, serif"
        fontSize="220"
        fill={COMMON.bright}
        letterSpacing="-2"
      >
        P
      </text>

      {/* ψ sobreposto, rotacionado sutilmente */}
      <text
        x="192"
        y="206"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="180"
        fill={COMMON.accent}
        opacity="0.92"
      >
        ψ
      </text>

      {/* inscrição embaixo */}
      <text
        x="160"
        y="286"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize="11"
        fill={COMMON.accent}
        letterSpacing="5"
      >
        PSIANGELO
      </text>
    </svg>
  );
}

export const LOGO_VARIANTS = [
  {
    id: 'serif-classica',
    name: 'Serif clássica',
    desc: 'Wordmark editorial com eyebrow e inscrição grega. Tom sóbrio, imprime autoridade.',
    Comp: LogoSerifClassica,
    aspect: '800/220',
  },
  {
    id: 'stacked',
    name: 'Empilhada',
    desc: 'PSI gigante em display + angelo italic accent. Alto impacto vertical.',
    Comp: LogoStacked,
    aspect: '560/360',
  },
  {
    id: 'psi-como-p',
    name: 'Psi como P',
    desc: 'A letra ψ grega ocupa o lugar do P inicial. Integra símbolo e palavra.',
    Comp: LogoPsiComoP,
    aspect: '720/220',
  },
  {
    id: 'monolinear',
    name: 'Monolinear',
    desc: 'Letras espaçadas em monospace, acabamento editorial com ψ à esquerda.',
    Comp: LogoMonolinear,
    aspect: '800/180',
  },
  {
    id: 'vitruviano',
    name: 'Vitruviano',
    desc: 'Círculo com inscrição grega e latina. Selo canônico para produto ou carimbo.',
    Comp: LogoVitruviano,
    aspect: '420/420',
  },
  {
    id: 'alquimico',
    name: 'Alquímico',
    desc: 'Quatro selos alquímicos ao redor de PSIANGELO caveado. Identidade hermética.',
    Comp: LogoAlquimico,
    aspect: '800/300',
  },
  {
    id: 'lapidar',
    name: 'Lapidar',
    desc: 'Inscrição romana em caixa dupla com ψ flanqueando. Sensação de gravura em pedra.',
    Comp: LogoLapidar,
    aspect: '800/240',
  },
  {
    id: 'geometrico',
    name: 'Geométrico',
    desc: 'Triângulo vazado + linhas enquadrando o nome em italic. Limpo, moderno.',
    Comp: LogoGeometrico,
    aspect: '800/260',
  },
  {
    id: 'monograma',
    name: 'Monograma ψ',
    desc: 'Símbolo puro em halo de raios. Avatar e favicon — máxima condensação.',
    Comp: LogoMonograma,
    aspect: '320/320',
  },
  {
    id: 'glyph',
    name: 'Glyph P+ψ',
    desc: 'P e ψ sobrepostos em caixa quadrada. Alternativa de monograma para square badges.',
    Comp: LogoGlyph,
    aspect: '320/320',
  },
];
