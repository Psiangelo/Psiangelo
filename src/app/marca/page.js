'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LOGO_GROUPS } from '@/components/marca/LogoVariants';

export default function MarcaPage() {
  const [bg, setBg] = useState('dark');
  const [selected, setSelected] = useState(null);

  const bgClass = bg === 'dark'
    ? 'bg-[#0E0C0A]'
    : bg === 'warm'
      ? 'bg-[#1A1714]'
      : 'bg-[#E8DDD0]';

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 md:pt-40 pb-10 px-5 sm:px-6 md:px-12">
          <div className="max-w-[1180px] mx-auto">
            <p className="meta-caps-accent mb-4">Identidade · Explorações tipográficas</p>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] text-text-bright leading-[1.05] tracking-[-0.01em] mb-4">
              Marca <em className="italic text-accent">Psiangelo</em>
            </h1>
            <p className="text-[0.98rem] text-text-dim leading-[1.8] max-w-2xl">
              Duas famílias em destaque — <strong className="text-text-bright">Geométrico</strong> e <strong className="text-text-bright">Alquímico</strong> — com 5 variações cada.
              Clique em qualquer card pra ampliar; use o seletor de fundo pra ver em contextos diferentes.
            </p>
          </div>
        </section>

        {/* Controles */}
        <section className="px-5 sm:px-6 md:px-12 mb-8 sticky top-[60px] z-40 bg-bg/90 backdrop-blur py-3 border-b border-border-subtle/50">
          <div className="max-w-[1180px] mx-auto flex items-center gap-3 flex-wrap">
            <span className="meta-caps-accent mr-2">Fundo</span>
            <div className="inline-flex border border-border-subtle">
              {[
                { key: 'dark', label: 'Escuro' },
                { key: 'warm', label: 'Quente' },
                { key: 'light', label: 'Claro' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setBg(opt.key)}
                  className={`px-4 py-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-colors ${
                    bg === opt.key ? 'bg-accent text-bg' : 'text-text-dim hover:text-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Anchor jumps */}
            <span className="meta-caps-accent ml-6 mr-2 hidden md:inline">Ir para</span>
            {LOGO_GROUPS.map((g) => (
              <a
                key={g.key}
                href={`#${g.key}`}
                className="hidden md:inline font-mono text-[0.58rem] tracking-[0.22em] uppercase text-text-dim hover:text-accent transition-colors"
              >
                {g.label}
              </a>
            ))}
          </div>
        </section>

        {/* Seções por família */}
        {LOGO_GROUPS.map((group) => (
          <section key={group.key} id={group.key} className="px-5 sm:px-6 md:px-12 pb-14">
            <div className="max-w-[1180px] mx-auto">
              <header className="mb-6 flex items-baseline gap-4">
                <div className="min-w-0">
                  <p className="meta-caps-accent mb-1">{group.eyebrow}</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-text-bright leading-tight">
                    {group.label}
                  </h2>
                  <p className="text-[0.9rem] text-text-dim mt-2 max-w-2xl leading-[1.7]">
                    {group.intro}
                  </p>
                </div>
                <span className="flex-shrink-0 font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                  {group.variants.length}
                </span>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.variants.map((v, i) => (
                  <LogoCard
                    key={v.id}
                    variant={v}
                    bgClass={bgClass}
                    index={i}
                    onExpand={() => setSelected(v)}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Modal de expansão */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-5 sm:p-12 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[1200px] w-full cursor-default"
          >
            <div className={`${bgClass} border border-accent/30 p-8 md:p-14`}>
              <selected.Comp />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="meta-caps-accent mb-1">{selected.name}</p>
                <p className="text-text-dim text-[0.9rem] max-w-2xl">{selected.desc}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="font-mono text-[0.6rem] text-text-dim tracking-[0.22em] uppercase hover:text-accent transition-colors"
              >
                ESC fechar ×
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function LogoCard({ variant, bgClass, index, onExpand }) {
  const { Comp, name, desc } = variant;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="group border border-border-subtle hover:border-accent/40 transition-colors bg-bg-card">
      <button
        onClick={onExpand}
        className={`${bgClass} w-full flex items-center justify-center p-6 md:p-10 cursor-zoom-in border-b border-border-subtle min-h-[220px]`}
        aria-label={`Ampliar logo ${name}`}
      >
        <div className="w-full max-w-[600px]">
          <Comp />
        </div>
      </button>

      <div className="p-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-mono text-[0.58rem] text-accent tracking-[0.22em] uppercase">
              #{number}
            </span>
            <h3 className="font-serif text-lg text-text-bright leading-tight">
              {name}
            </h3>
          </div>
          <p className="text-[0.85rem] text-text-dim leading-[1.6]">
            {desc}
          </p>
        </div>
        <button
          onClick={onExpand}
          className="flex-shrink-0 p-2 text-text-dim hover:text-accent transition-colors"
          aria-label="Ampliar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
