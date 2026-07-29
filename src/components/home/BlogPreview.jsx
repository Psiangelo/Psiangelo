'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';
import { SpiralAccent } from '@/components/illustrations';
import PosterCover from '@/components/ui/PosterCover';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';
import { useSectionLabel } from '@/lib/useLabels';
import { slugifyTag } from '@/lib/tagSlug';

const STORAGE_KEY = 'angelo_admin_blog';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function calculateReadingTime(html) {
  if (!html) return 0;
  const words = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * BlogPreview — grade dos ensaios recentes.
 *
 * `skip` existe porque o FeaturedEssay já mostra o primeiro post: quando aquela
 * seção está ligada, esta começa do segundo pra não repetir a mesma capa duas
 * vezes na mesma rolagem.
 */
export default function BlogPreview({ skip = 0, limit = 6 }) {
  const ref = useRef(null);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { setPosts([]); setTotal(0); return; }
        const all = JSON.parse(raw);
        const published = all
          .filter((p) => p.status === 'published')
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
          });
        setTotal(published.length);
        setPosts(published.slice(skip, skip + limit));
      } catch { setPosts([]); setTotal(0); }
    };

    load();

    const onStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) load();
    };
    const onChanged = (e) => {
      if (!e.detail?.key || e.detail.key === STORAGE_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('sitedata:changed', onChanged);
    window.addEventListener('sitedata:bootstrap', load);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sitedata:changed', onChanged);
      window.removeEventListener('sitedata:bootstrap', load);
    };
  }, [skip, limit]);

  const sectionHeading = useSectionLabel('blog', 'Últimos ensaios');

  if (posts.length === 0) return null;

  return (
    <section ref={ref} id="blog" className="py-14 md:py-20 px-5 sm:px-6 md:px-12 relative overflow-hidden">
      <SpiralAccent
        className="absolute top-10 -right-20 pointer-events-none hidden md:block"
        size={260}
        opacity={0.1}
      />
      <motion.div initial="visible" animate="visible" variants={stagger} className="max-w-[1180px] mx-auto">
        <SectionLabel label="Blog" />
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-text-bright leading-tight">
            {sectionHeading}
          </h2>
          <Link href="/blog" className="link-arrow">
            {total > posts.length + skip ? `Ver todos os ${total}` : 'Ver todos'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Dica de arraste — só mobile, só quando há mais de um card */}
        {posts.length > 1 && (
          <motion.div variants={fadeUp} className="sm:hidden mb-3 flex items-center gap-2 text-text-dim/70">
            <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase">Arraste</span>
            <span aria-hidden className="font-mono text-[0.7rem] text-accent/60 tracking-[-0.08em]">
              &gt;&gt;&gt;
            </span>
          </motion.div>
        )}

        {/* No mobile os cards rolam na horizontal, pra capa 9/16 não virar uma
            parede vertical de três telas. De sm pra cima vira grade, e o número
            de colunas segue o número de posts: com 2 cards uma grade de 3
            colunas deixa um vão visível. */}
        <motion.div
          variants={stagger}
          className={`flex overflow-x-auto snap-x snap-mandatory gap-6 -mx-5 px-5 pb-3 scrollbar-hide justify-items-center sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none sm:px-0 sm:pb-0 sm:gap-8 md:gap-10 ${
            posts.length >= 3 ? 'lg:grid-cols-3 sm:mx-0' : 'sm:max-w-[720px] sm:mx-auto'
          }`}
        >
          {posts.map((post) => {
            const readTime = calculateReadingTime(post.content_html);
            const cover = post.featured_cover || post.featured_image;
            const href = `/blog/${post.slug || post.id}/`;
            return (
              <motion.article
                key={post.id}
                variants={fadeUp}
                className="group flex flex-col w-[78vw] max-w-[330px] shrink-0 snap-start sm:w-full sm:shrink"
              >
                <Link href={href} className="block mb-5">
                  <PosterCover
                    src={cover}
                    alt={post.featured_cover_alt || post.featured_image_alt || stripHighlights(post.title)}
                    aspect={post.featured_cover ? '9/16' : '3/4'}
                    seed={post.slug || post.id || post.title || ''}
                    intensity={2}
                    titleOverlay
                    eyebrow={post.tags?.[0]}
                    title={renderHighlightedTitle(post.title, { accentClassName: 'text-accent-bright italic' })}
                    footer={
                      <>
                        <time>{formatDate(post.updated_at)}</time>
                        <span className="text-text-dim/70">·</span>
                        <span>{readTime} min</span>
                      </>
                    }
                  />
                </Link>

                {post.excerpt && (
                  <p className="text-[0.88rem] text-text-dim leading-[1.75] line-clamp-3 mb-4 pl-1">
                    {post.excerpt}
                  </p>
                )}

                {post.tags?.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${slugifyTag(tag)}/`}
                        className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-text-dim border border-border-subtle px-2.5 py-1 hover:text-accent hover:border-accent/40 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
