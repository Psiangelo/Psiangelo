import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TriangleCompass, SpiralAccent, GoldenArc } from '@/components/illustrations';

export const metadata = {
  title: '404 · Página não encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 sm:px-6 md:px-12 pt-24 pb-20">
        {/* Ornamentos geométricos — editoriais */}
        <TriangleCompass
          className="absolute top-24 right-8 pointer-events-none hidden md:block"
          size={140}
          opacity={0.14}
          animated
        />
        <SpiralAccent
          className="absolute bottom-20 -left-16 pointer-events-none hidden md:block"
          size={260}
          opacity={0.1}
        />
        <GoldenArc
          className="absolute -bottom-10 -right-10 pointer-events-none hidden lg:block"
          size={220}
          opacity={0.12}
        />

        <div className="relative max-w-[620px] mx-auto text-center">
          <p className="font-mono text-[0.62rem] tracking-[0.32em] uppercase text-accent mb-8">
            404 · Página não encontrada
          </p>

          <h1 className="font-serif text-[clamp(2.6rem,6vw,4.8rem)] text-text-bright leading-[1.05] tracking-[-0.015em] mb-8">
            A página <em className="italic text-accent">desapareceu</em> da psiquê
          </h1>

          <p className="font-serif italic text-[1.05rem] text-text leading-[1.9] mb-10 max-w-[520px] mx-auto">
            Talvez tenha sido movida, talvez nunca tenha existido. Jung diria que
            o inconsciente tem suas razões — o consciente precisa voltar ao
            caminho.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Voltar para a home
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/blog"
              className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Ler ensaios
            </Link>
          </div>

          {/* ψ sutil no pé */}
          <div className="mt-16 text-5xl font-serif italic text-accent/30 select-none" aria-hidden>
            ψ
          </div>
        </div>
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
