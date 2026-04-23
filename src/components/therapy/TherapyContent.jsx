'use client';

import Link from 'next/link';
import {
  getTherapy,
  DEFAULT_THERAPY,
  SITEDATA_KEYS,
} from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import TherapyCTAButton from './TherapyCTAButton';
import TherapyScheduleGrid from './TherapyScheduleGrid';

export default function TherapyContent() {
  const data = useSitedata(getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS.therapy);

  return (
    <>
      {/* CTA primário logo após o hero */}
      <section className="px-5 sm:px-6 md:px-12 -mt-2 mb-6 md:mb-14">
        <div className="max-w-[1100px] mx-auto">
          <TherapyCTAButton
            cta={data.cta}
            whatsappNumber={data.whatsappNumber}
          />
        </div>
      </section>

      {/* Como trabalho */}
      <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
        <div className="max-w-[1100px] mx-auto">
          <header className="mb-10 md:mb-14 max-w-2xl">
            <p className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase mb-3">
              {data.approach.sectionLabel}
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-[1.15] mb-3">
              Três princípios que atravessam a clínica.
            </h2>
            <p className="font-serif italic text-text-dim text-[1rem] leading-relaxed">
              {data.approach.intro}
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {data.approach.items.map((it, i) => (
              <article key={i} className="relative">
                <span className="font-mono text-[0.55rem] text-accent/70 tracking-[0.22em] uppercase block mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-[1.2rem] text-text-bright mb-3 leading-tight">
                  {it.title}
                </h3>
                <p className="text-[0.94rem] text-text leading-[1.8]">{it.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
        <div className="max-w-[1100px] mx-auto">
          <header className="mb-10">
            <p className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase mb-3">
              {data.process.sectionLabel}
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-[1.15]">
              Do primeiro contato ao processo.
            </h2>
          </header>
          <ol className="space-y-8 md:space-y-10 max-w-[780px]">
            {data.process.steps.map((s, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start">
                <span className="font-serif italic text-accent text-[2rem] md:text-[2.4rem] leading-none mt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-[1.2rem] text-text-bright mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-[0.94rem] text-text leading-[1.8]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Formato + valores */}
      <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase mb-3">
              {data.format.sectionLabel}
            </p>
            <h2 className="font-serif text-[1.8rem] text-text-bright mb-6 leading-tight">
              Como são as sessões.
            </h2>
            <dl className="space-y-5 font-serif">
              <div>
                <dt className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-1">
                  {data.format.modalityLabel}
                </dt>
                <dd className="text-[1rem] text-text-bright">
                  {data.format.modalities.join(' · ')}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-1">
                  {data.format.durationLabel}
                </dt>
                <dd className="text-[1rem] text-text-bright">{data.format.duration}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-1">
                  {data.format.frequencyLabel}
                </dt>
                <dd className="text-[1rem] text-text-bright">{data.format.frequency}</dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase mb-3">
              {data.values.sectionLabel}
            </p>
            <h2 className="font-serif text-[1.8rem] text-text-bright mb-6 leading-tight">
              Valores e combinação.
            </h2>
            {data.values.show ? (
              <div className="space-y-3 font-serif">
                <p className="text-[1.2rem] text-text-bright leading-tight">
                  <span className="text-accent">{data.values.perSession}</span> por sessão
                </p>
                <p className="text-[1rem] text-text">
                  ou <span className="text-accent">{data.values.perMonth}</span> mensalidade
                </p>
                {data.values.note && (
                  <p className="text-[0.92rem] text-text-dim italic mt-3">{data.values.note}</p>
                )}
              </div>
            ) : (
              <p className="font-serif text-[1rem] text-text leading-[1.85]">
                {data.values.fallback}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Janelas de atendimento */}
      {data.schedule.show && (data.schedule.windows || []).length > 0 && (
        <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
          <div className="max-w-[1100px] mx-auto">
            <header className="mb-8 max-w-2xl">
              <p className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase mb-3">
                {data.schedule.sectionLabel}
              </p>
              <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-[1.15] mb-3">
                Quando posso atender você.
              </h2>
              <p className="font-serif italic text-text-dim text-[0.95rem] leading-relaxed">
                {data.schedule.note}
              </p>
            </header>
            <TherapyScheduleGrid
              schedule={data.schedule}
              cta={data.cta}
              whatsappNumber={data.whatsappNumber}
            />
          </div>
        </section>
      )}

      {/* FAQ */}
      {(data.faq || []).length > 0 && (
        <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
          <div className="max-w-[860px] mx-auto">
            <header className="mb-8">
              <p className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase mb-3">
                Dúvidas frequentes
              </p>
              <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-[1.15]">
                Antes de marcar.
              </h2>
            </header>
            <dl className="space-y-6">
              {data.faq.map((f, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-8 pb-5 border-b border-border-subtle/50"
                >
                  <dt className="font-serif text-[1.02rem] text-text-bright leading-tight">
                    {f.q}
                  </dt>
                  <dd className="text-[0.94rem] text-text leading-[1.85]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* CTA final + deontologia */}
      <section className="py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t">
        <div className="max-w-[860px] mx-auto text-center">
          <h2 className="font-serif italic text-[clamp(1.8rem,3.5vw,2.8rem)] text-text-bright leading-[1.15] mb-4">
            Se algo ressoou até aqui, vamos conversar?
          </h2>
          <p className="font-serif text-[0.98rem] text-text-dim leading-relaxed mb-7 max-w-[560px] mx-auto">
            A primeira conversa é sem custo e sem compromisso — serve pra gente se
            conhecer e ver se faz sentido seguir.
          </p>
          <div className="flex justify-center">
            <TherapyCTAButton cta={data.cta} whatsappNumber={data.whatsappNumber} />
          </div>

          {data.deontology.show && data.deontology.text && (
            <p className="mt-16 font-mono text-[0.6rem] text-text-dim tracking-[0.15em] leading-relaxed max-w-[620px] mx-auto">
              {data.deontology.text}
              {data.deontology.crp && <span className="ml-2">· {data.deontology.crp}</span>}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
