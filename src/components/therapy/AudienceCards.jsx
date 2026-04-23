import Link from 'next/link';

const AUDIENCES = [
  {
    href: '/psicoterapia-analitica/adolescentes',
    eyebrow: '14 — 18',
    title: 'Adolescentes',
    body:
      'Um espaço próprio para escutar o que está em formação — sem julgamento, com sigilo cuidadoso e diálogo transparente com a família.',
    cta: 'Para adolescentes',
  },
  {
    href: '/psicoterapia-analitica/adultos',
    eyebrow: '18 — 60',
    title: 'Adultos',
    body:
      'Crises, sentido, sonhos, relações, transições. Uma escuta que não impõe modelo — o trabalho toma forma a partir da sua vida singular.',
    cta: 'Para adultos',
  },
  {
    href: '/psicoterapia-analitica/idosos',
    eyebrow: '60 +',
    title: 'Idosos',
    body:
      'A segunda metade da vida pede outro tipo de escuta. Sentido, memória, perdas e novos começos — temas centrais para Jung, e centrais para esta clínica.',
    cta: 'Para idosos',
  },
];

export default function AudienceCards({ heading = 'Para quem atendo' }) {
  return (
    <section
      id="para-quem-atendo"
      className="relative py-16 md:py-28 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <div className="relative max-w-[1180px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Públicos
          </p>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] text-text-bright leading-[1.1] mb-4 max-w-3xl tracking-[-0.01em]">
          {heading.split(' ').slice(0, -1).join(' ')}{' '}
          <em className="italic text-accent">{heading.split(' ').slice(-1)}</em>
        </h2>
        <p className="font-serif italic text-text-dim text-[1.05rem] leading-relaxed max-w-2xl mb-12">
          Atendimento online em todo o Brasil, em três frentes. Cada faixa de vida
          tem a sua escuta — escolha por onde começar.
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 list-none p-0">
          {AUDIENCES.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="group block h-full p-7 md:p-8 bg-bg-card/40 border border-border-subtle hover:border-accent/40 transition-colors relative"
              >
                <span className="font-mono text-[0.62rem] text-accent/80 tracking-[0.3em] uppercase">
                  {a.eyebrow}
                </span>
                <h3 className="font-serif text-[1.6rem] text-text-bright mt-3 mb-4 leading-tight">
                  {a.title}
                </h3>
                <p className="text-[0.96rem] text-text leading-[1.85] mb-6">
                  {a.body}
                </p>
                <span className="font-mono text-[0.62rem] text-accent tracking-[0.28em] uppercase inline-flex items-center gap-2">
                  {a.cta}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="absolute bottom-0 left-0 h-px bg-accent/40 w-0 group-hover:w-full transition-all duration-700" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { AUDIENCES };
