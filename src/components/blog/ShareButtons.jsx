'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ShareButtons({ title }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setUrl(window.location.href);
  }, []);

  const encoded = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title || ''),
  };

  const flashToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  };

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback iOS antigo / contexto não-seguro
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      flashToast('Link copiado');
      setTimeout(() => setCopied(false), 1600);
    } catch {
      flashToast('Não foi possível copiar');
    }
  };

  const items = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encoded.title}%20${encoded.url}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      ),
    },
    {
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim mr-1">
          Compartilhar
        </span>
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${it.label}`}
            className="w-9 h-9 inline-flex items-center justify-center border border-border-subtle hover:border-accent/50 text-text-dim hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
            title={it.label}
          >
            {it.icon}
          </a>
        ))}
        <button
          onClick={copy}
          aria-label="Copiar link"
          title="Copiar link"
          className="w-9 h-9 inline-flex items-center justify-center border border-border-subtle hover:border-accent/50 text-text-dim hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
      </div>

      {/* Toast flutuante — feedback visual pro mobile onde o tick some facil */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed left-1/2 -translate-x-1/2 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] z-[200] pointer-events-none"
      >
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="bg-bg-card border border-accent/40 text-text-bright font-mono text-[0.62rem] tracking-[0.22em] uppercase px-4 py-2.5 rounded shadow-lg shadow-black/40"
            >
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
