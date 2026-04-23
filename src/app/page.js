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

function Break({ children, pad = 'py-4' }) {
  return (
    <div className={`max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 ${pad}`}>{children}</div>
  );
}

export default function HomePage() {
  const { visibility: v } = useVisibility();

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Identidade visual + CTAs clínicos */}
        <Hero />

        {/* 2. Disclaimer de estagiário (compliance CFP/CRP) — logo abaixo do hero.
            Toggle via admin → Visibilidade → "Faixa de status". Default ligado. */}
        {v.disclaimerEstagio !== false && <HomeDisclaimer />}

        {/* 3. Intro SEO server-rendered — garante texto rico no HTML inicial.
            Sempre visível: é a âncora clínica da home pra Googlebot. */}
        <HomeSeoIntro />

        {/* 4. Para quem atendo — 3 públicos (adolescente/adulto/idoso).
            Reutiliza o componente server da landing /psicoterapia-analitica. */}
        <AudienceCards heading="Para quem atendo" />

        {/* 5. Como trabalho — 3 princípios clínicos + CTA pra landing */}
        <HomeApproach />

        {/* 6. Quem sou — trajetória clínica e formação */}
        {v.about && <About />}

        {/* 7. Prelude opcional (texto editorial curto) */}
        {v.prelude && <Prelude />}

        {(v.about || v.prelude) && (
          <Break>
            <MandalaDivider size={56} opacity={0.3} />
          </Break>
        )}

        {/* 8. Caminhos de estudo (trilhas) — autoridade, secundário */}
        {v.trilhas && <StudyPaths />}

        <JungQuote />

        {/* 9. O que publico — materiais/ensaios/cursos como obra, não produto */}
        {v.materiais && <MaterialsPreview />}
        {v.materiais && (v.cursos || v.blog) && (
          <Break pad="py-2">
            <DiamondChain />
          </Break>
        )}
        {v.blog && <BlogPreview />}
        {v.cursos && <CoursesPreview />}

        {/* 10. Cartografia ornamental (oculta por default — reativar em /glossario ou /trilhas) */}
        {v.cartografia && <Cartography />}

        {v.cartografia && (
          <Break pad="py-2">
            <AlchemyDivider />
          </Break>
        )}

        {/* 11. Depoimentos — oculto por default na home clínica (CFP veda depoimentos de pacientes) */}
        {v.depoimentos && <Testimonials />}

        {/* 12. FAQ clínico */}
        {v.faq && <FAQ />}

        {/* 13. Contato — CTA final */}
        {v.contato && <ContactCTA />}
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
