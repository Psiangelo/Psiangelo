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
   ALQUÍMICO — família de 5 variações
================================ */

// Helper: desenha um selo alquímico (círculo + símbolo)
function Seal({ cx, cy, label, r = 26, size = 28 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={COMMON.accent} strokeOpacity="0.45" strokeWidth="1" />
      <text x={cx} y={cy + size / 2.8} textAnchor="middle" fontSize={size} fill={COMMON.accent}>
        {label}
      </text>
    </g>
  );
}

// 6a. Alq Original — 4 selos nas bordas, wordmark caveado
export function LogoAlquimico() {
  const seals = [
    { cx: 80, cy: 110, label: '☉' },
    { cx: 720, cy: 110, label: '☽' },
    { cx: 80, cy: 190, label: '🜔' },
    { cx: 720, cy: 190, label: '🜍' },
  ];
  return (
    <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      {seals.map((s) => <Seal {...s} />)}
      <line x1="110" y1="110" x2="690" y2="110" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="2 4" />
      <line x1="110" y1="190" x2="690" y2="190" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="2 4" />
      <text x="400" y="72" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="13" fill={COMMON.accent} letterSpacing="7">
        OPUS · MAGNUM
      </text>
      <text x="400" y="170" textAnchor="middle" fontFamily="Georgia, serif" fontSize="84" fill={COMMON.bright} letterSpacing="10">
        PSIANGELO
      </text>
      <text x="400" y="232" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="20" fill={COMMON.dim} opacity="0.75">
        nigredo · albedo · citrinitas · rubedo
      </text>
    </svg>
  );
}

// 6b. Alq Roda — mandala com 4 selos em círculo + nome central
export function LogoAlqRoda() {
  const cx = 400, cy = 210, R = 150;
  const positions = [
    { angle: -90, label: '☉' },   // topo
    { angle: 0,   label: '☽' },   // direita
    { angle: 90,  label: '🜔' },  // base
    { angle: 180, label: '🜍' },  // esquerda
  ];
  return (
    <svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
      {/* mandala externa */}
      <circle cx={cx} cy={cy} r={R + 30} fill="none" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={COMMON.accent} strokeOpacity="0.45" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={R - 30} fill="none" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r="6" fill={COMMON.accent} opacity="0.3" />

      {/* raios */}
      {[0, 45, 90, 135].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(a) * (R - 26);
        const y1 = cy + Math.sin(a) * (R - 26);
        const x2 = cx - Math.cos(a) * (R - 26);
        const y2 = cy - Math.sin(a) * (R - 26);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COMMON.accent} strokeOpacity="0.08" strokeWidth="0.5" />;
      })}

      {/* selos nas 4 posições */}
      {positions.map(({ angle, label }) => {
        const a = (angle * Math.PI) / 180;
        const sx = cx + Math.cos(a) * R;
        const sy = cy + Math.sin(a) * R;
        return <Seal cx={sx} cy={sy} label={label} r={24} size={26} />;
      })}

      {/* eyebrow top */}
      <text x={cx} y="44" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6">
        ROTA · ALCHEMICA
      </text>

      {/* Wordmark central */}
      <text x={cx} y={cy + 12} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="56" fill={COMMON.bright} letterSpacing="-1">
        Psiangelo
      </text>
      <line x1={cx - 48} y1={cy + 28} x2={cx + 48} y2={cy + 28} stroke={COMMON.accent} strokeOpacity="0.6" strokeWidth="0.8" />

      {/* Subtitle bottom */}
      <text x={cx} y="398" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill={COMMON.dim} opacity="0.7">
        γνῶθι σεαυτόν
      </text>
    </svg>
  );
}

