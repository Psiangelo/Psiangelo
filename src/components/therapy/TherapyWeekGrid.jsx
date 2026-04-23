'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import TherapyScheduler from './TherapyScheduler';

const DOW_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatHour(h) {
  return `${String(Math.floor(h)).padStart(2, '0')}h${
    h % 1 ? String((h % 1) * 60).padStart(2, '0') : ''
  }`;
}

/**
 * Grade semanal fixa — colunas por dia da semana, linhas por horário.
 * Horas são calculadas a partir do menor startHour e maior endHour das janelas.
 */
export default function TherapyWeekGrid({ schedule, cta, whatsappNumber }) {
  const [open, setOpen] = useState(false);
  const [slotLabel, setSlotLabel] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const windows = schedule?.windows || [];
  const step = schedule?.stepHour || 1;

  const byDow = new Map();
  for (const w of windows) byDow.set(w.dow, w);

  // Dias exibidos: os que têm janela, ordenados seg→sex
  const shownDays = [1, 2, 3, 4, 5, 6, 0].filter((d) => byDow.has(d));
  if (shownDays.length === 0) {
    return (
      <p className="font-serif italic text-text-dim text-center py-10">
        Configure janelas de atendimento no admin.
      </p>
    );
  }

  // Intervalo global: menor startHour, maior endHour
  const minStart = Math.min(...shownDays.map((d) => byDow.get(d).startHour));
  const maxEnd = Math.max(...shownDays.map((d) => byDow.get(d).endHour));
  const hours = [];
  for (let h = minStart; h < maxEnd; h += step) hours.push(h);

  const handleClick = (dow, hour) => {
    const day = byDow.get(dow).label || DOW_ABBR[dow];
    setSlotLabel(`${day}, ${formatHour(hour)}`);
    setOpen(true);
  };

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-bg-card/30 border border-border-subtle"
      >
        {/* Subtle grain ornament */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-[0.04]">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <g stroke="#B48C50" strokeWidth="0.3" fill="none">
              {Array.from({ length: 7 }).map((_, i) => (
                <circle key={i} cx="150" cy="150" r={30 + i * 20} />
              ))}
            </g>
          </svg>
        </div>

        {/* Header dias */}
        <div
          className="grid relative"
          style={{ gridTemplateColumns: `72px repeat(${shownDays.length}, minmax(0, 1fr))` }}
        >
          <div className="border-b border-r border-border-subtle/50" />
          {shownDays.map((dow) => (
            <div
              key={dow}
              className="border-b border-r border-border-subtle/50 last:border-r-0 py-3 px-2 text-center"
            >
              <p className="font-mono text-[0.58rem] text-accent tracking-[0.22em] uppercase">
                {(byDow.get(dow).label || DOW_ABBR[dow]).slice(0, 3)}
              </p>
            </div>
          ))}
        </div>

        {/* Grid */}
        {hours.map((h, ri) => (
          <motion.div
            key={h}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + ri * 0.03 }}
            className="grid relative"
            style={{ gridTemplateColumns: `72px repeat(${shownDays.length}, minmax(0, 1fr))` }}
          >
            <div className="border-b border-r border-border-subtle/40 last:border-b-0 py-3 px-3 flex items-center justify-end">
              <span className="font-mono text-[0.62rem] text-text-dim tracking-[0.12em]">
                {formatHour(h)}
              </span>
            </div>
            {shownDays.map((dow) => {
              const w = byDow.get(dow);
              const active = h >= w.startHour && h < w.endHour;
              if (!active) {
                return (
                  <div
                    key={dow}
                    className="border-b border-r border-border-subtle/40 last:border-r-0 bg-bg/30"
                  />
                );
              }
              return (
                <button
                  key={dow}
                  onClick={() => handleClick(dow, h)}
                  className="group relative border-b border-r border-border-subtle/40 last:border-r-0 py-4 px-2 transition-colors hover:bg-accent/10 focus:bg-accent/10 focus:outline-none"
                >
                  <span className="block w-1 h-1 rounded-full bg-accent/30 mx-auto group-hover:bg-accent transition-colors" />
                  <span className="absolute inset-x-0 bottom-1 text-center font-mono text-[0.55rem] text-accent opacity-0 group-hover:opacity-100 transition-opacity tracking-[0.15em]">
                    marcar →
                  </span>
                </button>
              );
            })}
          </motion.div>
        ))}
      </motion.div>

      <p className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase mt-4 text-center">
        Clique em qualquer horário para propor pelo WhatsApp
      </p>

      <TherapyScheduler
        open={open}
        onClose={() => setOpen(false)}
        config={cta}
        whatsappNumber={whatsappNumber}
        initialSlot={slotLabel}
      />
    </div>
  );
}
