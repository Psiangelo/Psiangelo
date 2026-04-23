'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  getTherapy,
  DEFAULT_THERAPY,
  SITEDATA_KEYS,
} from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import TherapyCTAButton from './TherapyCTAButton';
import TherapyWeekGrid from './TherapyWeekGrid';
import {
  HeroMandala,
  QuaternioSmall,
  OrnamentalDivider,
  NumberBadge,
} from './TherapyOrnaments';
import { StarField, NebulaField } from '@/components/illustrations';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="visible"
        animate="visible"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TherapyContent() {
  const data = useSitedata(getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS.therapy);

  return (
    <>
      {/* Hero ornamentado: mandala + campos estelares + CTA primário embutido */}
      <section className="relative -mt-2 md:-mt-8 mb-8 md:mb-16 px-5 sm:px-6 md:px-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <StarField count={42} maxOpacity={0.45} accentChance={0.25} />
          <NebulaField count={3} />
          <div className="hidden md:block absolute -right-40 -top-40">
            <HeroMandala size={720} opacity={0.05} />
          </div>
        </div>
        <div className="relative max-w-[1100px] mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <TherapyCTAButton cta={data.cta} whatsappNumber={data.whatsappNumber} helper={false} />
              <span className="font-serif italic text-[0.92rem] text-text-dim max-w-xs leading-relaxed">
                {data.cta.helper}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMO TRABALHO — três princípios em cartas editoriais */}
      <section className="relative py-12 md:py-24 px-5 sm:px-6 md:px-12 section-border-t overflow-hidden">
        <div className="ambient-glow absolute top-10 -right-40 w-[500px] h-[500px] opacity-40 pointer-events-none" />

        <div className="relative max-w-[1180px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-3">
              <span className="block w-10 h-px bg-accent/50" />
              <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                {data.approach.sectionLabel}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] text-text-bright leading-[1.1] mb-4 max-w-3xl tracking-[-0.01em]">
              Três princípios atravessam <em className="italic text-accent">a clínica aqui.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-serif italic text-text-dim text-[1.05rem] leading-relaxed max-w-2xl mb-14">
              {data.approach.intro}
            </p>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {data.approach.items.map((it, i) => (
              <motion.article
                key={i}
                variants={fadeUp}
                className="relative p-6 md:p-7 bg-bg-card/40 border border-border-subtle hover:border-accent/30 transition-colors group"
              >
                <span className="absolute -top-3 left-5 px-2 bg-bg font-mono text-[0.55rem] text-accent tracking-[0.3em] uppercase">
                  {String(i + 1).padStart(2, '0')} · {data.approach.items.length}
                </span>
                <h3 className="font-serif text-[1.35rem] text-text-bright mb-4 leading-[1.2] mt-2">
                  {it.title}
                </h3>
                <p className="text-[0.96rem] text-text leading-[1.9]">{it.body}</p>
                <span className="absolute bottom-0 left-0 h-px bg-accent/40 w-0 group-hover:w-full transition-all duration-700" />
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pull quote — Jung sobre o encontro clínico */}
      <section className="py-12 md:py-20 px-5 sm:px-6 md:px-12 relative">
        <Reveal className="max-w-[820px] mx-auto text-center">
          <OrnamentalDivider />
          <blockquote className="mt-8 mb-6">
            <p className="font-serif italic text-[clamp(1.3rem,2.6vw,1.85rem)] text-text-bright leading-[1.45] tracking-[-0.005em]">
              &ldquo;O encontro de duas personalidades é como o contato de duas
              substâncias químicas: se há alguma reação,{' '}
              <em className="text-accent not-italic" style={{ fontStyle: 'italic' }}>
                ambas se transformam.
              </em>
              &rdquo;
            </p>
          </blockquote>
          <p className="font-mono text-[0.58rem] text-text-dim tracking-[0.3em] uppercase">
            C. G. Jung
          </p>
        </Reveal>
      </section>

      {/* COMO FUNCIONA — timeline vertical editorial */}
      <section className="relative py-10 md:py-20 px-5 sm:px-6 md:px-12 overflow-hidden">
        <div className="relative max-w-[900px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-3">
              <span className="block w-10 h-px bg-accent/50" />
              <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                {data.process.sectionLabel}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] text-text-bright leading-[1.1] mb-16 tracking-[-0.01em]">
              Do primeiro contato <em className="italic text-accent">ao processo.</em>
            </h2>
          </Reveal>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="relative space-y-10 md:space-y-14"
          >
            {/* Linha vertical decorativa */}
            <div className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-accent/50 hidden md:block" />
            {data.process.steps.map((s, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="relative grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start"
              >
                <NumberBadge n={i + 1} />
                <div className="pt-2">
                  <h3 className="font-serif text-[1.4rem] text-text-bright mb-3 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-[0.98rem] text-text leading-[1.9] max-w-xl">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* FORMATO + VALORES — ficha técnica tipográfica */}
      <section className="relative py-12 md:py-24 px-5 sm:px-6 md:px-12 section-border-t overflow-hidden">
        <div className="ambient-glow absolute bottom-0 -left-40 w-[500px] h-[500px] opacity-30 pointer-events-none" />

        <div className="relative max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {/* Formato */}
          <Reveal>
            <div className="flex items-center gap-4 mb-3">
              <span className="block w-10 h-px bg-accent/50" />
              <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                {data.format.sectionLabel}
              </p>
            </div>
            <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] text-text-bright leading-[1.15] mb-8">
              Como são as <em className="italic text-accent">sessões.</em>
            </h2>
            <dl className="space-y-5 font-serif">
              <FichaRow label={data.format.modalityLabel} value={data.format.modalities.join(' · ')} />
              <FichaRow label={data.format.durationLabel} value={data.format.duration} />
              <FichaRow label={data.format.frequencyLabel} value={data.format.frequency} />
            </dl>
          </Reveal>

          {/* Valores */}
          <Reveal delay={0.08}>
            <div className="flex items-center gap-4 mb-3">
              <span className="block w-10 h-px bg-accent/50" />
              <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                {data.values.sectionLabel}
              </p>
            </div>
            <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] text-text-bright leading-[1.15] mb-8">
              Valores e <em className="italic text-accent">combinação.</em>
            </h2>
            {data.values.show ? (
              <div className="space-y-4 font-serif">
                <p className="text-[clamp(1.8rem,3vw,2.4rem)] text-accent leading-none">
                  {data.values.perSession}{' '}
                  <span className="text-[0.8rem] text-text-dim ml-1 font-mono tracking-[0.15em] uppercase">
                    por sessão
                  </span>
                </p>
                <p className="text-[1.15rem] text-text">
                  ou <span className="text-accent">{data.values.perMonth}</span> mensalidade
                </p>
                {data.values.note && (
                  <p className="text-[0.92rem] text-text-dim italic mt-4 pt-4 border-t border-border-subtle/50 max-w-md">
                    {data.values.note}
                  </p>
                )}
              </div>
            ) : (
              <p className="font-serif text-[1.05rem] text-text leading-[1.85] max-w-md">
                {data.values.fallback}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* JANELAS — grade semanal fixa */}
      {data.schedule.show && (data.schedule.windows || []).length > 0 && (
        <section className="relative py-12 md:py-24 px-5 sm:px-6 md:px-12 section-border-t">
          <div className="relative max-w-[1100px] mx-auto">
            <Reveal>
              <div className="flex items-center gap-4 mb-3">
                <span className="block w-10 h-px bg-accent/50" />
                <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                  {data.schedule.sectionLabel}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] text-text-bright leading-[1.1] mb-4 tracking-[-0.01em]">
                Quando <em className="italic text-accent">posso atender.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="font-serif italic text-text-dim text-[1rem] leading-relaxed mb-10 max-w-xl">
                {data.schedule.note}
              </p>
            </Reveal>

            <TherapyWeekGrid
              schedule={data.schedule}
              cta={data.cta}
              whatsappNumber={data.whatsappNumber}
            />
          </div>
        </section>
      )}

      {/* FAQ — cartas tipográficas */}
      {(data.faq || []).length > 0 && (
        <section className="relative py-12 md:py-24 px-5 sm:px-6 md:px-12 section-border-t">
          <div className="relative max-w-[860px] mx-auto">
            <Reveal>
              <div className="flex items-center gap-4 mb-3">
                <span className="block w-10 h-px bg-accent/50" />
                <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                  Dúvidas frequentes
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] text-text-bright leading-[1.1] mb-14 tracking-[-0.01em]">
                Antes de <em className="italic text-accent">marcar.</em>
              </h2>
            </Reveal>
            <motion.dl
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-8"
            >
              {data.faq.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-10 pb-6 border-b border-border-subtle/50"
                >
                  <dt className="font-serif text-[1.1rem] text-text-bright leading-tight italic">
                    {f.q}
                  </dt>
                  <dd className="font-serif text-[1rem] text-text leading-[1.9]">{f.a}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>
      )}

      {/* CTA FINAL ornamentado + deontologia */}
      <section className="relative py-16 md:py-32 px-5 sm:px-6 md:px-12 section-border-t overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <StarField count={38} maxOpacity={0.5} accentChance={0.3} />
          <NebulaField count={3} />
          <div className="ambient-glow w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-60" />
        </div>

        <div className="relative max-w-[720px] mx-auto text-center">
          <Reveal>
            <div className="flex justify-center mb-8">
              <QuaternioSmall size={72} opacity={0.55} />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-serif italic text-[clamp(1.9rem,4vw,3rem)] text-text-bright leading-[1.12] mb-5 tracking-[-0.01em]">
              Se algo ressoou até aqui,
              <br />
              <span className="text-accent">vamos conversar?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-serif text-[1.02rem] text-text-dim leading-[1.85] mb-10 max-w-lg mx-auto">
              A primeira conversa é sem custo e sem compromisso — serve para a gente
              se conhecer e ver se faz sentido seguir.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="flex justify-center">
              <TherapyCTAButton cta={data.cta} whatsappNumber={data.whatsappNumber} />
            </div>
          </Reveal>

          {data.deontology.show && data.deontology.text && (
            <Reveal delay={0.3}>
              <div className="mt-20 pt-10 border-t border-border-subtle/50">
                <p className="font-mono text-[0.6rem] text-text-dim tracking-[0.18em] leading-[1.9] max-w-[620px] mx-auto">
                  {data.deontology.text}
                  {data.deontology.crp && (
                    <span className="block mt-2 text-accent/80">· {data.deontology.crp} ·</span>
                  )}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

function FichaRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 items-baseline pb-4 border-b border-border-subtle/40">
      <dt className="font-mono text-[0.58rem] text-text-dim tracking-[0.22em] uppercase">
        {label}
      </dt>
      <dd className="text-[1.05rem] text-text-bright font-serif">{value}</dd>
    </div>
  );
}
