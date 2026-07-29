'use client';

import { useEffect, useState } from 'react';

/**
 * CursorGlow — disco dourado translúcido que segue o cursor do mouse.
 * Aplicar em hero/ páginas de destaque para reforçar a sensação editorial.
 * Some em mobile (sem cursor real).
 *
 * Props:
 *   size: diâmetro em px (default 360)
 *   intensity: opacidade pico (0..1, default 0.10)
 *   contained: se true, o glow só renderiza dentro de um container relative
 */
export default function CursorGlow({ size = 380, intensity = 0.1, contained = false }) {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Só ativa em devices com hover real (desktop)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    let raf = 0;
    let nextX = -1000;
    let nextY = -1000;

    const handleMove = (e) => {
      nextX = e.clientX;
      nextY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          setPos({ x: nextX, y: nextY });
          raf = 0;
        });
      }
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerleave', handleLeave);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
      document.removeEventListener('mouseleave', handleLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [visible]);

  // No touch não existe cursor a seguir, e este wrapper tem mix-blend-mode em
  // tela cheia: mesmo invisível, obrigava o navegador a compor a tela toda a
  // cada quadro. Em celular ele simplesmente não entra no DOM.
  if (!enabled) return null;

  return (
    <div
      className={`pointer-events-none ${contained ? 'absolute inset-0 overflow-hidden' : 'fixed inset-0'} z-[2]`}
      aria-hidden
      style={{ mixBlendMode: 'screen' }}
    >
      <div
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          left: pos.x - size / 2,
          top: pos.y - size / 2,
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          background: `radial-gradient(circle, rgba(180,140,80,${intensity}) 0%, rgba(180,140,80,${intensity * 0.4}) 35%, transparent 70%)`,
          transform: 'translate3d(0,0,0)',
        }}
      />
    </div>
  );
}
