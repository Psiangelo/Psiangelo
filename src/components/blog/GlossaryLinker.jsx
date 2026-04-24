'use client';

import { useEffect } from 'react';
import { glossario } from '@/data/glossario';
import { BASE_PATH } from '@/lib/basepath';

/**
 * GlossaryLinker — hook invocado pelo BlogPostView que percorre o corpo
 * do post (articleRef) e linka automaticamente a PRIMEIRA ocorrência de
 * cada termo do glossário junguiano. Cria `<a class="term-link">` com
 * title (short) e href pra /glossario/{slug}.
 *
 * Regras:
 *  - Só primeira ocorrência — evita poluir o texto
 *  - Skip em headings, code, pre, existing <a>, buttons
 *  - Word boundary, case-insensitive, preserva case original
 *  - Match também por aliases (ex: "si mesmo" → Self)
 */
export default function GlossaryLinker({ articleRef, contentKey }) {
  useEffect(() => {
    const root = articleRef?.current;
    if (!root) return;

    // Monta lista de (termo, slug, short, regex) ordenada por tamanho desc
    // — matches mais longos primeiro pra "si mesmo" bater antes de "si".
    const entries = glossario.flatMap((g) => {
      const variants = [g.term, ...(g.aliases || [])];
      return variants.map((v) => ({
        variant: v,
        slug: g.slug,
        short: g.short,
        term: g.term,
      }));
    });
    entries.sort((a, b) => b.variant.length - a.variant.length);

    // escapa regex special chars
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const used = new Set(); // slug — só primeira ocorrência por verbete

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Skip em headings, code, pre, already-linked, buttons, toc, pullquotes
        if (parent.closest('a, code, pre, h1, h2, h3, h4, h5, h6, button, .term-link, .no-glossary, blockquote.pullquote')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    // Coleta nós primeiro (modificar DOM quebra o walker)
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    for (const node of textNodes) {
      let text = node.nodeValue;
      let match = null;
      let matchedEntry = null;

      // Procura primeiro termo ainda não usado que bata neste nó
      for (const entry of entries) {
        if (used.has(entry.slug)) continue;
        const re = new RegExp(`\\b(${esc(entry.variant)})\\b`, 'i');
        const m = re.exec(text);
        if (m) {
          if (!match || m.index < match.index) {
            match = m;
            matchedEntry = entry;
          }
        }
      }

      if (!match || !matchedEntry) continue;

      // Quebra o text node: antes | link | depois
      const before = text.slice(0, match.index);
      const hit = text.slice(match.index, match.index + match[0].length);
      const after = text.slice(match.index + match[0].length);

      const parent = node.parentNode;
      const frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      const a = document.createElement('a');
      a.href = `${BASE_PATH}/glossario/${matchedEntry.slug}/`;
      a.className = 'term-link';
      a.title = matchedEntry.short;
      a.setAttribute('data-term', matchedEntry.term);
      a.textContent = hit;
      frag.appendChild(a);
      if (after) frag.appendChild(document.createTextNode(after));
      parent.replaceChild(frag, node);

      used.add(matchedEntry.slug);
    }
  }, [articleRef, contentKey]);

  return null;
}
