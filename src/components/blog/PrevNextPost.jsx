'use client';

import { renderHighlightedTitle } from '@/lib/highlightTitle';

/**
 * PrevNextPost — navegação sequencial "anterior / próximo" ao final do post.
 * Baseia-se em ordem cronológica (updated_at desc) dos published posts.
 * Pinned não altera essa ordem — aqui é timeline editorial pura.
 */
export default function PrevNextPost({ currentPost, allPosts, onNavigate }) {
  const published = allPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  const idx = published.findIndex((p) => p.id === currentPost.id);
  if (idx < 0) return null;

  // Ordem cronológica: newer no indice menor, older no maior.
  // "Próximo" (na leitura) = mais recente; "anterior" = mais antigo.
  const next = idx > 0 ? published[idx - 1] : null;
  const prev = idx < published.length - 1 ? published[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Navegação entre publicações"
      className="mt-14 pt-8 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
    >
      {prev ? (
        <button
          onClick={() => onNavigate(prev)}
          className="group text-left p-5 border border-border-subtle hover:border-accent/40 bg-bg-card/40 transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent/70 flex items-center gap-2">
            <span aria-hidden>←</span> Ensaio anterior
          </span>
          <h3 className="mt-2 font-serif text-[1.02rem] text-text-bright leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {renderHighlightedTitle(prev.title)}
          </h3>
        </button>
      ) : <span />}

      {next ? (
        <button
          onClick={() => onNavigate(next)}
          className="group text-right p-5 border border-border-subtle hover:border-accent/40 bg-bg-card/40 transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent/70 flex items-center justify-end gap-2">
            Próximo ensaio <span aria-hidden>→</span>
          </span>
          <h3 className="mt-2 font-serif text-[1.02rem] text-text-bright leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {renderHighlightedTitle(next.title)}
          </h3>
        </button>
      ) : <span />}
    </nav>
  );
}
