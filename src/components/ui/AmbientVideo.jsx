'use client';

import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/basepath';

/**
 * AmbientVideo — footage de fundo, decorativo, sem áudio e sem controles.
 *
 * Regras que ele garante sozinho:
 * - o poster aparece na hora; o mp4 só é anexado quando a seção chega perto da
 *   viewport (IntersectionObserver), então nenhuma faixa fora da dobra baixa
 *   vídeo em quem não rolou até lá;
 * - `prefers-reduced-motion` e o Save-Data do navegador cancelam o vídeo por
 *   completo — fica só o poster;
 * - o basePath do GitHub Pages entra pelo img(), como no resto do site.
 *
 * O scrim NÃO vem daqui: cada seção desenha o seu, porque o gradiente depende
 * de onde o texto cai.
 */
export default function AmbientVideo({
  src,
  poster,
  className = '',
  opacity = 0.55,
  eager = false,
  objectPosition = 'center',
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Usuário pediu menos movimento, ou está economizando dados: só poster.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    if (reduce || saveData) return;

    if (eager) {
      setShouldLoad(true);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  // Alguns navegadores ignoram o autoPlay quando o src entra depois do mount
  useEffect(() => {
    if (!shouldLoad) return;
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, [shouldLoad]);

  const posterSrc = poster ? img(poster) : undefined;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {posterSrc && (
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition }}
        />
      )}
      {shouldLoad && (
        <video
          ref={videoRef}
          src={img(src)}
          poster={posterSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
