'use client';

import { motion } from 'framer-motion';

/**
 * Separador ondulado entre o header (identidade) e a lista de cards.
 * Inspirado no /bio da Tulipa, mas em tons dourados/sépia do Psiangelo.
 */
export default function BioWaveDivider({ delay = 0.4 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className="w-full max-w-[420px] mx-auto mb-8"
      aria-hidden="true"
    >
      <svg viewBox="0 0 540 56" preserveAspectRatio="none" className="w-full h-7">
        <defs>
          <linearGradient id="bioWaveMain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#B48C50" stopOpacity="0" />
            <stop offset="25%"  stopColor="#B48C50" stopOpacity="0.45" />
            <stop offset="50%"  stopColor="#D4A853" stopOpacity="0.85" />
            <stop offset="75%"  stopColor="#B48C50" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#B48C50" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bioWaveSoft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#E8DDD0" stopOpacity="0" />
            <stop offset="50%"  stopColor="#E8DDD0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8DDD0" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* onda dourada principal */}
        <path
          d="M-20 28 Q 80 8, 180 28 T 380 28 T 580 28"
          fill="none"
          stroke="url(#bioWaveMain)"
          strokeWidth="1.4"
        />
        {/* eco suave em sépia clara */}
        <path
          d="M-20 36 Q 100 56, 220 36 T 440 36 T 620 36"
          fill="none"
          stroke="url(#bioWaveSoft)"
          strokeWidth="1"
        />
        {/* nós: centro dourado-bright + 2 satélites */}
        <circle cx="270" cy="28" r="2.6" fill="#D4A853" opacity="0.95" />
        <circle cx="135" cy="28" r="1.5" fill="#B48C50" opacity="0.75" />
        <circle cx="405" cy="28" r="1.5" fill="#B48C50" opacity="0.75" />
      </svg>
    </motion.div>
  );
}
