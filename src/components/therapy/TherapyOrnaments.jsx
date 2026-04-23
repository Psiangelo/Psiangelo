'use client';

import { motion } from 'framer-motion';

/**
 * Ornamentos SVG para a landing /psicoterapia-analitica.
 * Tudo em pt-BR editorial — mandalas, quaternios, divisores junguianos.
 */

export function HeroMandala({ size = 640, opacity = 0.07 }) {
  return (
    <motion.svg
      className="absolute pointer-events-none"
      width={size}
      height={size}
      viewBox="0 0 640 640"
      style={{ opacity }}
      animate={{ rotate: 360 }}
      transition={{ duration: 280, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <g fill="none" stroke="#B48C50">
        <circle cx="320" cy="320" r="300" strokeWidth="0.3" />
        <circle cx="320" cy="320" r="240" strokeWidth="0.4" />
        <circle cx="320" cy="320" r="180" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="320" cy="320" r="120" strokeWidth="0.5" />
        <circle cx="320" cy="320" r="60" strokeWidth="0.6" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          const x1 = 320 + Math.cos(a) * 60;
          const y1 = 320 + Math.sin(a) * 60;
          const x2 = 320 + Math.cos(a) * 300;
          const y2 = 320 + Math.sin(a) * 300;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={i % 3 === 0 ? 0.5 : 0.2}
            />
          );
        })}
      </g>
    </motion.svg>
  );
}

export function QuaternioSmall({ size = 80, opacity = 0.5 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={{ opacity }}
      className="inline-block"
      aria-hidden
    >
      <g fill="none" stroke="#B48C50" strokeWidth="0.6">
        <circle cx="40" cy="20" r="5" />
        <circle cx="60" cy="40" r="5" />
        <circle cx="40" cy="60" r="5" />
        <circle cx="20" cy="40" r="5" />
        <path d="M40 25 L60 35 M60 45 L40 55 M40 55 L20 45 M20 35 L40 25" />
        <circle cx="40" cy="40" r="2" fill="#B48C50" />
      </g>
    </motion.svg>
  );
}

export function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2 opacity-60">
      <span className="block h-px w-16 bg-gradient-to-r from-transparent to-accent/60" />
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <g stroke="#B48C50" fill="none" strokeWidth="0.8">
          <circle cx="8" cy="8" r="6" />
          <circle cx="8" cy="8" r="2" fill="#B48C50" />
        </g>
      </svg>
      <span className="block h-px w-16 bg-gradient-to-l from-transparent to-accent/60" />
    </div>
  );
}

export function SerpentineRule() {
  return (
    <svg width="160" height="12" viewBox="0 0 160 12" aria-hidden className="opacity-50">
      <path
        d="M0 6 Q 10 0, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6"
        stroke="#B48C50"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

export function NumberBadge({ n }) {
  return (
    <div className="relative inline-flex items-center justify-center w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 60 60" className="absolute inset-0 w-full h-full" aria-hidden>
        <circle
          cx="30"
          cy="30"
          r="28"
          fill="none"
          stroke="#B48C50"
          strokeWidth="0.6"
          strokeDasharray="3 3"
        />
      </svg>
      <span className="font-serif italic text-accent text-[1.6rem] leading-none relative">
        {String(n).padStart(2, '0')}
      </span>
    </div>
  );
}
