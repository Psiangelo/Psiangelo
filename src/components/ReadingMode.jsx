'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * ReadingMode — toggle que ativa um modo foco para leitura.
 * Adiciona a classe `reading-mode` no <body>; CSS em globals esconde
 * navbar, TOC e controles. Mostra botão "Sair" flutuante.
 */
export default function ReadingMode() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (active) body.classList.add('reading-mode');
    else body.classList.remove('reading-mode');
    return () => body.classList.remove('reading-mode');
  }, [active]);

  return (
    <>
      <button
        onClick={() => setActive(true)}
        aria-label="Ativar modo leitura"
        className="inline-flex items-center gap-2 px-4 py-2 border border-border-subtle hover:border-accent/50 text-text-dim hover:text-accent font-mono text-[0.62rem] tracking-[0.2em] uppercase transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
        <span>Modo leitura</span>
      </button>

      <AnimatePresence>
        {active && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setActive(false)}
            aria-label="Sair do modo leitura"
            className="fixed bottom-5 right-5 z-[150] inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-text-bright text-bg font-sans text-[0.68rem] font-semibold tracking-[0.2em] uppercase shadow-lg shadow-black/40 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
            Sair leitura
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
