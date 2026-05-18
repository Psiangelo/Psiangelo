'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';
import { BranchOrnament, SpiralAccent } from '@/components/illustrations';
import PosterCover from '@/components/ui/PosterCover';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';
import { useSectionLabel } from '@/lib/useLabels';

const STORAGE_KEY = 'angelo_admin_blog';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

function calculateReadingTime(html) {
  if (!html) return 0;
  const words = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { setPosts([]); return; }
        const all = JSON.parse(raw);
        const published = all
          .filter((p) => p.status === 'published')
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
          })
          .slice(0, 3);
        setPosts(published);
      } catch { setPosts([]); }
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
  }, []);

  const sectionHeading = useSectionLabel('blog', 'Publicacoes recentes');

  if (posts.length === 0) return null;

  return (
    <section ref={ref} id="blog" className="py-14 md:py-20 px-5 sm:px-6 md:px-12 relative overflow-hidden">
      <SpiralAccent
        className="absolute top-10 -right-20 pointer-events-none hidden md:block"
        size={260}
        opacity={0.1}
      />
      <motion.div initial="visible" animate="visible" variants={stagger} className="max-w-[1100px] mx-auto">
        <SectionLabel label="Blog" />
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-2xl text-text-bright">{sectionHeading}</h2>
          <Link href="/blog" className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest">
            Ver todos &rarr;
          </Link>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {posts.map((post) => {
            const readTime = calculateReadingTime(post.content_html);
            const seed = post.slug || post.id || post.title || '';
            const hasImage = post.featured_cover || post.featured_image;
            return (
              <motion.article key={post.id} variants={fadeUp} className="group w-full max-w-[300px] relative">
                <Link href={`/blog/${post.slug || post.id}/`} className="block">
                  <span aria-hidden className="absolute left-0 top-3 bottom-3 w-[2px] bg-accent/20 group-hover:bg-accent/60 transition-colors" />
                  <div className="pl-3">
                    {hasImage ? (
                      <PosterCover
                        src={post.featured_cover || post.featured_image}
                        alt={post.featured_cover_alt || post.featured_image_alt || stripHighlights(post.title)}
                        aspect={post.featured_cover ? '9/16' : '16/9'}
                        seed={seed}
                        intensity={2}
                        titleOverlay
                        eyebrow={post.tags?.[0]}
                        title={renderHighlightedTitle(post.title, { accentClassName: 'text-accent not-italic' })}
                        footer={
                          <>
                            <time>{formatDate(post.updated_at)}</time>
                            <span className="text-text-dim/70">·</span>
                            <span>{readTime} min</span>
                          </>
                        }
                      />
                    ) : (
                      <div className="bg-bg-card border border-border-subtle group-hover:border-accent/40 rounded-lg p-5 transition-colors">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <time className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-text-dim">{formatDate(post.updated_at)}</time>
                          <span className="font-mono text-[0.55rem] text-text-dim/70">{readTime} min</span>
                          {post.tags?.[0] && (
                            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-accent">{post.tags[0]}</span>
                          )}
                        </div>
                        <h3 className="font-serif text-lg text-text-bright leading-tight mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {renderHighlightedTitle(post.title)}
                        </h3>
                        <p className="text-[0.82rem] text-text-dim leading-relaxed line-clamp-3">{post.excerpt}</p>
                      </div>
                    )}
                    {hasImage && post.excerpt && (
                      <div className="mt-4 flex items-start gap-3">
                        <span className="block w-8 h-px bg-accent/40 mt-[10px] flex-shrink-0 group-hover:bg-accent/80 transition-colors" />
                        <p className="text-[0.82rem] text-text-dim leading-relaxed flex-1 line-clamp-2">{post.excerpt}</p>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
