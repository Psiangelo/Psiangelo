'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ListenButton — lê o texto fornecido em voz alta usando
 * window.speechSynthesis (Web Speech API). Sem backend.
 *
 * - Preferência por vozes pt-BR
 * - Ctrl/Cmd + clique pula para o próximo parágrafo
 * - Integra pause/resume
 *
 * Props:
 *   text: string — texto a ser lido (limpo, sem HTML)
 *   title?: string — lido antes do corpo
 *   label?: string — texto no botão (default "Ouvir")
 */
export default function ListenButton({ text, title, label = 'Ouvir' }) {
  const [state, setState] = useState('idle'); // idle | playing | paused
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === 'pt-BR' && /Google|Microsoft/i.test(v.name)) ||
      voices.find((v) => v.lang === 'pt-BR') ||
      voices.find((v) => v.lang.startsWith('pt')) ||
      voices[0]
    );
  };

  const start = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const full = [title, text].filter(Boolean).join('. ');
    const u = new SpeechSynthesisUtterance(full);
    u.lang = 'pt-BR';
    u.rate = 1.0;
    u.pitch = 1.0;

    // Tenta usar voz pt-BR. Se voices não carregaram, re-fetch no onvoiceschanged
    const apply = () => {
      const v = getVoice();
      if (v) u.voice = v;
    };
    apply();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', apply, { once: true });
    }

    u.onstart = () => setState('playing');
    u.onend = () => {
      setState('idle');
      setProgress(0);
    };
    u.onerror = () => setState('idle');
    u.onboundary = (e) => {
      if (e.name === 'word' && u.text) {
        setProgress(Math.min(100, (e.charIndex / u.text.length) * 100));
      }
    };

    utteranceRef.current = u;
    synth.speak(u);
  };

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (state === 'idle') return start();
    if (state === 'playing') {
      synth.pause();
      setState('paused');
      return;
    }
    if (state === 'paused') {
      synth.resume();
      setState('playing');
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setState('idle');
    setProgress(0);
  };

  if (!supported) {
    return null;
  }

  const isActive = state !== 'idle';

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={toggle}
        aria-label={state === 'playing' ? 'Pausar leitura' : 'Ouvir'}
        className={`inline-flex items-center gap-2 px-4 py-2 border font-mono text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
          isActive
            ? 'border-accent text-accent bg-accent/10'
            : 'border-border-subtle text-text-dim hover:border-accent/50 hover:text-accent'
        }`}
      >
        {state === 'playing' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : state === 'paused' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10v4a1 1 0 001 1h3l4 4V5L7 9H4a1 1 0 00-1 1z" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
          </svg>
        )}
        <span>
          {state === 'playing' ? 'Pausar' : state === 'paused' ? 'Continuar' : label}
        </span>
        {isActive && (
          <span className="ml-1 text-accent/70">{Math.round(progress)}%</span>
        )}
      </button>
      {isActive && (
        <button
          onClick={stop}
          aria-label="Parar leitura"
          className="inline-flex items-center gap-1 px-3 py-2 border border-border-subtle text-text-dim hover:text-accent hover:border-accent/50 font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
          Parar
        </button>
      )}
    </div>
  );
}
