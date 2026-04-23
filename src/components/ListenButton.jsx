'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ListenButton — lê o texto em voz alta usando window.speechSynthesis.
 *
 * Lida com as pegadinhas do mobile:
 *  - Chrome Android trava utterances com mais de ~200 chars → quebra em chunks.
 *  - Chrome pausa a sintese apos ~15s inativo → keep-alive com pause/resume.
 *  - iOS Safari so carrega vozes depois do primeiro speak → warm-up.
 *  - voiceschanged pode disparar tardiamente → re-aplica voz em cada chunk.
 */
export default function ListenButton({ text, title, label = 'Ouvir' }) {
  const [state, setState] = useState('idle'); // idle | playing | paused
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(false);

  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);
  const keepAliveRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    const has = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(has);
    if (has) {
      // warm-up: acorda o synthesizer no iOS (getVoices volta vazio sem isso)
      try { window.speechSynthesis.getVoices(); } catch {}
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };
  }, []);

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === 'pt-BR' && /Google|Microsoft|Luciana|Felipe/i.test(v.name)) ||
      voices.find((v) => v.lang === 'pt-BR') ||
      voices.find((v) => v.lang?.startsWith('pt')) ||
      voices[0]
    );
  };

  // Quebra o texto em pedacos pequenos pra contornar o limite do Chrome Android (~200 chars).
  // Prefere quebrar em sentencas; se ainda for grande, quebra em virgulas; ultimo recurso: hard split.
  const splitIntoChunks = (full, maxLen = 180) => {
    if (!full) return [];
    const sentences = full
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);

    const out = [];
    let buf = '';
    for (const s of sentences) {
      if (s.length > maxLen) {
        if (buf) { out.push(buf); buf = ''; }
        // sentenca gigante: quebra em virgulas
        const parts = s.split(/,\s*/);
        let sub = '';
        for (const p of parts) {
          if ((sub + ', ' + p).length > maxLen && sub) { out.push(sub); sub = p; }
          else sub = sub ? `${sub}, ${p}` : p;
        }
        if (sub) {
          if (sub.length > maxLen) {
            // ainda gigante: split duro
            for (let i = 0; i < sub.length; i += maxLen) {
              out.push(sub.slice(i, i + maxLen));
            }
          } else out.push(sub);
        }
      } else if ((buf + ' ' + s).length > maxLen && buf) {
        out.push(buf);
        buf = s;
      } else {
        buf = buf ? `${buf} ${s}` : s;
      }
    }
    if (buf) out.push(buf);
    return out;
  };

  const startKeepAlive = () => {
    if (keepAliveRef.current) return;
    // Chrome Android pausa speech depois de ~15s: pulso a cada 10s mantem vivo
    keepAliveRef.current = setInterval(() => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 10000);
  };

  const stopKeepAlive = () => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  const speakNext = () => {
    if (cancelledRef.current) return;
    const synth = window.speechSynthesis;
    const chunks = chunksRef.current;
    const i = chunkIndexRef.current;
    if (i >= chunks.length) {
      setState('idle');
      setProgress(100);
      stopKeepAlive();
      return;
    }

    const u = new SpeechSynthesisUtterance(chunks[i]);
    u.lang = 'pt-BR';
    u.rate = 1.0;
    u.pitch = 1.0;
    const v = getVoice();
    if (v) u.voice = v;

    u.onstart = () => {
      setState('playing');
      startKeepAlive();
    };
    u.onend = () => {
      chunkIndexRef.current += 1;
      setProgress(Math.round((chunkIndexRef.current / chunks.length) * 100));
      speakNext();
    };
    u.onerror = (e) => {
      // "interrupted" e "canceled" sao normais quando usuario para; so loga outros
      if (e?.error && e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[ListenButton] erro:', e.error);
      }
      // tenta continuar no proximo chunk
      chunkIndexRef.current += 1;
      speakNext();
    };

    synth.speak(u);
  };

  const start = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    cancelledRef.current = false;

    const full = [title, text].filter(Boolean).join('. ');
    chunksRef.current = splitIntoChunks(full);
    chunkIndexRef.current = 0;
    setProgress(0);

    if (chunksRef.current.length === 0) return;

    // Se vozes ainda nao carregaram (iOS frio), aguarda e ja comeca
    const voicesReady = synth.getVoices().length > 0;
    if (!voicesReady) {
      const onReady = () => {
        synth.removeEventListener('voiceschanged', onReady);
        speakNext();
      };
      synth.addEventListener('voiceschanged', onReady);
      // fallback: se evento nao disparar em 500ms, tenta assim mesmo
      setTimeout(() => {
        synth.removeEventListener('voiceschanged', onReady);
        if (state === 'idle') speakNext();
      }, 500);
    } else {
      speakNext();
    }
  };

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (state === 'idle') return start();
    if (state === 'playing') {
      synth.pause();
      stopKeepAlive();
      setState('paused');
      return;
    }
    if (state === 'paused') {
      synth.resume();
      startKeepAlive();
      setState('playing');
    }
  };

  const stop = () => {
    cancelledRef.current = true;
    stopKeepAlive();
    window.speechSynthesis.cancel();
    chunksRef.current = [];
    chunkIndexRef.current = 0;
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
