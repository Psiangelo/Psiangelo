'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { OrbitalAccent } from '@/components/illustrations';
import { getFaqs, DEFAULT_FAQS, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';

const GROUP_BLURBS = {
  'Clínica':        'Como funciona o atendimento online.',
  'Abordagem':      'O que é a psicologia analítica.',
  'Ética e sigilo': 'Sobre o cuidado, o status profissional e o sigilo.',
  // Legado (compatibilidade caso admin ainda tenha FAQ antiga de materiais)
  'Entrega':   'Como o material chega até você.',
  'Catálogo':  'O que existe e o que está por vir.',
  'Conteúdo':  'Sobre a profundidade e o método.',
  'Geral':     'Perguntas variadas.',
};

function groupFaqs(faqs) {
  const byGroup = new Map();
  for (const f of faqs || []) {
    const g = f.group || 'Geral';
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g).push(f);
  }
  return Array.from(byGroup.entries()).map(([label, items]) => ({
    id: label.toLowerCase(),
    label,
    blurb: GROUP_BLURBS[label] || 'Perguntas relacionadas.',
    items,
  }));
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-5 text-left group cursor-pointer gap-4"
      >
        <span
          className={`font-serif text-[0.98rem] md:text-[1.05rem] leading-snug pr-2 transition-colors duration-300 flex-1 ${
            isOpen ? 'text-accent' : 'text-text-bright group-hover:text-accent'
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 flex items-center justify-center border transition-all duration-300 ${
            isOpen
              ? 'border-accent/40 text-accent rotate-45'
              : 'border-border-subtle text-text-dim group-hover:border-border-hover group-hover:text-accent'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[0.88rem] text-text leading-[1.85] pb-5 pr-10">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  // estado: chave única "groupId:itemIndex"
  const [openKey, setOpenKey] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const faqs = useSitedata(getFaqs, DEFAULT_FAQS, SITEDATA_KEYS.faqs);
  const faqGroups = useMemo(() => groupFaqs(faqs), [faqs]);
  if (faqGroups.length === 0) return null;

  return (
    <section
      id="faq"
      className="py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t relative overflow-hidden"
      ref={ref}
    >
      <OrbitalAccent
        className="absolute -top-20 -left-32 pointer-events-none hidden lg:block"
        size={320}
        opacity={0.07}
      />
      <motion.div
        initial="visible"
        animate="visible"
        variants={stagger}
        className="max-w-[1180px] mx-auto relative"
      >
        <SectionLabel label="Dúvidas" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-3 max-w-3xl"
        >
          Perguntas <em className="italic text-accent">frequentes</em>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-[0.95rem] text-text-dim leading-[1.85] max-w-xl mb-14"
        >
          Respostas às dúvidas mais comuns sobre o atendimento online, a
          abordagem junguiana e a ética da clínica. Para mais detalhes, veja{' '}
          <a
            href="/Psiangelo/psicoterapia-analitica/"
            className="text-accent hover:text-text-bright transition-colors underline decoration-accent/30 underline-offset-4"
          >
            a página de psicoterapia
          </a>
          .
        </motion.p>

        {/* 3 grupos em 2 colunas: a primeira larga (Entrega) ocupa coluna 1
            inteira em desktop, as duas menores ficam empilhadas na coluna 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-10">
          {faqGroups.map((group, gi) => (
            <motion.section
              key={group.id}
              variants={fadeUp}
              className={gi === 0 ? 'lg:row-span-2' : ''}
            >
              <header className="mb-5 pb-4 border-b border-accent/20">
                <p className="meta-caps-accent mb-1.5">{group.label}</p>
                <p className="font-serif italic text-text-dim text-[0.92rem]">
                  {group.blurb}
                </p>
              </header>
              <div>
                {group.items.map((item, i) => {
                  const key = `${group.id}:${i}`;
                  return (
                    <FAQItem
                      key={key}
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
