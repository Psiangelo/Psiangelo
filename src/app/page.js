'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import HomeDisclaimer from '@/components/home/HomeDisclaimer';
import HomeSeoIntro from '@/components/home/HomeSeoIntro';
import HomeApproach from '@/components/home/HomeApproach';
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

function Break({ children, pad = 'py-4' }) {
  return (
    <div className={`max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 ${pad}`}>{children}</div>
  );
}

// Renderers por id — cada um recebe o mapa de visibilidade e devolve o JSX
// (ou null quando a seção está oculta / não deve renderizar).
const RENDERERS = {
  hero: () => <Hero />,
  disclaimer: (v) => (v.disclaimerEstagio !== false ? <HomeDisclaimer /> : null),
  seoIntro: () => <HomeSeoIntro />,
  audience: () => <AudienceCards heading="Para quem atendo" />,
  approach: () => <HomeApproach />,
  about: (v) => (v.about ? <About /> : null),
  prelude: (v) => (v.prelude ? <Prelude /> : null),
  trilhas: (v) => (v.trilhas ? <StudyPaths /> : null),
  jungQuote: () => <JungQuote />,
  materials: (v) => (v.materiais ? <MaterialsPreview /> : null),
  blog: (v) => (v.blog ? <BlogPreview /> : null),
  cursos: (v) => (v.cursos ? <CoursesPreview /> : null),
  cartografia: (v) => (v.cartografia ? <Cartography /> : null),
  depoimentos: (v) => (v.depoimentos ? <Testimonials /> : null),
  faq: (v) => (v.faq ? <FAQ /> : null),
  contato: (v) => (v.contato ? <ContactCTA /> : null),
};

export default function HomePage() {
  const { visibility: v } = useVisibility();
  const sections = useHomeSections();

  // Monta a lista de nodes ativos (filtra nulls de visibilidade)
  const rendered = sections
    .map((id) => {
      const fn = RENDERERS[id];
      if (!fn) return null;
      const node = fn(v);
      return node ? { id, node } : null;
    })
    .filter(Boolean);

  // Divisores contextuais — só aparecem se os vizinhos certos existiram
  const renderedIds = new Set(rendered.map((r) => r.id));
  const showAboutPreludeDivider = renderedIds.has('about') || renderedIds.has('prelude');
  const showMaterialsDivider =
    renderedIds.has('materials') && (renderedIds.has('blog') || renderedIds.has('cursos'));
  const showCartografiaDivider = renderedIds.has('cartografia');

  return (
    <>
      <Navbar />
      <main>
        {rendered.map(({ id, node }, i) => {
          const next = rendered[i + 1]?.id;
          // Divisor mandala: logo após about ou prelude se o próximo não for o par
          const afterAboutPrelude =
            showAboutPreludeDivider &&
            (id === 'prelude' || (id === 'about' && next !== 'prelude'));
          // Divisor diamond chain: entre materials e (blog|cursos)
          const afterMaterials =
            showMaterialsDivider &&
            id === 'materials' &&
            (next === 'blog' || next === 'cursos');
          // Divisor alchemy: logo após cartografia
          const afterCartografia = showCartografiaDivider && id === 'cartografia';
          return (
            <div key={id}>
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
            </div>
          );
        })}
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
