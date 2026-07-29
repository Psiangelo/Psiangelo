'use client';

import { useState } from 'react';
import Button, { ArrowIcon } from '@/components/ui/Button';
import TherapyScheduler from './TherapyScheduler';

/**
 * Botão CTA primário que abre o modal de agendamento.
 * Reusável em hero e rodapé.
 */
export default function TherapyCTAButton({ cta, whatsappNumber, label, helper, variant = 'primary' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2 items-start">
        <Button
          onClick={() => setOpen(true)}
          variant={variant === 'ghost' ? 'outline' : 'solid'}
          icon={<ArrowIcon />}
        >
          {label || cta?.primaryLabel}
        </Button>
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
