'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import VisibilityGate from '@/components/VisibilityGate';
import { fadeUp, stagger } from '@/lib/constants';
import { useSitedata } from '@/lib/useSitedata';
import {
  getEstudosPage, DEFAULT_ESTUDOS_PAGE,
  getTrilhas, getGlossario, getMaterials,
  SITEDATA_KEYS,
} from '@/lib/sitedata';
import { img } from '@/lib/basepath';

function pickByIds(list, selected, keyAccessor = (x) => x.id || x.slug) {
  if (!Array.isArray(selected) || selected.length === 0) return list;
  const set = new Set(selected);
  return list.filter((x) => set.has(keyAccessor(x)));
}

function HeroBlock({ hero }) {
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      emphasis={hero.emphasis}
      kicker={hero.kicker}
      lead={hero.lead}
      actions={
        <>
          {hero.primaryCtaLabel && (
            <a
              href={hero.primaryCtaHref || '#trilhas'}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5"
            >
              {hero.primaryCtaLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {hero.secondaryCtaLabel && (
            <Link
              href={hero.secondaryCtaHref || '/glossario'}
              className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline"
            >
              {hero.secondaryCtaLabel}
            </Link>
          )}
        </>
      }
    />
  );
}

function SectionHeader({ title, subtitle, count }) {
  return (
    <header className="mb-8">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">{title}</span>
        <span className="flex-1 h-px bg-border-subtle" />
        {count != null && <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">{count}</span>}
      </div>
      {subtitle && <p className="font-serif italic text-text-dim text-[0.95rem] max-w-2xl">{subtitle}</p>}
    </header>
  );
}

function TrilhasBlock({ config, trilhas }) {
  const items = pickByIds(trilhas, config.selected);
  if (items.length === 0) return null;
  return (
    <section id="trilhas" className="py-14 px-5 sm:px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeader title={config.title || 'Trilhas'} subtitle={config.subtitle} count={items.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <Link
              key={t.id}
              href={`/trilhas#${t.id}`}
              className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-5"
            >
              <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                {t.level && <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent">{t.level}</span>}
                {t.duration && <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase">{t.duration}</span>}
                <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase">
                  {t.stages?.length || 0} etapas
                </span>
              </div>
              <h3 className="font-serif text-xl text-text-bright group-hover:text-accent transition-colors leading-tight mb-2">
                {t.name}
              </h3>
              {t.subtitle && <p className="font-serif italic text-text-dim text-[0.88rem]">{t.subtitle}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlossarioBlock({ config, glossario }) {
  const visible = (glossario || []).filter((t) => !t.hidden);
  const items = (pickByIds(visible, config.selected, (x) => x.slug)).slice(0, config.limit || 8);
  if (items.length === 0) return null;
  return (
    <section id="glossario" className="py-14 px-5 sm:px-6 md:px-12 bg-bg-warm section-border-t section-border-b">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeader title={config.title || 'Glossário'} subtitle={config.subtitle} count={items.length} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((t) => (
            <Link
              key={t.slug}
              href={`/glossario/${t.slug}`}
              className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4"
            >
              <h3 className="font-serif text-base text-text-bright group-hover:text-accent transition-colors mb-1.5">
                {t.term}
              </h3>
              <p className="text-[0.78rem] text-text-dim leading-[1.55] line-clamp-3">{t.short}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Link href="/glossario" className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors">
            Ver glossário completo →
          </Link>
        </div>
      </div>
    </section>
  );
}

function MateriaisBlock({ config, materials }) {
  const items = (pickByIds(materials, config.selected)).filter((m) => m.available !== false).slice(0, config.limit || 6);
  if (items.length === 0) return null;
  return (
    <section id="materiais" className="py-14 px-5 sm:px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeader title={config.title || 'Materiais'} subtitle={config.subtitle} count={items.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((m) => {
            const image = m.image ? (m.image.startsWith('http') ? m.image : img(m.image)) : null;
            return (
              <Link
                key={m.id}
                href={`/materiais#${m.id}`}
                className="group relative block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors overflow-hidden min-h-[160px]"
              >
                {image && (
                  <div className="absolute inset-0">
                    <img src={image} alt={m.title} className="w-full h-full object-cover opacity-35 group-hover:opacity-55 transition-opacity" referrerPolicy="no-referrer" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/90 to-bg/40" />
                  </div>
                )}
                <div className="relative p-4 flex flex-col h-full">
                  <div className="mt-auto">
                    <h3 className="font-serif text-base text-text-bright group-hover:text-accent transition-colors leading-tight">
                      {m.title}
                    </h3>
                    {m.subtitle && <p className="font-serif italic text-text-dim text-[0.78rem] mt-1">{m.subtitle}</p>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-right">
          <Link href="/materiais" className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors">
            Ver todo o catálogo →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CursosBlock({ config, courses }) {
  const items = (pickByIds(courses, config.selected, (x) => x.slug || x.id)).slice(0, config.limit || 6);
  if (items.length === 0) return null;
  return (
    <section id="cursos" className="py-14 px-5 sm:px-6 md:px-12 bg-bg-warm section-border-t section-border-b">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeader title={config.title || 'Cursos'} subtitle={config.subtitle} count={items.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((c) => (
            <Link
              key={c.id || c.slug}
              href={`/cursos?id=${encodeURIComponent(c.slug || c.id)}`}
              className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4"
            >
              <h3 className="font-serif text-base text-text-bright group-hover:text-accent transition-colors leading-tight">
                {c.title}
              </h3>
              {c.subtitle && <p className="font-serif italic text-text-dim text-[0.78rem] mt-1">{c.subtitle}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogBlock({ config, posts }) {
  const published = (posts || []).filter((p) => !p.status || p.status === 'published');
  const items = (pickByIds(published, config.selected, (x) => x.slug || x.id)).slice(0, config.limit || 4);
  if (items.length === 0) return null;
  return (
    <section id="blog" className="py-14 px-5 sm:px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeader title={config.title || 'Ensaios'} subtitle={config.subtitle} count={items.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((p) => (
            <Link
              key={p.slug || p.id}
              href={`/blog/${p.slug || p.id}`}
              className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-5"
            >
              <h3 className="font-serif text-lg text-text-bright group-hover:text-accent transition-colors leading-tight mb-2">
                {p.title}
              </h3>
              {p.excerpt && <p className="text-[0.85rem] text-text-dim leading-[1.65] line-clamp-3">{p.excerpt}</p>}
            </Link>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Link href="/blog" className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors">
            Todos os ensaios →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ManifestoBlock({ config }) {
  if (!config.body && !config.title) return null;
  return (
    <section className="py-14 px-5 sm:px-6 md:px-12">
      <div className="max-w-[760px] mx-auto">
        {config.title && (
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-6">
            {config.title}
          </h2>
        )}
        {config.body && (
          <div className="font-serif text-[1.02rem] text-text leading-[1.85] whitespace-pre-wrap">{config.body}</div>
        )}
      </div>
    </section>
  );
}

const BLOCK_RENDERERS = {
  hero:      HeroBlock,
  trilhas:   TrilhasBlock,
  glossario: GlossarioBlock,
  materiais: MateriaisBlock,
  cursos:    CursosBlock,
  blog:      BlogBlock,
  manifesto: ManifestoBlock,
};

export default function EstudosClient({ initialPosts = [], initialCourses = [] }) {
  const page      = useSitedata(getEstudosPage,  DEFAULT_ESTUDOS_PAGE, SITEDATA_KEYS.estudosPage);
  const trilhas   = useSitedata(getTrilhas,      [], SITEDATA_KEYS.trilhas);
  const glossario = useSitedata(getGlossario,    [], SITEDATA_KEYS.glossario);
  const materials = useSitedata(getMaterials,    [], SITEDATA_KEYS.materials);

  // Posts/cursos: server passa snapshot inicial; client tenta atualizar via localStorage
  const posts = useMemo(() => {
    if (typeof window === 'undefined') return initialPosts;
    try {
      const stored = JSON.parse(localStorage.getItem('angelo_admin_blog') || 'null');
      return Array.isArray(stored) ? stored : initialPosts;
    } catch { return initialPosts; }
  }, [initialPosts]);
  const courses = useMemo(() => {
    if (typeof window === 'undefined') return initialCourses;
    try {
      const stored = JSON.parse(localStorage.getItem('angelo_admin_courses') || 'null');
      return Array.isArray(stored) ? stored : initialCourses;
    } catch { return initialCourses; }
  }, [initialCourses]);

  return (
    <VisibilityGate visibilityKey="estudos" title="Estudos indisponível">
      <Navbar />
      <main>
        {page.blocks.map((b, i) => {
          if (!b.visible) return null;
          const Renderer = BLOCK_RENDERERS[b.id];
          if (!Renderer) return null;
          if (b.id === 'hero') return <Renderer key={i} hero={page.hero} />;
          const ctx = { config: b.config || {}, trilhas, glossario, materials, courses, posts };
          return (
            <motion.div
              key={`${b.id}-${i}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <Renderer {...ctx} />
            </motion.div>
          );
        })}
      </main>
      <Footer />
    </VisibilityGate>
  );
}
