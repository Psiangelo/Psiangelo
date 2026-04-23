/**
 * HomeSeoIntro — bloco de conteúdo SEO long-form server-rendered na home.
 *
 * Razão: a home renderiza todo o conteúdo dinâmico via componentes 'use client'
 * com `useVisibility()` e `useSitedata()`. O Googlebot pode receber HTML pobre
 * antes da hidratação. Este componente é SERVER por padrão (sem 'use client'),
 * sem hooks, sem animações — garante texto rico no HTML inicial.
 *
 * Keywords cobertas: psicoterapia analítica online, psicólogo junguiano online,
 * terapia junguiana online, Brasil, adolescente/adulto/idoso, análise de sonhos,
 * individuação, escuta clínica.
 */
export default function HomeSeoIntro() {
  return (
    <section
      id="psicoterapia-online"
      className="relative py-14 md:py-24 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            O que ofereço
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          Psicoterapia analítica online,{' '}
          <em className="italic text-accent">em todo o Brasil.</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>
            <span className="font-serif text-accent text-[1.1em]">A</span>{' '}
            <strong className="text-text-bright font-normal">psicoterapia analítica</strong>{' '}
            — também conhecida como abordagem junguiana — é a prática clínica
            desenvolvida a partir do trabalho de Carl Gustav Jung. Trabalha com
            a vida simbólica: sonhos, imagens, complexos e o processo de{' '}
            <em className="italic">individuação</em> — o caminho singular de
            tornar-se quem você é.
          </p>
          <p>
            Atendo adolescentes, adultos e idosos em todo o Brasil, por
            videochamada. A clínica se constrói no encontro: não parto de
            pressupostos sobre você nem aplico modelo pronto — o trabalho toma
            forma a partir do que você me conta e do que ressoa entre nós.
          </p>
          <p>
            A escolha do formato online não é apenas operacional: amplia o
            acesso à clínica junguiana — ainda rara fora dos grandes centros —
            para quem mora longe de um(a) terapeuta desta abordagem, inclusive
            brasileiros vivendo no exterior.
          </p>
        </div>

        {/* Atalhos para as landings filhas — interno linking forte pra SEO */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.28em] uppercase">
            Saiba mais
          </span>
          <a
            href="/psicoterapia-analitica"
            className="font-serif text-[0.98rem] text-accent hover:text-text-bright transition-colors link-underline"
          >
            Abordagem clínica
          </a>
          <span aria-hidden className="text-text-dim/30">·</span>
          <a
            href="/psicoterapia-analitica/adolescentes"
            className="font-serif text-[0.98rem] text-accent hover:text-text-bright transition-colors link-underline"
          >
            Adolescentes
          </a>
          <span aria-hidden className="text-text-dim/30">·</span>
          <a
            href="/psicoterapia-analitica/adultos"
            className="font-serif text-[0.98rem] text-accent hover:text-text-bright transition-colors link-underline"
          >
            Adultos
          </a>
          <span aria-hidden className="text-text-dim/30">·</span>
          <a
            href="/psicoterapia-analitica/idosos"
            className="font-serif text-[0.98rem] text-accent hover:text-text-bright transition-colors link-underline"
          >
            Idosos
          </a>
        </div>
      </div>
    </section>
  );
}
