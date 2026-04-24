'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import PosterCover from '@/components/ui/PosterCover';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';

function readTime(html) {
  const words = (html || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function fmt(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

export default function TagClient({ tag, posts }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageHero
          breadcrumbs={[
            { name: 'Blog', href: '/blog/' },
            { name: tag },
          ]}
          eyebrow={`Categoria · ${posts.length} publicação${posts.length === 1 ? '' : 'es'}`}
          title={tag}
          kicker="Ensaios relacionados"
          lead={`Todas as publicações marcadas com "${tag}". Ensaios de psicologia analítica e prática clínica junguiana.`}
        />

        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 pb-24">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl font-serif italic text-accent/30 mb-4">ψ</div>
              <p className="text-text-dim font-sans text-sm">
                Nenhuma publicação nesta categoria ainda.
              </p>
              <Link
                href="/blog/"
                className="mt-6 inline-block text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest"
              >
                ← Voltar ao blog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, i) => {
                const slug = post.slug || post.id;
                const hasImage = post.featured_cover || post.featured_image;
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group w-full"
                  >
                    <Link href={`/blog/${slug}/`} className="block">
                      {hasImage ? (
                        <PosterCover
                          src={post.featured_cover || post.featured_image}
                          alt={stripHighlights(post.title)}
                          aspect={post.featured_cover ? '3/4' : '16/10'}
                          seed={slug}
                          intensity={2}
                          titleOverlay
                          eyebrow={post.tags?.[0]}
                          title={renderHighlightedTitle(post.title, { accentClassName: 'text-accent not-italic' })}
                          footer={
                            <>
                              <time>{fmt(post.updated_at)}</time>
                              <span className="text-text-dim/70">·</span>
                              <span>{readTime(post.content_html)} min</span>
                            </>
                          }
                        />
                      ) : (
                        <div className="bg-bg-card border border-border-subtle group-hover:border-accent/40 p-5 transition-colors h-full">
                          <div className="flex items-center gap-3 mb-3">
                            <time className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-text-dim">
                              {fmt(post.updated_at)}
                            </time>
                            <span className="font-mono text-[0.55rem] text-text-dim/70">
                              {readTime(post.content_html)} min
                            </span>
                          </div>
                          <h2 className="font-serif text-[1.1rem] text-text-bright leading-tight mb-3 group-hover:text-accent transition-colors">
                            {renderHighlightedTitle(post.title)}
                          </h2>
                          {post.excerpt && (
                            <p className="text-[0.85rem] text-text-dim leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      )}
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
