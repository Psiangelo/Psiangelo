'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
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
        <Hero />
        {v.prelude && <Prelude />}
        {v.about && <About />}
        {(v.about || v.prelude) && v.cartografia && (
          <Break>
            <MandalaDivider size={56} opacity={0.3} />
          </Break>
        )}
        {v.cartografia && <Cartography />}
        {v.cartografia && v.trilhas && (
          <Break pad="py-2">
            <AlchemyDivider />
          </Break>
        )}
        {v.trilhas && <StudyPaths />}
        <JungQuote />
        {v.materiais && <MaterialsPreview />}
        {v.materiais && (v.cursos || v.blog) && (
          <Break pad="py-2">
            <DiamondChain />
          </Break>
        )}
        {v.cursos && <CoursesPreview />}
        {v.blog && <BlogPreview />}
        {v.blog && v.depoimentos && (
          <Break pad="py-2">
            <AlchemyDivider />
          </Break>
        )}
        {v.depoimentos && <Testimonials />}
        {v.faq && <FAQ />}
        {v.contato && <ContactCTA />}
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
