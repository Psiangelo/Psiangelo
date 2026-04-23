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
  const blocked = new Set(schedule?.blockedSlots || []);
  const isBlocked = (dow, hour) => blocked.has(`${dow}-${hour}`);

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

  // cálculos auxiliares: qual hora é "tarde" (< 18) e "noite" (>= 18)
  const isNight = (h) => h >= 18;

  const colGridTemplate = `58px repeat(${shownDays.length}, minmax(0, 1fr))`;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-bg-card/30 border border-border-subtle rounded-sm"
      >
        {/* Mandala decorativa ambiente */}
        <div className="absolute top-0 right-0 w-[320px] h-[320px] pointer-events-none opacity-[0.04] -translate-y-1/4 translate-x-1/4">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <g stroke="#B48C50" strokeWidth="0.3" fill="none">
              {Array.from({ length: 7 }).map((_, i) => (
                <circle key={i} cx="150" cy="150" r={30 + i * 20} />
              ))}
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={150 + Math.cos(a) * 30}
                    y1={150 + Math.sin(a) * 30}
                    x2={150 + Math.cos(a) * 150}
                    y2={150 + Math.sin(a) * 150}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Header dias */}
        <div className="grid relative bg-bg-warm/30" style={{ gridTemplateColumns: colGridTemplate }}>
          <div className="border-b border-r border-border-subtle/50" />
          {shownDays.map((dow) => {
            const fullLabel = (byDow.get(dow).label || DOW_ABBR[dow]);
            return (
              <div
                key={dow}
                className="border-b border-r border-border-subtle/50 last:border-r-0 py-3 sm:py-4 px-2 text-center"
              >
                <p className="font-mono text-[0.55rem] sm:text-[0.6rem] text-accent tracking-[0.24em] uppercase">
                  <span className="sm:hidden">{fullLabel.slice(0, 3)}</span>
                  <span className="hidden sm:inline">{fullLabel}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        {hours.map((h, ri) => (
          <motion.div
            key={h}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + ri * 0.03 }}
            className="grid relative"
            style={{ gridTemplateColumns: colGridTemplate }}
          >
            <div className="border-b border-r border-border-subtle/40 last:border-b-0 py-3 sm:py-3.5 px-2 sm:px-3 flex items-center justify-end gap-1.5">
              {isNight(h) ? (
                <svg width="9" height="9" viewBox="0 0 9 9" className="text-accent/50 flex-shrink-0">
                  <path d="M 7 6 a 4 4 0 1 1 -4 -5 a 3 3 0 0 0 4 5 z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="9" height="9" viewBox="0 0 9 9" className="text-accent/40 flex-shrink-0">
                  <circle cx="4.5" cy="4.5" r="2" fill="currentColor" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                    const rad = (a * Math.PI) / 180;
                    return (
                      <line
                        key={a}
                        x1={4.5 + Math.cos(rad) * 3}
                        y1={4.5 + Math.sin(rad) * 3}
                        x2={4.5 + Math.cos(rad) * 4}
                        y2={4.5 + Math.sin(rad) * 4}
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
              )}
              <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-text-dim tracking-[0.1em]">
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
                    className="border-b border-r border-border-subtle/40 last:border-r-0 bg-bg/40"
                  />
                );
              }
              if (isBlocked(dow, h)) {
                return (
                  <div
                    key={dow}
                    className="relative border-b border-r border-border-subtle/40 last:border-r-0 py-3.5 sm:py-4 bg-bg-card/20 cursor-not-allowed"
                    aria-label="Ocupado"
                  >
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" className="text-text-dim/40">
                        <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="0.8" />
                        <line x1="2" y1="12" x2="12" y2="2" stroke="currentColor" strokeWidth="0.8" />
                      </svg>
                    </span>
                  </div>
                );
              }
              return (
                <button
                  key={dow}
                  onClick={() => handleClick(dow, h)}
                  className="group relative border-b border-r border-border-subtle/40 last:border-r-0 py-3.5 sm:py-4 transition-colors hover:bg-accent/10 focus:bg-accent/10 focus:outline-none"
                  aria-label={`Marcar ${byDow.get(dow).label || DOW_ABBR[dow]} às ${formatHour(h)}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="block w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent group-hover:scale-150 transition-all" />
                  </span>
                  <span className="absolute inset-x-0 bottom-1 text-center font-mono text-[0.5rem] text-accent opacity-0 group-hover:opacity-100 transition-opacity tracking-[0.15em] hidden sm:block">
                    marcar ↵
                  </span>
                </button>
              );
            })}
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
        <p className="font-mono text-[0.55rem] text-text-dim/80 tracking-[0.22em] uppercase text-center">
          Clique em qualquer horário para propor pelo WhatsApp
        </p>
      </div>

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
