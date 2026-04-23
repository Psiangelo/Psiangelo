/**
 * HomeApproach — 3 princípios clínicos server-rendered na home.
 * Espelha DEFAULT_THERAPY.approach da /psicoterapia-analitica mas em versão
 * compacta, com CTA apontando pra landing completa.
 *
 * Server component — sem 'use client', sem hooks, sem animações.
 * Conteúdo hardcoded em vez de useSitedata pra garantir indexação.
 */
const PRINCIPLES = [
  {
    n: '01',
    title: 'Cada pessoa é única',
    body:
      'Não aplico uma teoria pronta. Para cada pessoa que chega ao consultório online, faço uma psicologia inteiramente nova — porque cada vida tem sua própria forma.',
  },
  {
    n: '02',
    title: 'É uma relação, não um enquadramento',
    body:
      'A postura é dialética: estou tão presente quanto você. O que surge na clínica é o que surge entre nós dois — escutar, perceber, dialogar.',
  },
  {
    n: '03',
    title: 'Escuta, não suposição',
    body:
      'Saberemos de você pelo que você conta e pelo que acontece no contato. É a partir daí — e só daí — que o trabalho toma forma.',
  },
];

export default function HomeApproach() {
  return (
    <section
      id="como-trabalho"
      className="relative py-16 md:py-28 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <div className="relative max-w-[1180px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Como trabalho
          </p>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] text-text-bright leading-[1.1] mb-4 max-w-3xl tracking-[-0.01em]">
          Três princípios que{' '}
          <em className="italic text-accent">atravessam</em> a clínica aqui.
        </h2>
        <p className="font-serif italic text-text-dim text-[1.05rem] leading-relaxed max-w-2xl mb-12">
          A abordagem junguiana valoriza o singular — o que se repete em cada
          vida precisa ser entendido na sua forma própria.
        </p>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 list-none p-0 m-0">
          {PRINCIPLES.map((p) => (
            <li
              key={p.n}
              className="relative p-7 md:p-8 bg-bg-card/40 border border-border-subtle"
            >
              <span className="font-mono text-[0.62rem] text-accent/80 tracking-[0.3em] uppercase">
                {p.n}
              </span>
              <h3 className="font-serif text-[1.4rem] text-text-bright mt-3 mb-4 leading-tight">
                {p.title}
              </h3>
              <p className="text-[0.96rem] text-text leading-[1.85]">
                {p.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a
            href="/psicoterapia-analitica"
            className="inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-text border border-border-hover hover:border-accent hover:text-accent transition-all"
          >
            Conheça a abordagem completa
            <span aria-hidden>→</span>
          </a>
          <a
            href="/psicoterapia-analitica#como-funciona"
            className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline"
          >
            Como funciona a sessão
          </a>
        </div>
      </div>
    </section>
  );
}
