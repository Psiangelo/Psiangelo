import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import { glossario, CATEGORIES, getGlossarioByCategory } from '@/data/glossario';

export const metadata = {
  title: 'Glossário junguiano',
  description:
    'Termos essenciais da psicologia analítica — Self, Sombra, Individuação, Arquétipo, Sincronicidade e mais. Definições claras, com links entre conceitos.',
  openGraph: {
    title: 'Glossário junguiano · Psiangelo',
    description: 'Termos essenciais da psicologia analítica, interligados.',
    type: 'article',
  },
};

export default function GlossarioPage() {
  const grouped = getGlossarioByCategory();
  const categoryOrder = ['estrutura', 'arquetipos', 'dinamica', 'processo', 'clinica', 'alquimia'];

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Vocabulário · Psicologia Analítica"
          title="Glossário"
          emphasis="junguiano"
          kicker="Conceitos essenciais, interligados"
          lead={`${glossario.length} termos fundamentais — Self, Sombra, Individuação, Arquétipo, Sincronicidade — com definições claras e links entre ideias.`}
        />

        <section className="py-8 md:py-16 px-5 sm:px-6 md:px-12">
          <div className="max-w-[1100px] mx-auto">
            {categoryOrder.map((catKey) => {
              const items = grouped[catKey] || [];
              if (items.length === 0) return null;
              const cat = CATEGORIES[catKey];
              return (
                <section key={catKey} className="mb-14">
                  <header className="flex items-baseline gap-4 mb-5">
                    <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">
                      {cat.label}
                    </span>
                    <span className="flex-1 h-px bg-border-subtle" />
                    <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                      {items.length}
                    </span>
                  </header>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((term) => (
                      <Link
                        key={term.slug}
                        href={`/glossario/${term.slug}`}
                        className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4"
                      >
                        <h3 className="font-serif text-lg text-text-bright group-hover:text-accent transition-colors mb-1.5">
                          {term.term}
                        </h3>
                        <p className="text-[0.82rem] text-text-dim leading-[1.6] line-clamp-3">
                          {term.short}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
