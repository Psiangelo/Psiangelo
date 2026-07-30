'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ListenButton — le o texto em voz alta usando window.speechSynthesis.
 *
 * Lida com as pegadinhas do mobile:
 *  - Chrome Android trava utterances com mais de ~200 chars → quebra em chunks.
 *  - Chrome pausa a sintese apos ~15s inativo → keep-alive com pause/resume.
 *  - iOS Safari so carrega vozes depois do primeiro speak → warm-up.
 *  - voiceschanged pode disparar tardiamente → re-aplica voz em cada chunk.
 *
 * Player: play/pause, parar, velocidade (0.75x–2x, persistida), barra de busca
 * arrastavel (toque e mouse) e pular 15s pra tras/frente. Como a Web Speech API
 * nao expoe posicao de audio, a linha do tempo e estimada por caracteres:
 * cada chunk vira um intervalo, e o seek reinicia a fala no chunk correspondente.
 */

// chars por segundo de fala em pt-BR a 1x — calibrado por ouvido, serve pra estimar tempo
const CHARS_PER_SECOND = 14.5;
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const SKIP_SECONDS = 15;
const RATE_STORAGE_KEY = 'psiangelo:listen-rate';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export default function ListenButton({ text, title, label = 'Ouvir' }) {
  const [state, setState] = useState('idle'); // idle | playing | paused
  const [supported, setSupported] = useState(false);
  const [rate, setRate] = useState(1);
  const [charsDone, setCharsDone] = useState(0); // posicao estimada, em caracteres
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const chunkIndexRef = useRef(0);
  const keepAliveRef = useRef(null);
  const cancelledRef = useRef(false);
  const rateRef = useRef(1);
  const tickRef = useRef(null);
  const chunkStartedAtRef = useRef(0); // timestamp do inicio do chunk atual
  const pausedAtRef = useRef(0); // acumulado de tempo pausado dentro do chunk
  const pauseBeganRef = useRef(0);

  // Quebra o texto em pedacos pequenos pra contornar o limite do Chrome Android (~200 chars).
  // Prefere quebrar em sentencas; se ainda for grande, quebra em virgulas; ultimo recurso: hard split.
  const chunks = useMemo(() => {
    const full = [title, text].filter(Boolean).join('. ');
    const maxLen = 180;
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
  }, [text, title]);

  // offsets[i] = quantos caracteres existem antes do chunk i; ultimo item = total
  const offsets = useMemo(() => {
    const acc = [0];
    for (const c of chunks) acc.push(acc[acc.length - 1] + c.length);
    return acc;
  }, [chunks]);

  const totalChars = offsets[offsets.length - 1] || 0;
  const totalSeconds = totalChars / (CHARS_PER_SECOND * rate);
  const currentChars = seeking ? seekValue : charsDone;
  const elapsedSeconds = currentChars / (CHARS_PER_SECOND * rate);
  const percent = totalChars ? (currentChars / totalChars) * 100 : 0;

  useEffect(() => {
    const has = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(has);
    if (has) {
      // warm-up: acorda o synthesizer no iOS (getVoices volta vazio sem isso)
      try { window.speechSynthesis.getVoices(); } catch {}
      try {
        const saved = parseFloat(window.localStorage.getItem(RATE_STORAGE_KEY));
        if (SPEEDS.includes(saved)) { setRate(saved); rateRef.current = saved; }
      } catch {}
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
      keepAliveRef.current = null;
      tickRef.current = null;
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

  // Interpola a posicao dentro do chunk atual pelo tempo decorrido — onboundary
  // nao dispara em todos os navegadores, entao o relogio e a fonte confiavel.
  const startTicker = useCallback(() => {
    if (tickRef.current) return;
    tickRef.current = setInterval(() => {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
      if (!synth || synth.paused || !synth.speaking) return;
      const i = chunkIndexRef.current;
      const chunk = chunks[i];
      if (!chunk) return;
      const spentMs = Date.now() - chunkStartedAtRef.current - pausedAtRef.current;
      const chunkSeconds = chunk.length / (CHARS_PER_SECOND * rateRef.current);
      const frac = Math.min(1, spentMs / 1000 / Math.max(chunkSeconds, 0.001));
      setCharsDone(offsets[i] + chunk.length * frac);
    }, 250);
  }, [chunks, offsets]);

  const stopTicker = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const speakNext = useCallback(() => {
    if (cancelledRef.current) return;
    const synth = window.speechSynthesis;
    const i = chunkIndexRef.current;
    if (i >= chunks.length) {
      setState('idle');
      setCharsDone(totalChars);
      stopKeepAlive();
      stopTicker();
      return;
    }

    const u = new SpeechSynthesisUtterance(chunks[i]);
    u.lang = 'pt-BR';
    u.rate = rateRef.current;
    u.pitch = 1.0;
    const v = getVoice();
    if (v) u.voice = v;

    u.onstart = () => {
      chunkStartedAtRef.current = Date.now();
      pausedAtRef.current = 0;
      setState('playing');
      startKeepAlive();
      startTicker();
    };
    u.onboundary = (e) => {
      if (typeof e?.charIndex === 'number') {
        setCharsDone(offsets[chunkIndexRef.current] + e.charIndex);
      }
    };
    u.onend = () => {
      if (cancelledRef.current) return;
      chunkIndexRef.current += 1;
      setCharsDone(offsets[chunkIndexRef.current] ?? totalChars);
      speakNext();
    };
    u.onerror = (e) => {
      // "interrupted" e "canceled" sao normais quando usuario para/busca; so loga outros
      if (e?.error && e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[ListenButton] erro:', e.error);
      }
      if (cancelledRef.current) return;
      // tenta continuar no proximo chunk
      chunkIndexRef.current += 1;
      speakNext();
    };

    synth.speak(u);
  }, [chunks, offsets, totalChars, startTicker]);

  // Recomeca a fala a partir de um chunk — usado por seek, skip e troca de velocidade.
  const playFromChunk = useCallback((index) => {
    const synth = window.speechSynthesis;
    const clamped = Math.max(0, Math.min(index, chunks.length - 1));
    cancelledRef.current = true;
    synth.cancel();
    cancelledRef.current = false;
    chunkIndexRef.current = clamped;
    setCharsDone(offsets[clamped]);
    // deixa o cancel drenar a fila antes de falar de novo (Chrome engasga sem isso)
    setTimeout(() => {
      if (!cancelledRef.current) speakNext();
    }, 60);
  }, [chunks.length, offsets, speakNext]);

  const chunkAtChar = useCallback((charPos) => {
    for (let i = chunks.length - 1; i >= 0; i -= 1) {
      if (charPos >= offsets[i]) return i;
    }
    return 0;
  }, [chunks.length, offsets]);

  const start = () => {
    if (!supported || chunks.length === 0) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    cancelledRef.current = false;
    chunkIndexRef.current = 0;
    setCharsDone(0);
    // feedback imediato: o painel abre no clique, sem esperar o onstart da voz
    setState('playing');

    // Se vozes ainda nao carregaram (iOS frio), aguarda e ja comeca
    const voicesReady = synth.getVoices().length > 0;
    if (!voicesReady) {
      let fired = false;
      const kick = () => {
        if (fired) return;
        fired = true;
        synth.removeEventListener('voiceschanged', kick);
        speakNext();
      };
      synth.addEventListener('voiceschanged', kick);
      // fallback: se o evento nao disparar em 500ms, tenta assim mesmo
      setTimeout(kick, 500);
    } else {
      speakNext();
    }
  };

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (state === 'idle') return start();
    if (state === 'playing') {
      synth.pause();
      pauseBeganRef.current = Date.now();
      stopKeepAlive();
      stopTicker();
      setState('paused');
      return;
    }
    if (state === 'paused') {
      if (pauseBeganRef.current) {
        pausedAtRef.current += Date.now() - pauseBeganRef.current;
        pauseBeganRef.current = 0;
      }
      synth.resume();
      startKeepAlive();
      startTicker();
      setState('playing');
    }
  };

  const stop = () => {
    cancelledRef.current = true;
    stopKeepAlive();
    stopTicker();
    window.speechSynthesis.cancel();
    chunkIndexRef.current = 0;
    setState('idle');
    setCharsDone(0);
  };

  const changeRate = () => {
    const next = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length];
    setRate(next);
    rateRef.current = next;
    try { window.localStorage.setItem(RATE_STORAGE_KEY, String(next)); } catch {}
    // a rate de uma utterance ja iniciada e imutavel: refaz o chunk atual na nova velocidade
    if (state !== 'idle') playFromChunk(chunkIndexRef.current);
  };

  const skip = (seconds) => {
    if (state === 'idle') return;
    const delta = seconds * CHARS_PER_SECOND * rateRef.current;
    const target = Math.max(0, Math.min(charsDone + delta, totalChars - 1));
    playFromChunk(chunkAtChar(target));
  };

  const commitSeek = (value) => {
    setSeeking(false);
    if (state === 'idle') {
      // buscar com a leitura parada equivale a comecar dali
      cancelledRef.current = false;
      playFromChunk(chunkAtChar(value));
      return;
    }
    playFromChunk(chunkAtChar(value));
  };

  if (!supported || chunks.length === 0) {
    return null;
  }

  const isActive = state !== 'idle';

  if (!isActive) {
    return (
      <button
        onClick={start}
        aria-label="Ouvir leitura"
        className="inline-flex items-center gap-2 px-4 py-2 border font-mono text-[0.62rem] tracking-[0.2em] uppercase transition-colors border-border-subtle text-text-dim hover:border-accent/50 hover:text-accent"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10v4a1 1 0 001 1h3l4 4V5L7 9H4a1 1 0 00-1 1z" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </svg>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="w-full max-w-xl border border-accent/40 bg-accent/[0.04] px-4 py-3">
      {/* linha 1 — transporte */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => skip(-SKIP_SECONDS)}
          aria-label={`Voltar ${SKIP_SECONDS} segundos`}
          className="p-2 text-text-dim hover:text-accent transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 4 12l7 7" />
            <path d="M20 5l-7 7 7 7" />
          </svg>
        </button>

        <button
          onClick={toggle}
          aria-label={state === 'playing' ? 'Pausar leitura' : 'Continuar leitura'}
          className="flex items-center justify-center w-11 h-11 border border-accent text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
        >
          {state === 'playing' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => skip(SKIP_SECONDS)}
          aria-label={`Avançar ${SKIP_SECONDS} segundos`}
          className="p-2 text-text-dim hover:text-accent transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 5l7 7-7 7" />
            <path d="M4 5l7 7-7 7" />
          </svg>
        </button>

        <span className="ml-1 font-mono text-[0.6rem] tracking-[0.12em] text-text-dim tabular-nums">
          {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={changeRate}
            aria-label={`Velocidade ${rate}x — tocar para mudar`}
            className="min-w-[3rem] px-2 py-2.5 border border-border-subtle text-text-dim hover:text-accent hover:border-accent/50 font-mono text-[0.62rem] tracking-[0.12em] transition-colors tabular-nums"
          >
            {rate}x
          </button>
          <button
            onClick={stop}
            aria-label="Parar leitura"
            className="p-2 text-text-dim hover:text-accent transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* linha 2 — barra de busca */}
      <div className="relative mt-3 h-6 flex items-center">
        <div className="absolute left-0 right-0 h-[3px] bg-border-subtle/60" />
        <div
          className="absolute left-0 h-[3px] bg-accent pointer-events-none"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={0}
          max={Math.max(totalChars - 1, 1)}
          step={1}
          value={Math.round(currentChars)}
          onChange={(e) => { setSeeking(true); setSeekValue(Number(e.target.value)); }}
          onMouseUp={(e) => commitSeek(Number(e.currentTarget.value))}
          onTouchEnd={(e) => commitSeek(Number(e.currentTarget.value))}
          onKeyUp={(e) => commitSeek(Number(e.currentTarget.value))}
          aria-label="Posição da leitura"
          className="listen-seek absolute left-0 right-0 w-full appearance-none bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
}
