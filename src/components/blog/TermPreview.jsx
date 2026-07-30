'use client';

import { useEffect, useRef } from 'react';

/**
 * TermPreview — card do verbete sem sair da página.
 *
 * Os <a class="term-link"> já existem no HTML estático (inseridos em
 * build-time por src/lib/glossaryLinker.js dentro de BlogPostView) — isso
 * NUNCA muda aqui: o href continua um link real pro verbete, pro leitor sem
 * JS e pro Google. Este componente só ENRIQUECE o comportamento client-side:
 *
 *  - Desktop (hover capaz): passar o mouse já mostra o card como prévia
 *    rápida (não "firmada" — some ao tirar o mouse).
 *  - Clicar no termo (com botão esquerdo, sem Ctrl/Cmd) FIRMA o card aberto
 *    e cancela a navegação (preventDefault). O card fica na tela até Esc,
 *    clique fora ou o botão de fechar.
 *  - Dentro do card, o link "ver verbete completo →" navega pro /glossario/
 *    <slug>/ em NOVA ABA (target=_blank), porque é ele quem carrega o href
 *    real — clicar no termo em si nunca mais navega direto.
 *  - Ctrl/Cmd+clique ou clique do botão do meio no termo: não interceptamos.
 *    O navegador abre em nova aba/janela normalmente, como o usuário pediu.
 *  - Toque (mobile, sem :hover): o toque no termo abre o card firmado
 *    (mesmo comportamento do clique firmado no desktop) — não existe
 *    "primeiro toque = preview, segundo toque = navega" porque o termo em
 *    si nunca navega mais; só o link interno do card navega.
 *
 * Acessibilidade: foco no link mostra o card (prévia, como o hover); Enter
 * no link ativa o <a> nativo, que cai no mesmo tratamento de clique (firma
 * o card). Esc fecha e devolve o foco ao termo. Tab a partir do termo, com
 * o card aberto, entra no card (botão fechar → link "ver verbete completo")
 * antes de seguir pro resto da página — implementado interceptando Tab no
 * termo e no botão de fechar, já que o card fica anexado ao fim do <body>
 * (fora da ordem de documento do parágrafo) por precisar de position:fixed
 * clampado na viewport.
 */