// 6c. Alq Coluna — 4 selos em coluna vertical + nome à direita
export function LogoAlqColuna() {
  const seals = [
    { cx: 100, cy: 70, label: '☉' },
    { cx: 100, cy: 160, label: '☽' },
    { cx: 100, cy: 250, label: '🜔' },
    { cx: 100, cy: 340, label: '🜍' },
  ];
  return (
    <svg viewBox="0 0 900 410" xmlns="http://www.w3.org/2000/svg">
      {/* linha vertical conectando os selos */}
      <line x1="100" y1="46" x2="100" y2="364" stroke={COMMON.accent} strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="3 5" />

      {seals.map((s) => <Seal cx={s.cx} cy={s.cy} label={s.label} r={22} size={24} />)}

      {/* divisor vertical entre coluna e texto */}
      <line x1="180" y1="40" x2="180" y2="370" stroke={COMMON.accent} strokeOpacity="0.25" strokeWidth="0.6" />

      {/* Eyebrow */}
      <text x="220" y="94" fontFamily="'Courier New', monospace" fontSize="14" fill={COMMON.accent} letterSpacing="6">
        OPUS · MAGNUM
      </text>

      {/* Wordmark empilhado, serif caveado */}
      <text x="220" y="208" fontFamily="Georgia, serif" fontSize="108" fill={COMMON.bright} letterSpacing="2">
        PSIANGELO
      </text>

      {/* linha sob o nome */}
      <line x1="220" y1="232" x2="760" y2="232" stroke={COMMON.accent} strokeOpacity="0.55" strokeWidth="1" />

      {/* Quaternidade */}
      <text x="220" y="278" fontFamily="Georgia, serif" fontStyle="italic" fontSize="24" fill={COMMON.dim} opacity="0.8">
        nigredo · albedo · citrinitas · rubedo
      </text>

      {/* Subtitle */}
      <text x="220" y="330" fontFamily="'Courier New', monospace" fontSize="11" fill={COMMON.accent} letterSpacing="5">
        PSICOLOGIA · ANALÍTICA · JUNGUIANA
      </text>
    </svg>
  );
}

// 6d. Alq Trindade — 3 selos em triângulo (sal/enxofre/mercúrio)
export function LogoAlqTrindade() {
  const seals = [
    { cx: 400, cy: 54, label: '☿' },   // mercúrio — topo
    { cx: 160, cy: 220, label: '🜔' },  // sal — esquerda
    { cx: 640, cy: 220, label: '🜍' },  // enxofre — direita
  ];
  return (
    <svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg">
      {/* triângulo base (conectando os selos) */}
      <polygon points="400,82 184,220 616,220" fill="none" stroke={COMMON.accent} strokeOpacity="0.22" strokeWidth="0.7" strokeDasharray="3 5" />
      <polygon points="400,96 208,214 592,214" fill="none" stroke={COMMON.accent} strokeOpacity="0.08" strokeWidth="0.5" />

      {seals.map((s) => <Seal cx={s.cx} cy={s.cy} label={s.label} r={24} size={24} />)}

      {/* wordmark central */}
      <text x="400" y="204" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="62" fill={COMMON.bright} letterSpacing="-1">
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>

      {/* linha sob o nome */}
      <line x1="276" y1="222" x2="524" y2="222" stroke={COMMON.accent} strokeOpacity="0.5" strokeWidth="0.8" />
      <circle cx="400" cy="222" r="3" fill={COMMON.accent} />

      {/* base explicativa */}
      <text x="400" y="278" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6" opacity="0.8">
        MERCVRIVS · SAL · SVLPHVR
      </text>
      <text x="400" y="310" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill={COMMON.dim} opacity="0.7">
        tria prima · os três princípios
      </text>
    </svg>
  );
}

