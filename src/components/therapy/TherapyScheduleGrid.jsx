'use client';

import { useMemo, useState } from 'react';
import TherapyScheduler from './TherapyScheduler';

function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Gera slots dos próximos N dias a partir das janelas recorrentes
function buildSlots(windows, slotMinutes, daysAhead = 14) {
  const out = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const byDow = new Map();
  for (const w of windows) byDow.set(w.dow, w);

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const w = byDow.get(dow);
    if (!w) continue;
    const durH = slotMinutes / 60;
    for (let h = w.startHour; h + durH <= w.endHour; h += durH) {
      const slotDate = new Date(d);
      slotDate.setHours(Math.floor(h));
      slotDate.setMinutes((h - Math.floor(h)) * 60);
      // Skip slots no passado (hoje)
      if (slotDate <= new Date()) continue;
      out.push({
        date: slotDate,
        dow,
        dayLabel: w.label || d.toLocaleDateString('pt-BR', { weekday: 'long' }),
        hourLabel: `${String(slotDate.getHours()).padStart(2, '0')}h${String(slotDate.getMinutes()).padStart(2, '0')}`,
      });
    }
  }
  return out;
}

const MONTH_ABBR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export default function TherapyScheduleGrid({ schedule, cta, whatsappNumber }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [slotLabel, setSlotLabel] = useState('');

  const slots = useMemo(
    () => buildSlots(schedule?.windows || [], schedule?.slotMinutes || 60, 14),
    [schedule],
  );

  // Agrupa por dia
  const grouped = useMemo(() => {
    const map = new Map();
    for (const s of slots) {
      const key = s.date.toDateString();
      if (!map.has(key)) {
        map.set(key, {
          date: s.date,
          dayLabel: s.dayLabel,
          slots: [],
        });
      }
      map.get(key).slots.push(s);
    }
    return [...map.values()];
  }, [slots]);

  if (grouped.length === 0) {
    return (
      <p className="font-serif italic text-text-dim text-center py-10">
        Nenhum horário disponível nas próximas duas semanas.
      </p>
    );
  }

  const open = (s) => {
    const day = s.date.getDate();
    const month = MONTH_ABBR[s.date.getMonth()];
    const dow = capitalizeFirst(s.dayLabel);
    setSlotLabel(`${dow}, ${day} de ${month}, ${s.hourLabel}`);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {grouped.map((g) => (
          <div key={g.date.toDateString()} className="bg-bg-card/40 border border-border-subtle p-4">
            <header className="flex items-baseline justify-between mb-3 pb-2 border-b border-border-subtle/50">
              <div>
                <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase">
                  {capitalizeFirst(g.dayLabel)}
                </p>
                <p className="font-serif text-[1.1rem] text-text-bright">
                  {g.date.getDate()} <span className="text-[0.82rem] text-text-dim">de {MONTH_ABBR[g.date.getMonth()]}</span>
                </p>
              </div>
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                {g.slots.length} hor{g.slots.length === 1 ? 'a' : 'as'}
              </span>
            </header>
            <div className="flex flex-wrap gap-1.5">
              {g.slots.map((s) => (
                <button
                  key={s.date.toISOString()}
                  onClick={() => open(s)}
                  className="px-3 py-1.5 border border-border-subtle hover:border-accent/50 hover:bg-accent/5 text-text transition-colors font-mono text-[0.72rem] tracking-[0.08em]"
                >
                  {s.hourLabel}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TherapyScheduler
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        config={cta}
        whatsappNumber={whatsappNumber}
        initialSlot={slotLabel}
      />
    </>
  );
}
