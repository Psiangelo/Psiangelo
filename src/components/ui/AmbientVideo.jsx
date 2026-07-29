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
 * - em telas de celular fica só o poster: decodificar vídeo em loop é o que
 *   mais derruba o FPS em aparelho modesto, e como o clipe é ambiente a imagem
 *   parada entrega quase a mesma coisa. `keepOnMobile` libera caso a caso;
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
  keepOnMobile = false,
  objectPosition = 'center',
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Só poster quando: pediram menos movimento, estão economizando dados, ou
    // é tela de celular. A decisão fica aqui dentro do efeito de propósito —
    // assim o <video> nunca chega a entrar no DOM nesses casos.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    const isPhone = window.matchMedia?.('(max-width: 767px)').matches;
    if (reduce || saveData || (isPhone && !keepOnMobile)) return;

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
  }, [eager, keepOnMobile]);

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
