'use client';

import { motion } from 'framer-motion';
import { IconSeal } from './icons';

/**
 * EstudosHero — abertura cerimonial da página /estudos.
 *
 * Diferente do PageHero genérico:
 *  - Selo grande (IconSeal) à esquerda como "porta de entrada"
 *  - Tipografia mais respirada, sem mandala (deixa espaço pra timeline)
 *  - Meta numérica no rodapé (X trilhas · Y áreas · Z etapas)
 *  - Accent dinâmico (cor da área filtrada)
 *
 * Props:
 *   eyebrow, title, emphasis, lead, sealIcon (default 'compass')
 *   accent (cor), meta ([{label, value}, ...])
 */
export default function EstudosHero({
  eyebrow = 'Sala de estudos · Psicologia Analítica',
  title = 'Estudos',
  emphasis = 'guiados',
  lead,
  sealIcon = 'compass',
  accent = '#B48C50',
  meta = [],
}) {
  return (
    <section className="relative pt-28 md:pt-40 pb-12 md:pb-20 px-5 sm:px-6 md:px-12 overflow-hidden">
      {/* Glow ambiente sutil */}
      <div
        className="absolute pointer-events-none rounded-full blur-3xl opacity-[0.07]"
        style={{
          top: '12%',
          left: '20%',
          width: 540,
          height: 540,
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-[1180px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start">
          {/* Selo cerimonial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 mx-auto lg:mx-0"
          >
            <div className="relative">
              {/* Anel externo girando, decorativo */}
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-full border opacity-30"
                style={{ borderColor: `${accent}40`, borderStyle: 'dashed' }}
              />
              <IconSeal name={sealIcon} size={112} color={accent} ringWidth={1.5} />
            </div>
          </motion.div>

          {/* Texto */}
          <div className="relative max-w-2xl">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-mono text-[0.62rem] tracking-[0.32em] uppercase mb-6 flex items-center gap-3"
                style={{ color: accent }}
              >
                <span className="block w-8 h-px" style={{ background: `${accent}66` }} />
                {eyebrow}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-normal text-text-bright leading-[0.98] mb-3 tracking-[-0.015em] text-[clamp(2.6rem,7.5vw,5.6rem)]"
            >
              {title}
              {emphasis && (
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[clamp(2.1rem,6vw,4.6rem)] -mt-1"
                >
                  <em className="italic" style={{ color: accent }}>{emphasis}</em>
                </motion.span>
              )}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-32 origin-left mb-7 mt-4"
              style={{ background: `linear-gradient(to right, ${accent}b3, transparent)` }}
            />

            {lead && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="text-[0.96rem] text-text-dim max-w-xl leading-[1.85] mb-8"
              >
                {lead}
              </motion.p>
            )}

            {meta.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.95 }}
                className="flex flex-wrap items-center gap-x-7 gap-y-2 pt-3 border-t border-border-subtle/40 max-w-md"
              >
                {meta.map((m) => (
                  <div key={m.label} className="flex items-baseline gap-2">
                    <span
                      className="font-serif text-[1.5rem] leading-none"
                      style={{ color: accent }}
                    >
                      {m.value}
                    </span>
                    <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim">
                      {m.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
