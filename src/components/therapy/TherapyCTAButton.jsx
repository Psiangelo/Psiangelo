'use client';

import { useState } from 'react';
import TherapyScheduler from './TherapyScheduler';

/**
 * Botão CTA primário que abre o modal de agendamento.
 * Reusável em hero e rodapé.
 */
export default function TherapyCTAButton({ cta, whatsappNumber, label, helper, variant = 'primary' }) {
  const [open, setOpen] = useState(false);
  const classes =
    variant === 'ghost'
      ? 'inline-flex items-center gap-3 px-6 py-3 border border-accent/40 hover:border-accent text-accent hover:text-text-bright transition-colors font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase'
      : 'inline-flex items-center gap-3 bg-accent text-bg px-7 py-3.5 font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase hover:bg-text-bright transition-colors hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10';

  return (
    <>
      <div className="flex flex-col gap-2 items-start">
        <button onClick={() => setOpen(true)} className={classes}>
          {label || cta?.primaryLabel}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        {helper !== false && (helper || cta?.helper) && (
          <span className="font-serif italic text-[0.82rem] text-text-dim">
            {helper || cta?.helper}
          </span>
        )}
      </div>
      <TherapyScheduler
        open={open}
        onClose={() => setOpen(false)}
        config={cta}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
