'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getTherapy,
  setTherapy,
  DEFAULT_THERAPY,
} from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER_INLINE = 'text-red-400/70 hover:text-red-400 text-xs px-1';

const DOW_OPTIONS = [
  { v: 1, l: 'Segunda' },
  { v: 2, l: 'Terça' },
  { v: 3, l: 'Quarta' },
  { v: 4, l: 'Quinta' },
  { v: 5, l: 'Sexta' },
  { v: 6, l: 'Sábado' },
  { v: 0, l: 'Domingo' },
];

export default function TherapyManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_THERAPY);
  const [dirty, setDirty] = useState(false);
  const [block, setBlock] = useState('hero');

  useEffect(() => {
    setData(getTherapy());
  }, []);

  const update = (key, value) => {
    setData((p) => ({ ...p, [key]: { ...p[key], ...value } }));
    setDirty(true);
  };
  const setRoot = (key, value) => {
    setData((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const persist = () => {
    setTherapy(data);
    setDirty(false);
    addLogEntry?.('Psicoterapia · configuração salva');
    addToast?.('Configuração salva', 'success');
  };

  const reset = () => {
    if (!confirm('Restaurar todos os textos e campos para o padrão?')) return;
    setData(DEFAULT_THERAPY);
    setDirty(true);
  };

  const blocks = [
    { id: 'hero', label: 'Hero' },
    { id: 'approach', label: 'Como trabalho' },
    { id: 'process', label: 'Como funciona' },
    { id: 'format', label: 'Formato' },
    { id: 'values', label: 'Valores' },
    { id: 'schedule', label: 'Horários' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'CTA + modal' },
    { id: 'legal', label: 'Deontologia' },
  ];

  // Helpers pra arrays
  const updateListItem = (listKey, idx, patch) => {
    const list = [...(data[listKey] || [])];
    list[idx] = { ...list[idx], ...patch };
    setRoot(listKey, list);
  };
  const addListItem = (listKey, item) => {
    setRoot(listKey, [...(data[listKey] || []), item]);
  };
  const removeListItem = (listKey, idx) => {
    setRoot(listKey, data[listKey].filter((_, i) => i !== idx));
  };

  const updateSubListItem = (parent, listKey, idx, patch) => {
    const list = [...(data[parent][listKey] || [])];
    list[idx] = { ...list[idx], ...patch };
    update(parent, { [listKey]: list });
  };
  const addSubListItem = (parent, listKey, item) => {
    update(parent, { [listKey]: [...(data[parent][listKey] || []), item] });
  };
  const removeSubListItem = (parent, listKey, idx) => {
    update(parent, { [listKey]: data[parent][listKey].filter((_, i) => i !== idx) });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Psicoterapia · landing</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1 max-w-xl">
            Landing <code className="text-[#B48C50]">/psicoterapia-analitica</code>. Fica oculta até
            você ativar em Publicação → Visibilidade.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button
            onClick={persist}
            disabled={!dirty}
            className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}
          >
            Salvar tudo
          </button>
        </div>
      </div>

      {/* Aviso CFP no topo */}
      <div className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-4 text-[12px] text-amber-200/90 font-sans leading-relaxed">
        <strong className="text-amber-300">Atenção CFP:</strong> a Nota Técnica 01/2022 do CFP
        veda usar preço como chamariz de publicidade, além de expressões como "valores
        diferenciados", "social" ou "preço reduzido". Se quiser ficar conforme, deixe a seção de
        valores oculta (default) e mantenha apenas o texto de "conversamos na primeira conversa".
        Quando obtiver seu CRP, preencha no bloco Deontologia.
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-[rgba(180,140,80,0.1)]">
        {blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => setBlock(b.id)}
            className={`px-3 py-2 text-xs font-sans transition-colors whitespace-nowrap ${
              block === b.id
                ? 'text-[#B48C50] border-b-2 border-[#B48C50] -mb-px'
                : 'text-[#6E6458] hover:text-[#B8AD9E]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {block === 'hero' && (
        <div className={CARD + ' space-y-4'}>
          <div>
            <label className={LABEL}>Eyebrow (linha mono pequena)</label>
            <input value={data.hero.eyebrow} onChange={(e) => update('hero', { eyebrow: e.target.value })} className={INPUT} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
            <div>
              <label className={LABEL}>Título — prefixo (regular)</label>
              <input value={data.hero.title} onChange={(e) => update('hero', { title: e.target.value })} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Título — ênfase (italic dourado)</label>
              <input value={data.hero.emphasis} onChange={(e) => update('hero', { emphasis: e.target.value })} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Lead (parágrafo)</label>
            <textarea value={data.hero.lead} rows={4} onChange={(e) => update('hero', { lead: e.target.value })} className={TEXTAREA} />
          </div>
        </div>
      )}

      {block === 'approach' && (
        <div className={CARD + ' space-y-4'}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
            <div>
              <label className={LABEL}>Label da seção</label>
              <input value={data.approach.sectionLabel} onChange={(e) => update('approach', { sectionLabel: e.target.value })} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Intro (abaixo do h2)</label>
              <input value={data.approach.intro} onChange={(e) => update('approach', { intro: e.target.value })} className={INPUT} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">Princípios ({data.approach.items.length})</span>
              <button onClick={() => addSubListItem('approach', 'items', { title: 'Novo princípio', body: '' })} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.approach.items.map((it, i) => (
              <div key={i} className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <input value={it.title} onChange={(e) => updateSubListItem('approach', 'items', i, { title: e.target.value })} placeholder="Título" className={INPUT} />
                  <button onClick={() => removeSubListItem('approach', 'items', i)} className={BTN_DANGER_INLINE}>×</button>
                </div>
                <textarea value={it.body} rows={3} onChange={(e) => updateSubListItem('approach', 'items', i, { body: e.target.value })} placeholder="Corpo" className={TEXTAREA} />
              </div>
            ))}
          </div>
        </div>
      )}

      {block === 'process' && (
        <div className={CARD + ' space-y-4'}>
          <div>
            <label className={LABEL}>Label da seção</label>
            <input value={data.process.sectionLabel} onChange={(e) => update('process', { sectionLabel: e.target.value })} className={INPUT} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">Passos ({data.process.steps.length})</span>
              <button onClick={() => addSubListItem('process', 'steps', { title: 'Novo passo', body: '' })} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.process.steps.map((s, i) => (
              <div key={i} className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <input value={s.title} onChange={(e) => updateSubListItem('process', 'steps', i, { title: e.target.value })} placeholder="Título" className={INPUT} />
                  <button onClick={() => removeSubListItem('process', 'steps', i)} className={BTN_DANGER_INLINE}>×</button>
                </div>
                <textarea value={s.body} rows={3} onChange={(e) => updateSubListItem('process', 'steps', i, { body: e.target.value })} placeholder="Corpo" className={TEXTAREA} />
              </div>
            ))}
          </div>
        </div>
      )}

      {block === 'format' && (
        <div className={CARD + ' space-y-4'}>
          <div>
            <label className={LABEL}>Label da seção</label>
            <input value={data.format.sectionLabel} onChange={(e) => update('format', { sectionLabel: e.target.value })} className={INPUT} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Modalidades (uma por linha)</label>
              <textarea
                value={(data.format.modalities || []).join('\n')}
                onChange={(e) => update('format', { modalities: e.target.value.split('\n').filter(Boolean) })}
                rows={3}
                className={TEXTAREA}
                placeholder="Online&#10;Presencial · Recife"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Duração</label>
                <input value={data.format.duration} onChange={(e) => update('format', { duration: e.target.value })} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Frequência</label>
                <input value={data.format.frequency} onChange={(e) => update('format', { frequency: e.target.value })} className={INPUT} />
              </div>
            </div>
          </div>
        </div>
      )}

      {block === 'values' && (
        <div className={CARD + ' space-y-4'}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#E8DDD0] font-sans font-semibold">Mostrar valores na landing</p>
              <p className="text-[11px] text-amber-300 mt-0.5">Cuidado com CFP — ler aviso acima</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.values.show}
              onClick={() => update('values', { show: !data.values.show })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                data.values.show ? 'bg-[#B48C50]' : 'bg-[rgba(180,140,80,0.15)]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-[#0E0C0A] transition-transform ${data.values.show ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Por sessão</label>
              <input value={data.values.perSession} onChange={(e) => update('values', { perSession: e.target.value })} className={INPUT} placeholder="R$ 120" />
            </div>
            <div>
              <label className={LABEL}>Mensalidade</label>
              <input value={data.values.perMonth} onChange={(e) => update('values', { perMonth: e.target.value })} className={INPUT} placeholder="R$ 400" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Nota (quando mostra valor)</label>
            <input value={data.values.note} onChange={(e) => update('values', { note: e.target.value })} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Fallback (quando não mostra valor) — conforme CFP</label>
            <textarea value={data.values.fallback} rows={2} onChange={(e) => update('values', { fallback: e.target.value })} className={TEXTAREA} />
          </div>
        </div>
      )}

      {block === 'schedule' && (
        <div className={CARD + ' space-y-4'}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#E8DDD0] font-sans font-semibold">Mostrar grade de horários</p>
              <p className="text-[11px] text-[#6E6458] mt-0.5">Sugere horários da próxima quinzena; clique = WhatsApp pré-preenchido</p>
            </div>
            <button
              type="button"
              onClick={() => update('schedule', { show: !data.schedule.show })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                data.schedule.show ? 'bg-[#B48C50]' : 'bg-[rgba(180,140,80,0.15)]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-[#0E0C0A] transition-transform ${data.schedule.show ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Label da seção</label>
              <input value={data.schedule.sectionLabel} onChange={(e) => update('schedule', { sectionLabel: e.target.value })} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Intervalo entre horários (horas)</label>
              <select value={data.schedule.stepHour || 1} onChange={(e) => update('schedule', { stepHour: Number(e.target.value) })} className={INPUT}>
                <option value={0.5}>30 min</option>
                <option value={1}>1 hora</option>
                <option value={1.5}>1h30</option>
                <option value={2}>2 horas</option>
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Nota da seção</label>
            <textarea value={data.schedule.note} rows={2} onChange={(e) => update('schedule', { note: e.target.value })} className={TEXTAREA} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">Janelas recorrentes ({data.schedule.windows.length})</span>
              <button onClick={() => update('schedule', { windows: [...data.schedule.windows, { dow: 1, label: 'Segunda', startHour: 14, endHour: 21 }] })} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.schedule.windows.map((w, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_80px_auto] gap-2 items-center bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-2">
                <select
                  value={w.dow}
                  onChange={(e) => {
                    const nDow = Number(e.target.value);
                    const label = DOW_OPTIONS.find((o) => o.v === nDow)?.l || '';
                    const windows = [...data.schedule.windows];
                    windows[i] = { ...w, dow: nDow, label };
                    update('schedule', { windows });
                  }}
                  className={INPUT + ' text-xs'}
                >
                  {DOW_OPTIONS.map((o) => (
                    <option key={o.v} value={o.v}>{o.l}</option>
                  ))}
                </select>
                <input
                  value={w.label}
                  onChange={(e) => {
                    const windows = [...data.schedule.windows];
                    windows[i] = { ...w, label: e.target.value };
                    update('schedule', { windows });
                  }}
                  className={INPUT + ' text-xs'}
                  placeholder="Label"
                />
                <input
                  type="number" min={0} max={23}
                  value={w.startHour}
                  onChange={(e) => {
                    const windows = [...data.schedule.windows];
                    windows[i] = { ...w, startHour: Number(e.target.value) };
                    update('schedule', { windows });
                  }}
                  className={INPUT + ' text-xs'}
                  placeholder="Início (h)"
                />
                <input
                  type="number" min={0} max={24}
                  value={w.endHour}
                  onChange={(e) => {
                    const windows = [...data.schedule.windows];
                    windows[i] = { ...w, endHour: Number(e.target.value) };
                    update('schedule', { windows });
                  }}
                  className={INPUT + ' text-xs'}
                  placeholder="Fim (h)"
                />
                <button
                  onClick={() => update('schedule', { windows: data.schedule.windows.filter((_, j) => j !== i) })}
                  className={BTN_DANGER_INLINE}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {block === 'faq' && (
        <div className={CARD + ' space-y-3'}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">FAQ clínico ({(data.faq || []).length})</span>
            <button onClick={() => addListItem('faq', { q: 'Nova pergunta?', a: '' })} className={BTN_SECONDARY}>+ Adicionar</button>
          </div>
          {(data.faq || []).map((f, i) => (
            <div key={i} className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <input value={f.q} onChange={(e) => updateListItem('faq', i, { q: e.target.value })} placeholder="Pergunta" className={INPUT} />
                <button onClick={() => removeListItem('faq', i)} className={BTN_DANGER_INLINE}>×</button>
              </div>
              <textarea value={f.a} rows={3} onChange={(e) => updateListItem('faq', i, { a: e.target.value })} placeholder="Resposta" className={TEXTAREA} />
            </div>
          ))}
        </div>
      )}

      {block === 'cta' && (
        <div className={CARD + ' space-y-4'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Label do botão primário</label>
              <input value={data.cta.primaryLabel} onChange={(e) => update('cta', { primaryLabel: e.target.value })} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Helper (abaixo do botão)</label>
              <input value={data.cta.helper} onChange={(e) => update('cta', { helper: e.target.value })} className={INPUT} />
            </div>
          </div>
          <div className="border-t border-[rgba(180,140,80,0.1)] pt-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">Modal · passos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>Título passo 1</label>
                <input value={data.cta.modalTitleStep1} onChange={(e) => update('cta', { modalTitleStep1: e.target.value })} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Título passo 2</label>
                <input value={data.cta.modalTitleStep2} onChange={(e) => update('cta', { modalTitleStep2: e.target.value })} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Título passo 3</label>
                <input value={data.cta.modalTitleStep3} onChange={(e) => update('cta', { modalTitleStep3: e.target.value })} className={INPUT} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Motivações (uma por linha)</label>
              <textarea
                value={(data.cta.motivations || []).join('\n')}
                onChange={(e) => update('cta', { motivations: e.target.value.split('\n').filter(Boolean) })}
                rows={5}
                className={TEXTAREA}
              />
            </div>
            <div>
              <label className={LABEL}>Formatos (uma por linha)</label>
              <textarea
                value={(data.cta.formats || []).join('\n')}
                onChange={(e) => update('cta', { formats: e.target.value.split('\n').filter(Boolean) })}
                rows={3}
                className={TEXTAREA}
              />
            </div>
            <div>
              <label className={LABEL}>Template da mensagem (<code>{'{{motivation}}'}</code>, <code>{'{{format}}'}</code>, <code>{'{{slot}}'}</code>)</label>
              <textarea value={data.cta.messageTemplate} rows={6} onChange={(e) => update('cta', { messageTemplate: e.target.value })} className={TEXTAREA} />
            </div>
          </div>
          <div className="border-t border-[rgba(180,140,80,0.1)] pt-4">
            <label className={LABEL}>Número WhatsApp (só dígitos)</label>
            <input value={data.whatsappNumber} onChange={(e) => setRoot('whatsappNumber', e.target.value.replace(/\D/g, ''))} className={INPUT} placeholder="5581987349114" />
          </div>
        </div>
      )}

      {block === 'legal' && (
        <div className={CARD + ' space-y-4'}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#E8DDD0] font-sans font-semibold">Mostrar aviso deontológico</p>
            <button
              type="button"
              onClick={() => update('deontology', { show: !data.deontology.show })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                data.deontology.show ? 'bg-[#B48C50]' : 'bg-[rgba(180,140,80,0.15)]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-[#0E0C0A] transition-transform ${data.deontology.show ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div>
            <label className={LABEL}>Texto do aviso (estágio/formação)</label>
            <textarea value={data.deontology.text} rows={4} onChange={(e) => update('deontology', { text: e.target.value })} className={TEXTAREA} />
            <p className="text-[11px] text-[#6E6458] mt-2">
              Ao formar e obter CRP, substitua pelo texto padrão + preencha o número abaixo.
            </p>
          </div>
          <div>
            <label className={LABEL}>CRP (ex: "CRP 02/XXXXX") — opcional até formar</label>
            <input value={data.deontology.crp} onChange={(e) => update('deontology', { crp: e.target.value })} className={INPUT} />
          </div>
        </div>
      )}

      {dirty && (
        <div className="sticky bottom-4 z-30 bg-[#1A1714] border border-[#B48C50] rounded-xl p-3 flex items-center justify-between shadow-xl">
          <span className="text-sm text-[#E8DDD0] font-sans">Você tem alterações não salvas.</span>
          <button onClick={persist} className={BTN_PRIMARY}>Salvar tudo</button>
        </div>
      )}
    </motion.div>
  );
}
