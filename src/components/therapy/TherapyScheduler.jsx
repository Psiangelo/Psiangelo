'use client';

import { useMemo, useState } from 'react';
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
  const [motivation, setMotivation] = useState('');
  const [format, setFormat] = useState('');
  const [slot, setSlot] = useState(initialSlot);
  const [message, setMessage] = useState('');

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

  const reset = () => {
    setStep(0);
    setMotivation('');
    setFormat('');
    setSlot(initialSlot);
    setMessage('');
  };

  const close = () => {
    onClose?.();
    setTimeout(reset, 200);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed z-[301] inset-x-3 bottom-3 sm:inset-auto sm:top-[50%] sm:left-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2 w-auto sm:w-[min(560px,92vw)] bg-bg-warm border border-accent/30 shadow-2xl shadow-black/50"
            role="dialog"
            aria-label="Marcar primeira conversa"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase">
                  Passo {step + 1} de 3
                </p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`block w-5 h-px ${i <= step ? 'bg-accent' : 'bg-accent/20'}`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Fechar"
                className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-accent transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <div className="p-5 sm:p-7 max-h-[72vh] overflow-y-auto">
              {step === 0 && (
                <div>
                  <h3 className="font-serif text-[1.35rem] text-text-bright mb-1">
                    {config?.modalTitleStep1 || 'O que te traz?'}
                  </h3>
                  <p className="font-serif italic text-text-dim text-[0.9rem] mb-5">
                    Sem pressão — é só pra eu entender o contexto da nossa conversa.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {motivations.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setMotivation(m);
                          setStep(1);
                        }}
                        className={`text-left px-4 py-3 border transition-colors ${
                          motivation === m
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border-subtle hover:border-accent/40 text-text-bright'
                        }`}
                      >
                        <span className="font-serif text-[1rem]">{m}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-serif text-[1.35rem] text-text-bright mb-1">
                    {config?.modalTitleStep2 || 'Como você prefere?'}
                  </h3>
                  <p className="font-serif italic text-text-dim text-[0.9rem] mb-5">
                    Online ou presencial — o que estiver mais confortável pra você.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {formats.map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setFormat(f);
                          setStep(2);
                        }}
                        className={`text-left px-4 py-3 border transition-colors ${
                          format === f
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border-subtle hover:border-accent/40 text-text-bright'
                        }`}
                      >
                        <span className="font-serif text-[1rem]">{f}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between font-mono text-[0.55rem] tracking-[0.22em] uppercase">
                    <button
                      onClick={() => setStep(0)}
                      className="text-text-dim hover:text-accent transition-colors"
                    >
                      ← Voltar
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-serif text-[1.35rem] text-text-bright mb-1">
                    {config?.modalTitleStep3 || 'Mensagem'}
                  </h3>
                  <p className="font-serif italic text-text-dim text-[0.9rem] mb-5">
                    Vou receber no WhatsApp. Você pode editar antes de enviar.
                  </p>
                  <textarea
                    value={effectiveMessage}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    className="w-full bg-bg-card/50 border border-border-subtle focus:border-accent/40 outline-none text-text-bright font-serif text-[0.95rem] leading-relaxed p-4 resize-y"
                  />
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim hover:text-accent transition-colors"
                    >
                      ← Voltar
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => close()}
                      className="inline-flex items-center justify-center gap-3 bg-accent text-bg px-6 py-3 font-sans text-[0.72rem] font-semibold tracking-[0.18em] uppercase hover:bg-text-bright transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                      Abrir conversa no WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
