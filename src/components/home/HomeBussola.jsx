'use client';

/**
 * HomeBussola — mapa de portas da home.
 *
 * Substitui a duplicação que existia entre a home e a /psicoterapia-analitica/
 * (mesmos 3 públicos, mesmos 3 princípios, mesma FAQ). A bússola assume o
 * papel da home como porta de entrada: cada vínculo é uma frase curta com
 * destino interno. Conversão clínica vai pra "Atendo" → /psicoterapia-analitica.
 *
 * Renderizado no SSR com todas as portas visíveis (DEFAULT_VISIBILITY).
 * No cliente, useVisibility esconde via display:none as portas cujo módulo
 * estiver desligado no admin. Crawler enxerga todos os links de saída.
 *
 * Copy é editável via getHomepage().bussola — fallback nos defaults abaixo.
 */

import Link from 'next/link';
import { useSitedata } from '@/lib/useSitedata';
import { useVisibility } from '@/lib/useVisibility';
import { getHomepage, DEFAULT_HOMEPAGE, SITEDATA_KEYS } from '@/lib/sitedata';

const DEFAULT_PORTALS = [
  {
    id: 'atendo',
    visKey: 'psicoterapia',
    href: '/psicoterapia-analitica',
    glyph: '◈',
    eyebrow: 'Clínica',
    title: 'Atendo',
    body:
      'Psicoterapia analítica online, em todo o Brasil — adolescentes, adultos e idosos.',
    cta: 'Conhecer o atendimento',
  },
  {
    id: 'blog',
    visKey: 'blog',
    href: '/blog',
    glyph: '✶',
    eyebrow: 'Ensaios',
    title: 'Escrevo',
    body:
      'Textos sobre clínica, sonhos e símbolos — publicados periodicamente.',
    cta: 'Ler os ensaios',
  },
  {
    id: 'trilhas',
    visKey: 'estudos',
    href: '/estudos',
    glyph: '✦',
    eyebrow: 'Estudo',
    title: 'Trilhas',
    body:
      'Percursos guiados de leitura para entrar na obra de Jung pela porta certa.',
    cta: 'Começar uma trilha',
  },
  {
    id: 'materiais',
    visKey: 'materiais',
    href: '/materiais',
    glyph: '◆',
    eyebrow: 'Sínteses',
    title: 'Materiais',
    body:
      'Resumos e mapas mentais para estudar e revisitar conceitos junguianos.',
    cta: 'Ver materiais',
  },
  {
    id: 'glossario',
    visKey: 'glossario',
    href: '/glossario',
    glyph: '※',
    eyebrow: 'Léxico',
    title: 'Glossário',
    body:
      'Verbetes vivos da abordagem — definições curtas e remissões cruzadas.',
    cta: 'Abrir o glossário',
  },
];

export const DEFAULT_HOME_BUSSOLA = {
  eyebrow: 'Por onde começar',
  title: 'Cinco portas',
  emphasis: 'desta clínica e da casa.',
  lead:
    'A clínica e o trabalho público caminham juntos aqui. Esta é a entrada — escolha por onde começar.',
  portals: DEFAULT_PORTALS,
};

export default function HomeBussola() {
  const data = useSitedata(
    () => getHomepage().bussola,
    DEFAULT_HOMEPAGE.bussola || DEFAULT_HOME_BUSSOLA,
    SITEDATA_KEYS.homepage,
  );
  const { visibility: v } = useVisibility();

  const portals = (data?.portals?.length ? data.portals : DEFAULT_PORTALS).map((p, i) => ({
    ...DEFAULT_PORTALS[i],
    ...p,
  }));

  return (
    <section
      id="bussola"
      aria-labelledby="bussola-title"
      className="relative py-16 md:py-28 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <div className="relative max-w-[1180px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            {data?.eyebrow || DEFAULT_HOME_BUSSOLA.eyebrow}
          </p>
        </div>
        <h2
          id="bussola-title"
          className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] text-text-bright leading-[1.1] mb-4 max-w-3xl tracking-[-0.01em]"
        >
          {data?.title || DEFAULT_HOME_BUSSOLA.title}{' '}
          <em className="italic text-accent">
            {data?.emphasis || DEFAULT_HOME_BUSSOLA.emphasis}
          </em>
        </h2>
        {(data?.lead || DEFAULT_HOME_BUSSOLA.lead) && (
          <p className="font-serif italic text-text-dim text-[1.05rem] leading-relaxed max-w-2xl mb-12">
            {data?.lead || DEFAULT_HOME_BUSSOLA.lead}
          </p>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 list-none p-0">
          {portals.map((p) => {
            const hidden = p.visKey && v[p.visKey] === false;
            return (
              <li
                key={p.id}
                style={hidden ? { display: 'none' } : undefined}
              >
                <Link
                  href={p.href}
                  className="group relative block h-full p-7 md:p-8 bg-bg-card/40 border border-border-subtle hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-4">
                    <span className="font-mono text-[0.62rem] text-accent/80 tracking-[0.3em] uppercase">
                      {p.eyebrow}
                    </span>
                    <span
                      aria-hidden
                      className="font-serif text-accent/70 text-2xl leading-none"
                    >
                      {p.glyph}
                    </span>
                  </div>
                  <h3 className="font-serif text-[1.5rem] text-text-bright mb-3 leading-tight group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[0.95rem] text-text leading-[1.8] mb-5">
                    {p.body}
                  </p>
                  <span className="inline-flex items-center gap-2 font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim group-hover:text-accent transition-colors">
                    {p.cta}
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
