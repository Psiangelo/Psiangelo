'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button, { ArrowIcon } from '@/components/ui/Button';
import SectionLabel from '@/components/SectionLabel';
import { resolveImageSrc } from '@/lib/basepath';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';

const STORAGE_KEY = 'angelo_admin_blog';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function readingTime(html) {
  if (!html) return 0;
  const words = html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * FeaturedEssay — o ensaio mais recente ocupando um bloco inteiro logo abaixo
 * do hero. É a peça que faz a home ser blog-first: quem chega vê texto, não
 * um menu de serviços.
 *
 * Pega o mesmo post que estaria em primeiro na grade e o remove de lá (o
 * BlogPreview pula o primeiro quando esta seção está ligada), pra não repetir.
 */
export default function FeaturedEssay() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return setPost(null);
        const all = JSON.parse(raw);
        const published = all
          .filter((p) => p.status === 'published')
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
          });
        setPost(published[0] || null);
      } catch {
        setPost(null);
      }
    };
    load();
    const onChanged = (e) => {
      if (!e.detail?.key || e.detail.key === STORAGE_KEY) load();
    };
    window.addEventListener('sitedata:changed', onChanged);
    window.addEventListener('sitedata:bootstrap', load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('sitedata:changed', onChanged);
      window.removeEventListener('sitedata:bootstrap', load);
      window.removeEventListener('storage', load);
    };
  }, []);

  if (!post) return null;

  const href = `/blog/${post.slug || post.id}/`;
  const cover = resolveImageSrc(post.featured_cover || post.featured_image);
  const minutes = readingTime(post.content_html);

  return (
    <section
      id="ensaio-destaque"
      className="relative px-5 sm:px-6 md:px-12 py-16 md:py-24 overflow-hidden"
    >
      {/* Filete dourado no topo — separa do hero sem uma borda dura */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

      {/* Anima na montagem, não por rolagem. O resto da home segue esse padrão
          justamente porque um observador que não dispara deixa a seção inteira
          invisível, e aqui isso apagaria o ensaio principal da página. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1180px] mx-auto"
      >
        <SectionLabel label="Ensaio em destaque" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 md:gap-14 items-center">
          {/* Capa */}
          {cover && (
            <Link href={href} className="group block relative">
              <div className="relative overflow-hidden border border-border-subtle group-hover:border-accent/35 transition-colors duration-500">
                <img
                  src={cover}
                  alt={post.featured_cover_alt || post.featured_image_alt || stripHighlights(post.title)}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent pointer-events-none" />
              </div>
              {/* Cantoneiras douradas — assinatura editorial do site */}
              <span aria-hidden className="absolute -top-px -left-px w-6 h-6 border-t border-l border-accent/50" />
              <span aria-hidden className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-accent/50" />
            </Link>
          )}

          {/* Texto */}
          <div className={cover ? '' : 'md:col-span-2 max-w-3xl'}>
            <div className="flex items-center gap-4 flex-wrap mb-5">
              {post.tags?.[0] && (
                <span className="meta-caps-accent">{post.tags[0]}</span>
              )}
              <span className="w-6 h-px bg-accent/30" aria-hidden />
              <time className="meta-caps">{formatDate(post.updated_at)}</time>
              <span className="meta-caps">{minutes} min de leitura</span>
            </div>

            <h2 className="font-serif text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.12] text-text-bright mb-6 tracking-[-0.01em]">
              <Link href={href} className="hover:text-accent-bright transition-colors duration-300">
                {renderHighlightedTitle(post.title, {
                  accentClassName: 'text-accent-bright italic',
                })}
              </Link>
            </h2>

            {post.excerpt && (
              <p className="text-[1.02rem] text-text leading-[1.9] mb-9 max-w-[56ch]">
                {post.excerpt}
              </p>
            )}

            <div className="btn-row">
              <Button href={href} variant="solid" icon={<ArrowIcon />}>
                Ler o ensaio
              </Button>
              <Link href="/blog" className="link-arrow">
                Todos os ensaios
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
