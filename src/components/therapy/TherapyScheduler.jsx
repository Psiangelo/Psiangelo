'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function renderTemplate(template, { motivation, format, slot }) {
  const slotPart = slot ? `\nHorário preferido: ${slot}` : '';
  return template
    .replace('{{motivation}}', motivation || '—')
    .replace('{{format}}', format || '—')
    .replace('{{slot}}', slotPart);
}

export default function TherapyScheduler({
  open,
  onClose,
  config,
  whatsappNumber,
  initialSlot = '',
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [motivation, setMotivation] = useState('');
  const [format, setFormat] = useState('');
  const [slot, setSlot] = useState(initialSlot);
  const [message, setMessage] = useState('');

  // reset when slot is passed from grid
  useEffect(() => {
    if (open) setSlot(initialSlot);
  }, [open, initialSlot]);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [open, onClose]);

  const motivations = config?.motivations || [];
  const formats = config?.formats || [];
  const template = config?.messageTemplate || '';

  const assembled = useMemo(
    () => renderTemplate(template, { motivation, format, slot }),
    [template, motivation, format, slot],
  );
  const effectiveMessage = message || assembled;
  const whatsappUrl = `https://wa.me/${(whatsappNumber || '').replace(/\D/g, '')}?text=${encodeURIComponent(
    effectiveMessage,
  )}`;

  const goto = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const reset = () => {
    setStep(0);
    setDirection(1);
    setMotivation('');
    setFormat('');
    setSlot(initialSlot);
    setMessage('');
  };

  const close = () => {
    onClose?.();
    setTimeout(reset, 260);
  };

  const progressPct = ((step + 1) / 3) * 100;

  const stepVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
          />
          <div
            className="fixed inset-0 z-[301] flex items-end sm:items-center justify-center pointer-events-none"
          >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Marcar primeira conversa"
            className="pointer-events-auto
                       w-full sm:w-[min(620px,92vw)]
                       max-h-[92vh] sm:max-h-[84vh]
                       flex flex-col
                       bg-bg-warm sm:border border-accent/30
                       rounded-t-3xl sm:rounded-sm
                       shadow-2xl shadow-black/60"
          >
            {/* Swipe handle (mobile only) */}
            <div className="sm:hidden pt-2 pb-1 flex justify-center flex-shrink-0">
              <span className="block w-10 h-1 rounded-full bg-accent/30" />
            </div>

            {/* Header fixo */}
            <header className="flex items-center gap-4 px-5 sm:px-7 py-3 sm:py-4 border-b border-border-subtle flex-shrink-0">
              <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase whitespace-nowrap">
                Passo {step + 1} <span className="text-text-dim/60">de 3</span>
              </p>
              <div className="flex-1 h-px bg-accent/15 relative overflow-hidden">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <button
                onClick={close}
                aria-label="Fechar"
                className="w-8 h-8 -mr-1 flex items-center justify-center text-text-dim hover:text-accent transition-colors rounded-full"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </header>

            {/* Conteúdo com scroll interno */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5 sm:p-7"
                >
                  {step === 0 && (
                    <StepOne
                      title={config?.modalTitleStep1 || 'O que te traz?'}
                      motivations={motivations}
                      selected={motivation}
                      onSelect={(m) => {
                        setMotivation(m);
                        goto(1);
                      }}
                    />
                  )}

                  {step === 1 && (
                    <StepTwo
                      title={config?.modalTitleStep2 || 'Como você prefere?'}
                      formats={formats}
                      selected={format}
                      onSelect={(f) => {
                        setFormat(f);
                        goto(2);
                      }}
                      onBack={() => goto(0)}
                    />
                  )}

                  {step === 2 && (
                    <StepThree
                      title={config?.modalTitleStep3 || 'Mensagem'}
                      value={effectiveMessage}
                      onChange={setMessage}
                      onBack={() => goto(1)}
                      whatsappUrl={whatsappUrl}
                      onSent={close}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function StepOne({ title, motivations, selected, onSelect }) {
  return (
    <div>
      <h3 className="font-serif text-[1.5rem] sm:text-[1.7rem] text-text-bright leading-tight mb-1.5">
        {title}
      </h3>
      <p className="font-serif italic text-text-dim text-[0.92rem] mb-5 sm:mb-6">
        Sem pressão — é só pra eu entender o contexto da nossa conversa.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {motivations.map((m, i) => (
          <motion.button
            key={m}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            onClick={() => onSelect(m)}
            className={`group relative text-left px-4 py-3 border transition-all overflow-hidden ${
              selected === m
                ? 'border-accent bg-accent/10'
                : 'border-border-subtle hover:border-accent/40 hover:bg-accent/5'
            }`}
          >
            <span
              className={`absolute inset-y-0 left-0 w-0.5 bg-accent transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top ${
                selected === m ? 'scale-y-100' : ''
              }`}
            />
            <span className="font-serif text-[0.98rem] text-text-bright block">{m}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepTwo({ title, formats, selected, onSelect, onBack }) {
  return (
    <div>
      <h3 className="font-serif text-[1.5rem] sm:text-[1.7rem] text-text-bright leading-tight mb-1.5">
        {title}
      </h3>
      <p className="font-serif italic text-text-dim text-[0.92rem] mb-5 sm:mb-6">
        Online ou presencial — o que estiver mais confortável para você.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {formats.map((f, i) => (
          <motion.button
            key={f}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            onClick={() => onSelect(f)}
            className={`group relative text-left p-5 border transition-all overflow-hidden ${
              selected === f
                ? 'border-accent bg-accent/10'
                : 'border-border-subtle hover:border-accent/40 hover:bg-accent/5'
            }`}
          >
            <span
              className={`absolute inset-y-0 left-0 w-0.5 bg-accent transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top ${
                selected === f ? 'scale-y-100' : ''
              }`}
            />
            <span className="font-serif text-[1.05rem] text-text-bright block">{f}</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-6 flex justify-start">
        <button
          onClick={onBack}
          className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-text-dim hover:text-accent transition-colors inline-flex items-center gap-2"
        >
          <span>←</span> Voltar
        </button>
      </div>
    </div>
  );
}

function StepThree({ title, value, onChange, onBack, whatsappUrl, onSent }) {
  return (
    <div>
      <h3 className="font-serif text-[1.5rem] sm:text-[1.7rem] text-text-bright leading-tight mb-1.5">
        {title}
      </h3>
      <p className="font-serif italic text-text-dim text-[0.92rem] mb-5 sm:mb-6">
        Vou receber no WhatsApp. Você pode editar antes de enviar.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        className="w-full bg-bg-card/40 border border-border-subtle focus:border-accent/50 outline-none text-text-bright font-serif text-[0.95rem] leading-[1.7] p-4 resize-y transition-colors"
      />
      <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-text-dim hover:text-accent transition-colors inline-flex items-center gap-2 justify-start sm:justify-center"
        >
          <span>←</span> Voltar
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onSent}
          className="group inline-flex items-center justify-center gap-3 bg-accent text-bg px-6 py-3.5 font-sans text-[0.72rem] font-semibold tracking-[0.18em] uppercase hover:bg-text-bright transition-colors w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
          Abrir conversa no WhatsApp
          <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}