// 6e. Alq Selado — caixa com selo circular grande à esquerda e nome à direita
export function LogoAlqSelado() {
  return (
    <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg">
      {/* caixa externa */}
      <rect x="30" y="30" width="840" height="260" fill="none" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="1" />
      <rect x="40" y="40" width="820" height="240" fill="none" stroke={COMMON.accent} strokeOpacity="0.15" strokeWidth="0.6" />

      {/* selo grande à esquerda */}
      <g transform="translate(170, 160)">
        <circle r="90" fill="none" stroke={COMMON.accent} strokeOpacity="0.45" strokeWidth="1" />
        <circle r="72" fill="none" stroke={COMMON.accent} strokeOpacity="0.25" strokeWidth="0.6" />
        {/* quadrante com os 4 símbolos em mini dentro do selo */}
        <text x="-40" y="-18" textAnchor="middle" fontSize="22" fill={COMMON.accent}>☉</text>
        <text x="40" y="-18" textAnchor="middle" fontSize="22" fill={COMMON.accent}>☽</text>
        <text x="-40" y="34" textAnchor="middle" fontSize="22" fill={COMMON.accent}>🜔</text>
        <text x="40" y="34" textAnchor="middle" fontSize="22" fill={COMMON.accent}>🜍</text>
        {/* ψ central */}
        <text x="0" y="12" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="34" fill={COMMON.accent}>ψ</text>
      </g>

      {/* divisor vertical */}
      <line x1="290" y1="72" x2="290" y2="248" stroke={COMMON.accent} strokeOpacity="0.3" strokeWidth="0.6" />

      {/* wordmark à direita */}
      <text x="320" y="130" fontFamily="'Courier New', monospace" fontSize="13" fill={COMMON.accent} letterSpacing="6">
        OPUS · MAGNUM
      </text>
      <text x="320" y="206" fontFamily="Georgia, serif" fontSize="80" fill={COMMON.bright} letterSpacing="4">
        PSIANGELO
      </text>
      <line x1="320" y1="226" x2="820" y2="226" stroke={COMMON.accent} strokeOpacity="0.55" strokeWidth="1" />
      <text x="320" y="258" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill={COMMON.dim} opacity="0.75">
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
   GEOMÉTRICO — família de 5 variações
================================ */

// 9a. Geo Triângulo (original) — triângulo vazado + frames
export function LogoGeometrico() {
  return (
    <svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
      <polygon points="400,34 424,80 376,80" fill="none" stroke={COMMON.accent} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="400" cy="62" r="3" fill={COMMON.accent} />
      <line x1="120" y1="110" x2="680" y2="110" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <line x1="120" y1="200" x2="680" y2="200" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <text x="400" y="176" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="88" fill={COMMON.bright} letterSpacing="-1">
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>
      {[[120, 110], [680, 110], [120, 200], [680, 200]].map(([x, y]) => (
        <circle cx={x} cy={y} r="2.5" fill={COMMON.accent} />
      ))}
      <text x="400" y="238" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6" opacity="0.85">
        PSICOLOGIA · ANALÍTICA
      </text>
    </svg>
  );
}

// 9b. Geo Estrela — pentagrama hermético
export function LogoGeoEstrela() {
  // pentagrama invertido sutil: 5 pontos em círculo, conectados em ordem 0-2-4-1-3-0
  const cx = 400, cy = 58, r = 30;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (-Math.PI / 2) + (i * 2 * Math.PI / 5);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const order = [0, 2, 4, 1, 3, 0];
  const d = order.map((i, k) => (k === 0 ? `M ${pts[i][0]},${pts[i][1]}` : `L ${pts[i][0]},${pts[i][1]}`)).join(' ');
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
      {/* círculo envolvente do pentagrama */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={COMMON.accent} strokeOpacity="0.3" strokeWidth="0.6" />
      <path d={d} fill="none" stroke={COMMON.accent} strokeOpacity="0.7" strokeWidth="0.9" />
      {pts.map(([x, y]) => (
        <circle cx={x} cy={y} r="1.6" fill={COMMON.accent} />
      ))}

      {/* molduras horizontais */}
      <line x1="110" y1="128" x2="690" y2="128" stroke={COMMON.accent} strokeOpacity="0.38" strokeWidth="0.8" />
      <line x1="110" y1="222" x2="690" y2="222" stroke={COMMON.accent} strokeOpacity="0.38" strokeWidth="0.8" />
      {[[110, 128], [690, 128], [110, 222], [690, 222]].map(([x, y]) => (
        <circle cx={x} cy={y} r="2.5" fill={COMMON.accent} />
      ))}

      <text x="400" y="196" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="92" fill={COMMON.bright} letterSpacing="-1">
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>

      <text x="400" y="258" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6" opacity="0.85">
        QUINTA · ESSENTIA
      </text>
    </svg>
  );
}

// 9c. Geo Círculo — círculo vazado entre dois arcos laterais
export function LogoGeoCirculo() {
  return (
    <svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
      {/* círculo central pequeno com ponto */}
      <circle cx="400" cy="58" r="20" fill="none" stroke={COMMON.accent} strokeOpacity="0.65" strokeWidth="1" />
      <circle cx="400" cy="58" r="3" fill={COMMON.accent} />

      {/* arcos laterais convergindo */}
      <path d="M 140 58 Q 265 58 376 58" fill="none" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <path d="M 660 58 Q 535 58 424 58" fill="none" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <circle cx="140" cy="58" r="2" fill={COMMON.accent} />
      <circle cx="660" cy="58" r="2" fill={COMMON.accent} />

      {/* molduras horizontais */}
      <line x1="120" y1="116" x2="680" y2="116" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <line x1="120" y1="206" x2="680" y2="206" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />

      <text x="400" y="182" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="88" fill={COMMON.bright} letterSpacing="-1">
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>

      <text x="400" y="240" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6" opacity="0.85">
        CIRCULUS · VITAE
      </text>
    </svg>
  );
}

// 9d. Geo Diamante — vesica piscis cruzada (dois losangos)
export function LogoGeoDiamante() {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
      {/* losango duplo */}
      <polygon points="400,30 430,66 400,102 370,66" fill="none" stroke={COMMON.accent} strokeOpacity="0.55" strokeWidth="1" />
      <polygon points="400,44 418,66 400,88 382,66" fill="none" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.7" />
      <circle cx="400" cy="66" r="2.5" fill={COMMON.accent} />

      {/* linhas convergentes para o wordmark */}
      <line x1="120" y1="134" x2="370" y2="66" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" />
      <line x1="680" y1="134" x2="430" y2="66" stroke={COMMON.accent} strokeOpacity="0.18" strokeWidth="0.6" />

      {/* frames */}
      <line x1="120" y1="134" x2="680" y2="134" stroke={COMMON.accent} strokeOpacity="0.4" strokeWidth="0.8" />
      <line x1="120" y1="224" x2="680" y2="224" stroke={COMMON.accent} strokeOpacity="0.4" strokeWidth="0.8" />
      {[[120, 134], [680, 134], [120, 224], [680, 224]].map(([x, y]) => (
        <circle cx={x} cy={y} r="2.5" fill={COMMON.accent} />
      ))}

      <text x="400" y="200" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="88" fill={COMMON.bright} letterSpacing="-1">
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>

      <text x="400" y="258" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6" opacity="0.85">
        LAPIS · PHILOSOPHORUM
      </text>
    </svg>
  );
}

// 9e. Geo Cruz — cruz central com serifas + frames
export function LogoGeoCruz() {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
      {/* cruz com serifas pontuais */}
      <line x1="400" y1="32" x2="400" y2="98" stroke={COMMON.accent} strokeOpacity="0.65" strokeWidth="1" />
      <line x1="374" y1="65" x2="426" y2="65" stroke={COMMON.accent} strokeOpacity="0.65" strokeWidth="1" />
      {[[400, 32], [400, 98], [374, 65], [426, 65]].map(([x, y]) => (
        <circle cx={x} cy={y} r="2" fill={COMMON.accent} />
      ))}
      <circle cx="400" cy="65" r="3.5" fill={COMMON.bg} stroke={COMMON.accent} strokeWidth="1" />

      {/* frames + pontos cardeais */}
      <line x1="120" y1="134" x2="680" y2="134" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <line x1="120" y1="224" x2="680" y2="224" stroke={COMMON.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      {[[120, 134], [680, 134], [120, 224], [680, 224]].map(([x, y]) => (
        <circle cx={x} cy={y} r="2.5" fill={COMMON.accent} />
      ))}

      <text x="400" y="200" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="88" fill={COMMON.bright} letterSpacing="-1">
        Psi<tspan fill={COMMON.accent}>angelo</tspan>
      </text>

      <text x="400" y="258" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill={COMMON.accent} letterSpacing="6" opacity="0.85">
        AXIS · MUNDI
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

/* ================================
   AGRUPAMENTOS
================================ */

// Família GEOMÉTRICO — 5 variações
export const GEOMETRICO_VARIANTS = [
  { id: 'geo-triangulo', name: 'Geo · Triângulo',
    desc: 'Triângulo vazado enquadrado por linhas horizontais. Versão original — equilibrada.',
    Comp: LogoGeometrico },
  { id: 'geo-estrela', name: 'Geo · Estrela',
    desc: 'Pentagrama hermético no topo. Carrega simbologia esotérica sem perder limpeza.',
    Comp: LogoGeoEstrela },
  { id: 'geo-circulo', name: 'Geo · Círculo',
    desc: 'Círculo central com arcos convergentes. Tom mais sereno, foco no centro.',
    Comp: LogoGeoCirculo },
  { id: 'geo-diamante', name: 'Geo · Diamante',
    desc: 'Losango duplo (pedra filosofal). Verticalidade + eixo central.',
    Comp: LogoGeoDiamante },
  { id: 'geo-cruz', name: 'Geo · Cruz',
    desc: 'Cruz com serifas pontuais (axis mundi). Referência cristã-alquímica.',
    Comp: LogoGeoCruz },
];

// Família ALQUÍMICO — 5 variações
export const ALQUIMICO_VARIANTS = [
  { id: 'alq-quatro', name: 'Alq · Quatro selos',
    desc: 'Quatro símbolos nos cantos (sol, lua, sal, enxofre). Versão original — equilibrio completo.',
    Comp: LogoAlquimico },
  { id: 'alq-roda', name: 'Alq · Roda',
    desc: 'Mandala circular com selos em N/S/L/O e Psiangelo no centro. Ícone-selo.',
    Comp: LogoAlqRoda },
  { id: 'alq-coluna', name: 'Alq · Coluna',
    desc: 'Selos em coluna à esquerda, nome caveado em bloco à direita. Formato horizontal amplo.',
    Comp: LogoAlqColuna },
  { id: 'alq-trindade', name: 'Alq · Trindade',
    desc: 'Três princípios (mercúrio, sal, enxofre) em triângulo. Tria prima junguiana.',
    Comp: LogoAlqTrindade },
  { id: 'alq-selado', name: 'Alq · Selado',
    desc: 'Selo com quadrante de símbolos e ψ central, à esquerda de PSIANGELO. Tipo carimbo.',
    Comp: LogoAlqSelado },
];

// Outras explorações (do primeiro round)
export const OUTRAS_VARIANTS = [
  { id: 'serif-classica', name: 'Serif clássica',
    desc: 'Wordmark editorial com eyebrow e inscrição grega.',
    Comp: LogoSerifClassica },
  { id: 'stacked', name: 'Empilhada',
    desc: 'PSI gigante + angelo italic accent.',
    Comp: LogoStacked },
  { id: 'psi-como-p', name: 'Psi como P',
    desc: 'A letra ψ ocupa o lugar do P inicial.',
    Comp: LogoPsiComoP },
  { id: 'monolinear', name: 'Monolinear',
    desc: 'Letras mono espaçadas com ψ à esquerda.',
    Comp: LogoMonolinear },
  { id: 'vitruviano', name: 'Vitruviano',
    desc: 'Círculo com inscrição grega curva.',
    Comp: LogoVitruviano },
  { id: 'lapidar', name: 'Lapidar',
    desc: 'Inscrição romana em caixa dupla.',
    Comp: LogoLapidar },
  { id: 'monograma', name: 'Monograma ψ',
    desc: 'Símbolo puro em halo radial.',
    Comp: LogoMonograma },
  { id: 'glyph', name: 'Glyph P+ψ',
    desc: 'Monograma P sobreposto com ψ.',
    Comp: LogoGlyph },
];

export const LOGO_GROUPS = [
  { key: 'geometrico', label: 'Geométrico', eyebrow: 'Famílias em destaque · 5 variações',
    intro: 'Linhas puras, símbolos geométricos simples, serif italic. Menos hermético, mais moderno.',
    variants: GEOMETRICO_VARIANTS },
  { key: 'alquimico', label: 'Alquímico', eyebrow: 'Famílias em destaque · 5 variações',
    intro: 'Selos alquímicos e inscrições latinas. Mais simbólico, conecta com o imaginário junguiano da Grande Obra.',
    variants: ALQUIMICO_VARIANTS },
  { key: 'outras', label: 'Outras explorações', eyebrow: 'Primeira rodada',
    intro: 'Direções diferentes — monograma puro, selo vitruviano, wordmark editorial, lapidar. Para comparação.',
    variants: OUTRAS_VARIANTS },
];

// Mantido para compat com código existente (não usar em novos pontos)
export const LOGO_VARIANTS = [
  ...GEOMETRICO_VARIANTS,
  ...ALQUIMICO_VARIANTS,
  ...OUTRAS_VARIANTS,
];
