'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DEFAULT_LABELS,
  DEFAULT_NAV_LABELS,
  DEFAULT_SECTION_LABELS,
  getLabels,
  setLabels,
} from '@/lib/sitedata';

const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4 sm:p-5';
const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1.5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';

// Lista de campos por seção pra ordenar e dar contexto na UI
const NAV_FIELDS = [
  { key: 'home',         label: 'Home',         hint: 'Link "Home" da navbar' },
  { key: 'psicoterapia', label: 'Psicoterapia', hint: 'Link da landing /psicoterapia-analitica' },
  { key: 'blog',         label: 'Blog',         hint: 'Link da página /blog' },
  { key: 'estudos',      label: 'Estudos',      hint: 'Link do hub /estudos' },
  { key: 'materiais',    label: 'Materiais',    hint: 'Link de /materiais' },
  { key: 'cursos',       label: 'Cursos',       hint: 'Link de /cursos' },
];

const SECTION_FIELDS = [
  { key: 'bussola',     label: 'Bússola (porta de entrada)',  hint: 'Título da seção das portas — "Cinco portas desta clínica e da casa."' },
  { key: 'about',       label: 'Sobre',                        hint: 'Título principal da seção Sobre (default vem do editor da home)' },
  { key: 'trilhas',     label: 'Trilhas (preview)',            hint: '"Por onde começar"' },
  { key: 'materials',   label: 'Materiais (preview)',          hint: '"Notas de estudo e clínica"' },
  { key: 'blog',        label: 'Blog (preview)',               hint: '"Publicações recentes"' },
  { key: 'cursos',      label: 'Cursos (preview)',             hint: '"Cursos disponíveis"' },
  { key: 'depoimentos', label: 'Depoimentos',                  hint: '"O que dizem sobre o trabalho"' },
  { key: 'faq',         label: 'FAQ',                          hint: '"Perguntas frequentes"' },
  { key: 'contato',     label: 'Contato (CTA final)',          hint: '"Pronto para uma primeira conversa?" — herda do editor da home' },
];

function Field({ value, onChange, fallback, label, hint }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={fallback || 'usar default'}
        className={INPUT}
      />
      {hint && <p className="text-[10px] text-[#6E6458] italic mt-1">{hint}</p>}
    </div>
  );
}

export default function LabelsManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_LABELS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(getLabels());
  }, []);

  const updateNav = (k, v) => {
    setData((prev) => ({ ...prev, nav: { ...prev.nav, [k]: v } }));
    setDirty(true);
  };
  const updateSection = (k, v) => {
    setData((prev) => ({ ...prev, sections: { ...prev.sections, [k]: v } }));
    setDirty(true);
  };

  const persist = () => {
    setLabels(data);
    setDirty(false);
    addLogEntry?.('Labels salvos');
    addToast?.('Labels salvos', 'success');
  };

  const resetAll = () => {
    if (!confirm('Restaurar nomes padrão (apaga todas as customizações)?')) return;
    setData(DEFAULT_LABELS);
    setDirty(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Nomes (labels)</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1 max-w-2xl">
            Renomeie links da barra de navegação e títulos das seções da home.
            Deixar em branco usa o nome padrão do site.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={resetAll} className={BTN_SECONDARY}>
            Restaurar padrão
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

      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest mb-1">
          Barra de navegação
        </h3>
        <p className="text-[11px] text-[#6E6458] mb-4">
          Cada campo renomeia o link correspondente na navbar (desktop e mobile).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NAV_FIELDS.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              hint={f.hint}
              fallback={DEFAULT_NAV_LABELS[f.key]}
              value={data.nav?.[f.key] ?? ''}
              onChange={(v) => updateNav(f.key, v)}
            />
          ))}
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest mb-1">
          Títulos das seções da home
        </h3>
        <p className="text-[11px] text-[#6E6458] mb-4">
          Substitui o título principal de cada seção da página inicial. Em
          branco, o site mostra o título padrão (com itálicos no destaque).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECTION_FIELDS.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              hint={f.hint}
              fallback={DEFAULT_SECTION_LABELS[f.key] || ''}
              value={data.sections?.[f.key] ?? ''}
              onChange={(v) => updateSection(f.key, v)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
