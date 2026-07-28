'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisibilityGate from '@/components/VisibilityGate';
import Hero from '@/components/home/Hero';
import HomeDisclaimer from '@/components/home/HomeDisclaimer';
import HomeSeoIntro from '@/components/home/HomeSeoIntro';
import HomeApproach from '@/components/home/HomeApproach';
import HomeBussola from '@/components/home/HomeBussola';
import AudienceCards from '@/components/therapy/AudienceCards';
import Prelude from '@/components/home/Prelude';
import About from '@/components/home/About';
import Cartography from '@/components/home/Cartography';
import StudyPaths from '@/components/home/StudyPaths';
import MaterialsPreview from '@/components/home/MaterialsPreview';
import CoursesPreview from '@/components/home/CoursesPreview';
import BlogPreview from '@/components/home/BlogPreview';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import ContactCTA from '@/components/home/ContactCTA';
import MandalaDivider from '@/components/ui/MandalaDivider';
import JungQuote from '@/components/JungQuote';
import {
  AlchemyDivider,
  DiamondChain,
} from '@/components/illustrations';
import { useVisibility } from '@/lib/useVisibility';
import { useHomeSections } from '@/lib/useHomeSections';
import { useSitedata } from '@/lib/useSitedata';
import {
  getMaterials,
  getTrilhas,
  getTestimonials,
  getFaqs,
  SITEDATA_KEYS,
  DEFAULT_FAQS,
  DEFAULT_TESTIMONIALS,
} from '@/lib/sitedata';

function Break({ children, pad = 'py-4' }) {
  return (
    <div className={`max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 ${pad}`}>{children}</div>
  );
}

// Lê posts publicados do localStorage (mesmo padrão do BlogPreview)
function usePublishedBlogCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('angelo_admin_blog');
        if (!raw) return setCount(0);
        const all = JSON.parse(raw);
        setCount(all.filter((p) => p?.status === 'published').length);
      } catch { setCount(0); }
    };
    load();
    const onChanged = (e) => {
      if (!e.detail?.key || e.detail.key === 'angelo_admin_blog') load();
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
  return count;
}

function useCoursesCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('angelo_admin_courses');
        if (!raw) return setCount(0);
        const all = JSON.parse(raw);
        setCount(Array.isArray(all) ? all.length : 0);
      } catch { setCount(0); }
    };
    load();
    const onChanged = (e) => {
      if (!e.detail?.key || e.detail.key === 'angelo_admin_courses') load();
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
  return count;
}

export default function HomePage() {
  const { visibility: v } = useVisibility();
  const sections = useHomeSections();

  // Dados reais — usados pra decidir o que tem conteúdo e o que retorna null
  const materials    = useSitedata(getMaterials,     [], SITEDATA_KEYS.materials);
  const trilhas      = useSitedata(getTrilhas,       [], SITEDATA_KEYS.trilhas);
  const testimonials = useSitedata(getTestimonials,  DEFAULT_TESTIMONIALS, SITEDATA_KEYS.testimonials);
  const faqs         = useSitedata(getFaqs,          DEFAULT_FAQS,         SITEDATA_KEYS.faqs);
  const blogCount    = usePublishedBlogCount();
  const coursesCount = useCoursesCount();

  const has = useMemo(() => ({
    materials:    (materials || []).some((m) => m.available),
    trilhas:      (trilhas || []).length > 0,
    blog:         blogCount > 0,
    cursos:       coursesCount > 0,
    depoimentos:  (testimonials || []).length > 0,
    faq:          (faqs || []).length > 0,
  }), [materials, trilhas, testimonials, faqs, blogCount, coursesCount]);

  // RENDERERS data-aware: só "rende­riza" (vira item de rendered) se visibility
  // estiver on AND se existe conteúdo de fato — evita wrapper div vazio
  // carregando divider órfão, que é o que dava "buraco" na home.
  const RENDERERS = {
    hero:        () => <Hero />,
    disclaimer:  () => (v.disclaimerEstagio !== false ? <HomeDisclaimer /> : null),
    seoIntro:    () => (v.manifesto ? <HomeSeoIntro /> : null),
    bussola:     () => (v.bussola !== false ? <HomeBussola /> : null),
    audience:    () => (v.audience ? <AudienceCards heading="Para quem atendo" /> : null),
    approach:    () => (v.approach ? <HomeApproach /> : null),
    about:       () => (v.about ? <About /> : null),
    prelude:     () => (v.prelude ? <Prelude /> : null),
    trilhas:     () => (v.trilhas && has.trilhas ? <StudyPaths /> : null),
    jungQuote:   () => <JungQuote />,
    materials:   () => (v.materiais && has.materials ? <MaterialsPreview /> : null),
    blog:        () => (v.blog && has.blog ? <BlogPreview /> : null),
    cursos:      () => (v.cursos && has.cursos ? <CoursesPreview /> : null),
    cartografia: () => (v.cartografia ? <Cartography /> : null),
    depoimentos: () => (v.depoimentos && has.depoimentos ? <Testimonials /> : null),
    faq:         () => (v.faq && has.faq ? <FAQ /> : null),
    contato:     () => (v.contato ? <ContactCTA /> : null),
  };

  const rendered = sections
    .map((id) => {
      const fn = RENDERERS[id];
      if (!fn) return null;
      const node = fn();
      return node ? { id, node } : null;
    })
    .filter(Boolean);

  // Divisores contextuais — só aparecem se os vizinhos certos existem de verdade
  const renderedIds = new Set(rendered.map((r) => r.id));
  const showAboutPreludeDivider = renderedIds.has('about') || renderedIds.has('prelude');
  const showMaterialsDivider =
    renderedIds.has('materials') && (renderedIds.has('blog') || renderedIds.has('cursos'));
  const showCartografiaDivider = renderedIds.has('cartografia');

  return (
    <VisibilityGate visibilityKey="home" title="Home indisponível">
      <Navbar />
      <main>
        {rendered.map(({ id, node }, i) => {
          const next = rendered[i + 1]?.id;
          const afterAboutPrelude =
            showAboutPreludeDivider &&
            (id === 'prelude' || (id === 'about' && next !== 'prelude'));
          const afterMaterials =
            showMaterialsDivider &&
            id === 'materials' &&
            (next === 'blog' || next === 'cursos');
          const afterCartografia = showCartografiaDivider && id === 'cartografia';
          return (
            <Fragment key={id}>
              {node}
              {afterAboutPrelude && (
                <Break>
                  <MandalaDivider size={56} opacity={0.3} />
                </Break>
              )}
              {afterMaterials && (
                <Break pad="py-2">
                  <DiamondChain />
                </Break>
              )}
              {afterCartografia && (
                <Break pad="py-2">
                  <AlchemyDivider />
                </Break>
              )}
            </Fragment>
          );
        })}
      </main>
      <Footer showMaterialsCta={false} />
    </VisibilityGate>
  );
}
