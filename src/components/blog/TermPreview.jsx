'use client';

import { useEffect, useRef } from 'react';

/**
 * TermPreview — preview do verbete sem sair da página.
 *
 * Os <a class="term-link"> já existem no HTML estático (inseridos em
 * build-time por src/lib/glossaryLinker.js dentro de BlogPostView). Este
 * componente só ENRIQUECE esses links: no hover/foco, mostra um popover com
 * o campo `short` (via data-term-short) + link "ver verbete completo".
 *
 * Importante: o clique continua sendo navegação real (o <a> nunca perde o
 * href) — em mouse, o popover é só um adendo informativo que não intercepta
 * nada. Em touch (sem :hover), o 1º toque mostra o popover em vez de
 * navegar direto (senão o preview nunca apareceria no celular); o 2º toque
 * no mesmo link, ou o toque no "ver verbete completo", navega normalmente.
 * Se o JS não carregar, o <a> simples continua funcionando de qualquer jeito.
 *
 * Acessibilidade: foco no link abre o popover, Esc fecha e devolve o foco,
 * position é recalculada e clampada dentro da viewport (funciona no
 * mobile), e o popover nunca depende de :hover pra existir.
 */
export default function TermPreview({ articleRef, contentKey }) {
  const activeAnchorRef = useRef(null);

  useEffect(() => {
    const root = articleRef?.current;
    if (!root) return undefined;

    const pop = document.createElement('div');
    pop.className = 'term-preview-popover';
    pop.setAttribute('role', 'tooltip');
    pop.hidden = true;
    document.body.appendChild(pop);

    let hideTimer = null;
    let touchArmedAnchor = null;

    function clearHideTimer() {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    }

    function hide() {
      clearHideTimer();
      pop.hidden = true;
      pop.classList.remove('is-visible');
      activeAnchorRef.current = null;
    }

    function scheduleHide(delay = 150) {
      clearHideTimer();
      hideTimer = setTimeout(() => {
        if (!pop.matches(':hover')) hide();
      }, delay);
    }

    function escapeHtml(s) {
      return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function position(anchor) {
      const margin = 10;
      const rect = anchor.getBoundingClientRect();

      pop.style.visibility = 'hidden';
      pop.hidden = false;
      const popRect = pop.getBoundingClientRect();

      let left = rect.left + rect.width / 2 - popRect.width / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - popRect.width - margin));

      let top = rect.bottom + 8;
      let placement = 'bottom';
      if (top + popRect.height > window.innerHeight - margin) {
        const above = rect.top - popRect.height - 8;
        if (above >= margin) {
          top = above;
          placement = 'top';
        } else {
          // não cabe nem embaixo nem em cima com folga — cola no topo da viewport
          top = margin;
          placement = 'bottom';
        }
      }

      pop.style.left = `${left}px`;
      pop.style.top = `${top}px`;
      pop.dataset.placement = placement;
      pop.style.visibility = 'visible';
    }

    function show(anchor) {
      clearHideTimer();
      const title = anchor.dataset.termTitle || anchor.textContent;
      const short = anchor.dataset.termShort || '';
      const href = anchor.getAttribute('href');
      pop.innerHTML = `
        <p class="term-preview-title">${escapeHtml(title)}</p>
        ${short ? `<p class="term-preview-short">${escapeHtml(short)}</p>` : ''}
        <a class="term-preview-link" href="${href}">Ver verbete completo →</a>
      `;
      activeAnchorRef.current = anchor;
      position(anchor);
      pop.classList.add('is-visible');
    }

    const anchors = Array.from(root.querySelectorAll('a.term-link'));
    if (anchors.length === 0) {
      pop.remove();
      return undefined;
    }

    const hoverCapable = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    function onEnter(e) {
      show(e.currentTarget);
    }
    function onLeave() {
      scheduleHide();
    }
    function onFocus(e) {
      show(e.currentTarget);
    }
    function onAnchorBlur() {
      scheduleHide(120);
    }
    function onClick(e) {
      if (hoverCapable) return; // mouse: link normal, popover é só complemento
      const anchor = e.currentTarget;
      if (touchArmedAnchor !== anchor) {
        // 1º toque: mostra o preview em vez de navegar direto
        e.preventDefault();
        touchArmedAnchor = anchor;
        show(anchor);
      }
      // 2º toque no mesmo link: deixa navegar normalmente
    }

    anchors.forEach((a) => {
      a.addEventListener('mouseenter', onEnter);
      a.addEventListener('mouseleave', onLeave);
      a.addEventListener('focus', onFocus);
      a.addEventListener('blur', onAnchorBlur);
      a.addEventListener('click', onClick);
    });

    pop.addEventListener('mouseenter', clearHideTimer);
    pop.addEventListener('mouseleave', () => scheduleHide(80));

    function onKeyDown(e) {
      if (e.key === 'Escape' && !pop.hidden) {
        const anchor = activeAnchorRef.current;
        hide();
        if (anchor) anchor.focus();
      }
    }
    function onDismissScroll() {
      if (!pop.hidden) hide();
      touchArmedAnchor = null;
    }
    function onOutsideClick(e) {
      if (pop.hidden) return;
      if (pop.contains(e.target) || anchors.includes(e.target)) return;
      hide();
      touchArmedAnchor = null;
    }

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onDismissScroll, { passive: true, capture: true });
    window.addEventListener('resize', onDismissScroll);
    document.addEventListener('click', onOutsideClick, true);

    return () => {
      anchors.forEach((a) => {
        a.removeEventListener('mouseenter', onEnter);
        a.removeEventListener('mouseleave', onLeave);
        a.removeEventListener('focus', onFocus);
        a.removeEventListener('blur', onAnchorBlur);
        a.removeEventListener('click', onClick);
      });
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onDismissScroll, { capture: true });
      window.removeEventListener('resize', onDismissScroll);
      document.removeEventListener('click', onOutsideClick, true);
      pop.remove();
    };
  }, [articleRef, contentKey]);

  return null;
}
