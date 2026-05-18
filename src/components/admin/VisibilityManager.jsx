'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_VISIBILITY, getSiteVisibility, setSiteVisibility } from '@/lib/sitedata';

const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4 sm:p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';

// Agrupamento dos toggles pra UI ficar organizada
const GROUPS = [
  {
    label: 'Módulos principais',
    hint: 'Quando oculto, some do menu, da home e a página dedicada vira placeholder.',
    items: [
      { key: 'blog',         label: 'Blog e ensaios',                  url: '/blog' },
      { key: 'cursos',       label: 'Cursos',                          url: '/cursos' },
      { key: 'materiais',    label: 'Materiais',                       url: '/materiais' },
      { key: 'trilhas',      label: 'Trilhas de estudo',               url: '/trilhas' },
      { key: 'estudos',      label: 'Estudos (hub)',                   url: '/estudos' },
      { key: 'glossario',    label: 'Glossário junguiano (curado)',    url: '/glossario' },
      { key: 'psicoterapia', label: 'Psicoterapia (landing consultório)', url: '/psicoterapia-analitica' },
      { key: 'bio',          label: 'Bio / Linktree',                  url: '/bio' },
    ],
  },
  {
    label: 'Seções da home',
    hint: 'Controla só o que aparece na página inicial. Audience/Approach/FAQ vêm desligados — o conteúdo canônico vive na landing /psicoterapia-analitica/, ligar aqui duplica e canibaliza SEO.',
    items: [
      { key: 'disclaimerEstagio', label: 'Faixa de status (estagiário + supervisão)' },
      { key: 'bussola',           label: 'Bússola (mapa das 6 portas — porta de entrada)' },
      { key: 'prelude',           label: 'Prelúdio (passagem italic)' },
      { key: 'about',             label: 'Sobre (About)' },
      { key: 'audience',          label: 'Para quem atendo (3 públicos) — duplica /psicoterapia-analitica' },
      { key: 'approach',          label: 'Como trabalho (3 princípios) — duplica /psicoterapia-analitica' },
      { key: 'cartografia',       label: 'Cartografia (mapa de conceitos)' },
      { key: 'depoimentos',       label: 'Depoimentos' },
      { key: 'faq',               label: 'Perguntas frequentes (FAQ) — duplica /psicoterapia-analitica' },
      { key: 'contato',           label: 'Convite de contato (ContactCTA)' },
    ],
  },
  {
    label: 'Extras',
    items: [
      { key: 'whatsappFlutuante', label: 'Botão flutuante do WhatsApp' },
    ],
  },
];

function Toggle({ checked, onChange, label, url, onVisit }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[rgba(180,140,80,0.06)] last:border-b-0">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${checked ? 'Ocultar' : 'Mostrar'} ${label}`}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B48C50] ${
          checked ? 'bg-[#B48C50]' : 'bg-[rgba(180,140,80,0.15)]'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-[#0E0C0A] transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex-1 min-w-0 text-left"
      >
        <p className={`text-sm font-sans ${checked ? 'text-[#E8DDD0]' : 'text-[#6E6458]'} transition-colors`}>
          {label}
        </p>
        {url && (
          <span className="text-[10px] font-mono text-[#6E6458] tracking-wider">
            {url}
          </span>
        )}
      </button>

      {url && (
        <button
          type="button"
          onClick={onVisit}
          className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#6E6458] hover:text-[#B48C50] transition-colors whitespace-nowrap px-2 py-1"
        >
          abrir →
        </button>
      )}
    </div>
  );
}

export default function VisibilityManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_VISIBILITY);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(getSiteVisibility());
  }, []);

  const toggle = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const persist = () => {
    setSiteVisibility(data);
    setDirty(false);
    const hiddenList = Object.entries(data).filter(([, v]) => !v).map(([k]) => k);
    addLogEntry?.('Visibilidade salva', hiddenList.length ? `${hiddenList.length} ocultos` : 'tudo visível');
    addToast?.('Visibilidade salva', 'success');
  };

  const resetAll = () => {
    if (!confirm('Restaurar visibilidade padrão (tudo visível)?')) return;
    setData(DEFAULT_VISIBILITY);
    setDirty(true);
  };

  const hideAllIn = (keys) => {
    setData((prev) => ({
      ...prev,
      ...Object.fromEntries(keys.map((k) => [k, false])),
    }));
    setDirty(true);
  };

  const showAllIn = (keys) => {
    setData((prev) => ({
      ...prev,
      ...Object.fromEntries(keys.map((k) => [k, true])),
    }));
    setDirty(true);
  };

  const hiddenCount = Object.values(data).filter((v) => !v).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Visibilidade do site</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Oculta módulos e seções sem apagar nada.{' '}
            {hiddenCount > 0 && (
              <span className="text-[#B48C50]">
                {hiddenCount} {hiddenCount === 1 ? 'item oculto' : 'itens ocultos'}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={resetAll} className={BTN_SECONDARY}>
            Mostrar tudo
          </button>
          <button
            onClick={persist}
            disabled={!dirty}
            className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}
          >
            Salvar
          </button>
        </div>
      </div>

      {dirty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-16 sm:bottom-4 z-40 bg-[#B48C50] text-[#0E0C0A] rounded-lg shadow-lg shadow-black/40 flex items-center justify-between gap-3 px-4 py-3"
        >
          <span className="text-xs sm:text-sm font-sans font-semibold">
            Você tem mudanças não salvas
          </span>
          <button
            onClick={persist}
            className="px-4 py-1.5 bg-[#0E0C0A] text-[#B48C50] text-xs font-sans font-semibold rounded tracking-wider uppercase"
          >
            Salvar agora
          </button>
        </motion.div>
      )}

      {GROUPS.map((group) => {
        const keys = group.items.map((i) => i.key);
        const allOn = keys.every((k) => data[k]);
        const allOff = keys.every((k) => !data[k]);
        return (
          <div key={group.label} className={CARD}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div>
                <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest">
                  {group.label}
                </h3>
                {group.hint && (
                  <p className="text-[11px] text-[#6E6458] mt-1">{group.hint}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => hideAllIn(keys)}
                  disabled={allOff}
                  className={BTN_SECONDARY + (allOff ? ' opacity-30 cursor-not-allowed' : '')}
                >
                  ocultar tudo
                </button>
                <button
                  onClick={() => showAllIn(keys)}
                  disabled={allOn}
                  className={BTN_SECONDARY + (allOn ? ' opacity-30 cursor-not-allowed' : '')}
                >
                  mostrar tudo
                </button>
              </div>
            </div>

            <div className="divide-y divide-[rgba(180,140,80,0.06)]">
              {group.items.map((item) => (
                <Toggle
                  key={item.key}
                  label={item.label}
                  url={item.url}
                  checked={!!data[item.key]}
                  onChange={(v) => toggle(item.key, v)}
                  onVisit={item.url ? () => window.open(`/Psiangelo${item.url}`, '_blank') : null}
                />
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
