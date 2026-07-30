'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PosterCover from '@/components/ui/PosterCover';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';

function readTimeOf(html) {
  const words = (html || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function pickRelated(currentPost, allPosts, max = 3) {
  const tags = new Set(currentPost.tags || []);
  const others = allPosts.filter((p) => p.id !== currentPost.id && p.status === 'published');
  const scored = others.map((p) => {
    let score = 0;
    for (const t of p.tags || []) if (tags.has(t)) score += 2;
    if (p.series_id && p.series_id === currentPost.series_id) score += 3;
    return { p, score };
  });
  const withScore = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  const picked = withScore.slice(0, max).map((x) => x.p);
  if (picked.length < max) {
    const fallback = others
      .filter((p) => !picked.find((x) => x.id === p.id))
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
      .slice(0, max - picked.length);
    picked.push(...fallback);
  }
  return picked;
}

export default function RelatedPosts({ currentPost, allPosts }) {
  const related = pickRelated(currentPost, allPosts, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border-subtle">
      <header className="flex items-center gap-4 mb-8">
        <span className="block w-10 h-px bg-accent/50" />
        <p className="font-mono text-[0.6rem] text-accent tracking-[0.28em] uppercase">
          Continuar lendo
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {related.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={`/blog/${p.slug || p.id}/`}
              className="group block w-full text-left bg-bg-card/60 border border-border-subtle hover:border-accent/40 transition-colors overflow-hidden h-full"
            >
              {p.featured_image ? (
                <PosterCover
                  src={p.featured_image}
                  alt={p.featured_image_alt || stripHighlights(p.title)}
                  aspect="16/10"
                  seed={p.slug || p.id || p.title || ''}
                  intensity={2}
                />
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-bg-warm via-bg-card to-bg flex items-center justify-center">
                  <span className="font-serif italic text-accent/40 text-2xl">ψ</span>
                </div>
              )}
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  {(p.tags || []).slice(0, 1).map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.5rem] tracking-[0.2em] uppercase text-accent"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="font-mono text-[0.5rem] text-text-dim tracking-[0.2em] uppercase">
                    {readTimeOf(p.content_html)} min
                  </span>
                </div>
                <h3 className="font-serif text-[1.05rem] text-text-bright leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {renderHighlightedTitle(p.title)}
                </h3>
                {p.excerpt && (
                  <p className="mt-2 text-[0.82rem] text-text-dim leading-relaxed line-clamp-2">
                    {p.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