export default function TermPreview({ articleRef, contentKey }) {
  const activeAnchorRef = useRef(null);
  const pinnedRef = useRef(false);

  useEffect(() => {
    const root = articleRef?.current;
    if (!root) return undefined;

    const pop = document.createElement('div');
    pop.className = 'term-preview-popover';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Prévia do verbete');
    pop.hidden = true;
    document.body.appendChild(pop);

    let hideTimer = null;
    let closeBtn = null;
    let linkEl = null;

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
      pinnedRef.current = false;
      activeAnchorRef.current = null;
      closeBtn = null;
      linkEl = null;
    }

    function hideAndReturnFocus() {
      const anchor = activeAnchorRef.current;
      hide();
      if (anchor) anchor.focus();
    }

    function scheduleHide(delay = 150) {
      if (pinnedRef.current) return;
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

    function show(anchor, { pinned = false } = {}) {
      clearHideTimer();
      // se já existe outro card firmado e essa chamada é só hover (não
      // firmada), não atropela o que o usuário abriu de propósito
      if (pinnedRef.current && !pinned && activeAnchorRef.current !== anchor) return;

      const title = anchor.dataset.termTitle || anchor.textContent;
      const short = anchor.dataset.termShort || '';
      const href = anchor.getAttribute('href');
      pop.innerHTML = `
        <button type="button" class="term-preview-close" aria-label="Fechar prévia">&times;</button>
        <p class="term-preview-title">${escapeHtml(title)}</p>
        ${short ? `<p class="term-preview-short">${escapeHtml(short)}</p>` : ''}
        <a class="term-preview-link" href="${href}" target="_blank" rel="noopener noreferrer">
          Ver verbete completo
          <span class="term-preview-link-icon" aria-hidden="true">↗</span>
          <span class="sr-only"> (abre em nova aba)</span>
        </a>
      `;
      closeBtn = pop.querySelector('.term-preview-close');
      linkEl = pop.querySelector('.term-preview-link');
      closeBtn.addEventListener('click', hideAndReturnFocus);
      closeBtn.addEventListener('keydown', onCloseBtnKeyDown);

      activeAnchorRef.current = anchor;
      pinnedRef.current = pinned;
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
      show(e.currentTarget, { pinned: false });
    }
    function onLeave() {
      scheduleHide();
    }
    function onFocus(e) {
      // foco por teclado (Tab) chegando no termo: mostra como prévia, igual
      // ao hover — só firma de verdade se o usuário ativar (Enter -> click)
      show(e.currentTarget, { pinned: false });
    }
    function onAnchorBlur(e) {
      // se o foco está indo pro próprio card (botão fechar / link), não
      // esconde — só esconde se saiu pra outro lugar
      if (pinnedRef.current) return;
      const next = e.relatedTarget;
      if (next && pop.contains(next)) return;
      scheduleHide(120);
    }
    function onClick(e) {
      // Ctrl/Cmd+clique ou clique do botão do meio: deixa o navegador tratar
      // a abertura em nova aba/janela normalmente, sem interceptar.
      if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      show(e.currentTarget, { pinned: true });
    }
    function onAnchorKeyDown(e) {
      if (e.key === 'Tab' && !e.shiftKey && activeAnchorRef.current === e.currentTarget && !pop.hidden) {
        // entra no card em vez de pular pro próximo elemento da página
        e.preventDefault();
        (closeBtn || linkEl)?.focus();
      }
    }
    function onCloseBtnKeyDown(e) {
      if (e.key === 'Tab' && e.shiftKey) {
        // volta o foco pro termo em vez de sair do card por trás
        e.preventDefault();
        activeAnchorRef.current?.focus();
      }
    }

    anchors.forEach((a) => {
      // hover só é ligado em dispositivos capazes de :hover — em touch,
      // alguns navegadores emitem mouseenter/mouseleave "fantasmas" depois
      // do toque, o que bagunçaria o estado firmado do card.
      if (hoverCapable) {
        a.addEventListener('mouseenter', onEnter);
        a.addEventListener('mouseleave', onLeave);
      }
      a.addEventListener('focus', onFocus);
      a.addEventListener('blur', onAnchorBlur);
      a.addEventListener('click', onClick);
      a.addEventListener('keydown', onAnchorKeyDown);
    });

    pop.addEventListener('mouseenter', clearHideTimer);
    pop.addEventListener('mouseleave', () => scheduleHide(80));

    function onKeyDown(e) {
      if (e.key === 'Escape' && !pop.hidden) {
        hideAndReturnFocus();
      }
    }
    function onDismissScroll() {
      if (!pop.hidden) hide();
    }
    function onOutsideClick(e) {
      if (pop.hidden) return;
      if (pop.contains(e.target) || anchors.includes(e.target)) return;
      hide();
    }

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onDismissScroll, { passive: true, capture: true });
    window.addEventListener('resize', onDismissScroll);
    document.addEventListener('click', onOutsideClick, true);

    return () => {
      anchors.forEach((a) => {
        if (hoverCapable) {
          a.removeEventListener('mouseenter', onEnter);
          a.removeEventListener('mouseleave', onLeave);
        }
        a.removeEventListener('focus', onFocus);
        a.removeEventListener('blur', onAnchorBlur);
        a.removeEventListener('click', onClick);
        a.removeEventListener('keydown', onAnchorKeyDown);
      });
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onDismissScroll, { capture: true });
      window.removeEventListener('resize', onDismissScroll);
      document.removeEventListener('click', onOutsideClick, true);
      pop.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleRef, contentKey]);

  return null;
}
