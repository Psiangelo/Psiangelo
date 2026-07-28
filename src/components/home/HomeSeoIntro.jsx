'use client';

/**
 * HomeSeoIntro — manifesto curto da home ("A casa").
 *
 * A /psicoterapia-analitica/ cobre o atendimento como serviço (públicos,
 * processo, valores, horários, queixas). Esta seção cobre o ângulo
 * complementar: o que é a abordagem junguiana como visão, e por que esta
 * casa une clínica, estudo e escrita.
 *
 * Conteúdo editável via admin (Conteúdo da home → "A casa") e ocultável
 * via admin (Visibilidade → chave `manifesto`) — mesmo padrão de Sobre/Prelúdio.
 *
 * Keywords distintas da landing clínica: psicólogo junguiano, abordagem
 * junguiana, psicologia analítica, obra de Jung, individuação, vida
 * simbólica, sonhos. (A landing /psicoterapia-analitica cobre o long-tail
 * de conversão: "psicoterapia analítica online", "primeira conversa", etc.)
 */
import { getHomepage, DEFAULT_HOMEPAGE, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';

export default function HomeSeoIntro() {
  const content = useSitedata(
    () => getHomepage().manifesto,
    DEFAULT_HOMEPAGE.manifesto,
    SITEDATA_KEYS.homepage,
  );

  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-title"
      className="relative py-14 md:py-24 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            {content.eyebrow}
          </p>
        </div>
        <h2
          id="manifesto-title"
          className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]"
        >
          {content.title}{' '}
          <em className="italic text-accent">{content.emphasis}</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>{content.paragraph1}</p>
          <p>{content.paragraph2}</p>
          <p>{content.paragraph3}</p>
        </div>
      </div>
    </section>
  );
}
