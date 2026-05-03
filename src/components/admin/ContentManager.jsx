'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHomepage, setHomepage, DEFAULT_HOMEPAGE } from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER_INLINE = 'text-red-400/70 hover:text-red-400 text-xs px-1';

export default function ContentManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_HOMEPAGE);
  const [dirty, setDirty] = useState(false);
  const [activeBlock, setActiveBlock] = useState('hero');

  useEffect(() => {
    setData(getHomepage());
  }, []);

  const updateBlock = (block, key, value) => {
    setData((prev) => ({
      ...prev,
      [block]: { ...prev[block], [key]: value },
    }));
    setDirty(true);
  };

  const updateCredential = (idx, key, value) => {
    const credentials = [...data.about.credentials];
    credentials[idx] = { ...credentials[idx], [key]: value };
    setData({ ...data, about: { ...data.about, credentials } });
    setDirty(true);
  };

  const addCredential = () => {
    const credentials = [...data.about.credentials, { mark: '◆', label: 'Novo', detail: '' }];
    setData({ ...data, about: { ...data.about, credentials } });
    setDirty(true);
  };

  const removeCredential = (idx) => {
    const credentials = data.about.credentials.filter((_, i) => i !== idx);
    setData({ ...data, about: { ...data.about, credentials } });
    setDirty(true);
  };

  const updateMilestone = (idx, key, value) => {
    const milestones = [...data.about.milestones];
    milestones[idx] = { ...milestones[idx], [key]: value };
    setData({ ...data, about: { ...data.about, milestones } });
    setDirty(true);
  };

  const addMilestone = () => {
    const milestones = [...data.about.milestones, { year: '?', label: 'Marco', detail: '' }];
    setData({ ...data, about: { ...data.about, milestones } });
    setDirty(true);
  };

  const removeMilestone = (idx) => {
    const milestones = data.about.milestones.filter((_, i) => i !== idx);
    setData({ ...data, about: { ...data.about, milestones } });
    setDirty(true);
  };

  const updateAboutImage = (idx, key, value) => {
    const images = [...(data.about.images || [])];
    images[idx] = { ...images[idx], [key]: value };
    setData({ ...data, about: { ...data.about, images } });
    setDirty(true);
  };

  const addAboutImage = () => {
    const images = [...(data.about.images || []), { src: '', alt: '', caption: '' }];
    setData({ ...data, about: { ...data.about, images } });
    setDirty(true);
  };

  const removeAboutImage = (idx) => {
    const images = (data.about.images || []).filter((_, i) => i !== idx);
    setData({ ...data, about: { ...data.about, images } });
    setDirty(true);
  };

  const moveAboutImage = (idx, dir) => {
    const images = [...(data.about.images || [])];
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    [images[idx], images[target]] = [images[target], images[idx]];
    setData({ ...data, about: { ...data.about, images } });
    setDirty(true);
  };

  const handleImageUpload = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updateAboutImage(idx, 'src', e.target.result);
    reader.readAsDataURL(file);
  };

  // ─── BÚSSOLA — handlers de portas ──────────────────────────────────
  const getBussola = () => data.bussola || DEFAULT_HOMEPAGE.bussola;
  const updateBussolaPortal = (idx, key, value) => {
    const b = getBussola();
    const portals = [...(b.portals || [])];
    portals[idx] = { ...portals[idx], [key]: value };
    setData((prev) => ({ ...prev, bussola: { ...b, portals } }));
    setDirty(true);
  };
  const addBussolaPortal = () => {
    const b = getBussola();
    const portals = [
      ...(b.portals || []),
      { id: `porta-${Date.now()}`, visKey: '', href: '/', glyph: '◆', eyebrow: 'Nova', title: 'Nova porta', body: '', cta: 'Abrir' },
    ];
    setData((prev) => ({ ...prev, bussola: { ...b, portals } }));
    setDirty(true);
  };
  const removeBussolaPortal = (idx) => {
    const b = getBussola();
    const portals = (b.portals || []).filter((_, i) => i !== idx);
    setData((prev) => ({ ...prev, bussola: { ...b, portals } }));
    setDirty(true);
  };
  const moveBussolaPortal = (idx, dir) => {
    const b = getBussola();
    const portals = [...(b.portals || [])];
    const target = idx + dir;
    if (target < 0 || target >= portals.length) return;
    [portals[idx], portals[target]] = [portals[target], portals[idx]];
    setData((prev) => ({ ...prev, bussola: { ...b, portals } }));
    setDirty(true);
  };

  const persist = () => {
    setHomepage(data);
    setDirty(false);
    addLogEntry?.('Conteúdo da home salvo', `bloco ativo: ${activeBlock}`);
    addToast?.('Conteúdo salvo', 'success');
  };

  const resetAll = () => {
    if (!confirm('Restaurar todos os textos para o padrão? Suas edições serão perdidas.')) return;
    setData(DEFAULT_HOMEPAGE);
    setDirty(true);
  };

  const resetBlock = (blockId) => {
    const block = blocks.find((b) => b.id === blockId);
    const label = block?.label || blockId;
    if (!confirm(`Restaurar a seção "${label}" para o padrão? As edições desta seção serão perdidas.`)) return;
    setData((prev) => ({ ...prev, [blockId]: DEFAULT_HOMEPAGE[blockId] }));
    setDirty(true);
  };

  const blocks = [
    { id: 'hero',    label: 'Hero' },
    { id: 'bussola', label: 'Bússola' },
    { id: 'prelude', label: 'Prelúdio' },
    { id: 'about',   label: 'Sobre' },
    { id: 'contact', label: 'Contato' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Conteúdo da home</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Textos editoriais que aparecem na página inicial
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetAll} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={persist} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar tudo
          </button>
        </div>
      </div>

      {/* Tabs entre blocos */}
      <div className="flex gap-1 border-b border-[rgba(180,140,80,0.1)]">
        {blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBlock(b.id)}
            className={`px-4 py-2 text-sm font-sans transition-colors ${
              activeBlock === b.id
                ? 'text-[#B48C50] border-b-2 border-[#B48C50] -mb-px'
                : 'text-[#6E6458] hover:text-[#B8AD9E]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* HERO */}
      {activeBlock === 'hero' && (
        <div className={CARD + ' space-y-4'}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Hero (topo da home)</h3>
            <button
              onClick={() => resetBlock('hero')}
              className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#6E6458] hover:text-[#B48C50] transition-colors"
              title="Substitui o conteúdo desta seção pelo texto padrão."
            >
              ↺ Restaurar
            </button>
          </div>
          <div>
            <label className={LABEL}>Eyebrow (linha mono pequena)</label>
            <input value={data.hero.eyebrow} onChange={(e) => updateBlock('hero', 'eyebrow', e.target.value)} className={INPUT} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Título — prefixo (regular)</label>
              <input value={data.hero.titlePrefix} onChange={(e) => updateBlock('hero', 'titlePrefix', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Título — ênfase (italic dourado)</label>
              <input value={data.hero.titleEmphasis} onChange={(e) => updateBlock('hero', 'titleEmphasis', e.target.value)} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Tagline (italic abaixo do título)</label>
            <input value={data.hero.tagline} onChange={(e) => updateBlock('hero', 'tagline', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Lead (parágrafo)</label>
            <textarea value={data.hero.lead} rows={4} onChange={(e) => updateBlock('hero', 'lead', e.target.value)} className={TEXTAREA} />
          </div>
        </div>
      )}

      {/* BÚSSOLA */}
      {activeBlock === 'bussola' && (
        <>
          <div className={CARD + ' space-y-4'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Bússola — cabeçalho</h3>
              <button
                onClick={() => resetBlock('bussola')}
                className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#6E6458] hover:text-[#B48C50] transition-colors"
                title="Substitui o cabeçalho e as portas pela versão padrão."
              >
                ↺ Restaurar
              </button>
            </div>
            <p className="text-[11px] text-[#6E6458] font-sans italic">
              A bússola é a porta de entrada da home — substitui a duplicação que existia entre a home e a /psicoterapia-analitica/. Cada porta leva pra uma seção do site.
            </p>
            <div>
              <label className={LABEL}>Eyebrow (linha mono pequena)</label>
              <input value={data.bussola?.eyebrow ?? ''} onChange={(e) => updateBlock('bussola', 'eyebrow', e.target.value)} className={INPUT} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Título — prefixo</label>
                <input value={data.bussola?.title ?? ''} onChange={(e) => updateBlock('bussola', 'title', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Título — ênfase (italic dourado)</label>
                <input value={data.bussola?.emphasis ?? ''} onChange={(e) => updateBlock('bussola', 'emphasis', e.target.value)} className={INPUT} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Lead (parágrafo italic abaixo do título — opcional)</label>
              <textarea value={data.bussola?.lead ?? ''} rows={2} onChange={(e) => updateBlock('bussola', 'lead', e.target.value)} className={TEXTAREA} />
            </div>
          </div>

          <div className={CARD + ' space-y-3'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">
                Portas ({(data.bussola?.portals || []).length})
              </h3>
              <button onClick={addBussolaPortal} className={BTN_SECONDARY}>+ Adicionar porta</button>
            </div>
            <p className="text-[11px] text-[#6E6458] font-sans italic">
              Cada porta vira um card clicável. <strong>visKey</strong> liga a porta a um toggle de Visibilidade — quando o módulo correspondente estiver oculto, a porta some sem precisar editar aqui.
            </p>
            {(data.bussola?.portals || []).map((p, i) => (
              <div key={i} className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <input value={p.glyph || ''} onChange={(e) => updateBussolaPortal(i, 'glyph', e.target.value)} placeholder="◈" className={INPUT + ' col-span-1 text-center text-base'} maxLength={2} />
                  <input value={p.eyebrow || ''} onChange={(e) => updateBussolaPortal(i, 'eyebrow', e.target.value)} placeholder="Eyebrow" className={INPUT + ' col-span-3 text-xs'} />
                  <input value={p.title || ''} onChange={(e) => updateBussolaPortal(i, 'title', e.target.value)} placeholder="Título" className={INPUT + ' col-span-4 text-xs'} />
                  <input value={p.cta || ''} onChange={(e) => updateBussolaPortal(i, 'cta', e.target.value)} placeholder="CTA" className={INPUT + ' col-span-3 text-xs'} />
                  <button onClick={() => removeBussolaPortal(i)} className={BTN_DANGER_INLINE + ' col-span-1 text-center'}>×</button>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <input value={p.href || ''} onChange={(e) => updateBussolaPortal(i, 'href', e.target.value)} placeholder="/destino" className={INPUT + ' col-span-5 text-xs font-mono'} />
                  <input value={p.visKey || ''} onChange={(e) => updateBussolaPortal(i, 'visKey', e.target.value)} placeholder="visKey (opcional)" className={INPUT + ' col-span-4 text-xs font-mono'} />
                  <div className="col-span-3 flex items-center gap-1 justify-end">
                    <button onClick={() => moveBussolaPortal(i, -1)} className={BTN_SECONDARY} disabled={i === 0}>↑</button>
                    <button onClick={() => moveBussolaPortal(i, 1)} className={BTN_SECONDARY} disabled={i === (data.bussola?.portals || []).length - 1}>↓</button>
                  </div>
                </div>
                <textarea value={p.body || ''} rows={2} onChange={(e) => updateBussolaPortal(i, 'body', e.target.value)} placeholder="Frase curta (1 linha) — o que essa porta entrega" className={TEXTAREA + ' text-xs'} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* PRELUDE */}
      {activeBlock === 'prelude' && (
        <div className={CARD + ' space-y-4'}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Prelúdio (entre Hero e Sobre)</h3>
            <button
              onClick={() => resetBlock('prelude')}
              className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#6E6458] hover:text-[#B48C50] transition-colors"
              title="Substitui o conteúdo desta seção pelo texto padrão."
            >
              ↺ Restaurar
            </button>
          </div>
          <div>
            <label className={LABEL}>Corpo do prelúdio</label>
            <textarea value={data.prelude.body} rows={6} onChange={(e) => updateBlock('prelude', 'body', e.target.value)} className={TEXTAREA} />
            <p className="text-[10px] text-[#6E6458] mt-1.5 font-sans italic">Use texto puro — formatação italic é aplicada automaticamente.</p>
          </div>
          <div>
            <label className={LABEL}>Tagline grega (rodapé do prelúdio)</label>
            <input value={data.prelude.tagline} onChange={(e) => updateBlock('prelude', 'tagline', e.target.value)} className={INPUT} />
          </div>
        </div>
      )}

      {/* ABOUT */}
      {activeBlock === 'about' && (
        <>
          <div className={CARD + ' space-y-4'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Sobre — texto principal</h3>
              <button
                onClick={() => resetBlock('about')}
                className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#6E6458] hover:text-[#B48C50] transition-colors"
                title="Substitui o conteúdo desta seção (texto, atuação e timeline) pelo padrão."
              >
                ↺ Restaurar
              </button>
            </div>
            <div>
              <label className={LABEL}>Título da seção</label>
              <input value={data.about.title} onChange={(e) => updateBlock('about', 'title', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>1º parágrafo (com drop cap)</label>
              <textarea value={data.about.paragraph1} rows={4} onChange={(e) => updateBlock('about', 'paragraph1', e.target.value)} className={TEXTAREA} />
            </div>
            <div>
              <label className={LABEL}>2º parágrafo</label>
              <textarea value={data.about.paragraph2} rows={4} onChange={(e) => updateBlock('about', 'paragraph2', e.target.value)} className={TEXTAREA} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={LABEL}>Citação</label>
                <textarea value={data.about.quoteText} rows={2} onChange={(e) => updateBlock('about', 'quoteText', e.target.value)} className={TEXTAREA} />
              </div>
              <div>
                <label className={LABEL}>Autor da citação</label>
                <input value={data.about.quoteAuthor} onChange={(e) => updateBlock('about', 'quoteAuthor', e.target.value)} className={INPUT} />
              </div>
            </div>
          </div>

          <div className={CARD + ' space-y-3'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Atuação ({data.about.credentials.length})</h3>
              <button onClick={addCredential} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.about.credentials.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-2">
                <input value={c.mark} onChange={(e) => updateCredential(i, 'mark', e.target.value)} className={INPUT + ' col-span-1 text-center text-base'} maxLength={2} />
                <input value={c.label} onChange={(e) => updateCredential(i, 'label', e.target.value)} placeholder="Label" className={INPUT + ' col-span-3 text-xs'} />
                <input value={c.detail} onChange={(e) => updateCredential(i, 'detail', e.target.value)} placeholder="Descrição" className={INPUT + ' col-span-7 text-xs'} />
                <button onClick={() => removeCredential(i)} className={BTN_DANGER_INLINE + ' col-span-1 text-center'}>×</button>
              </div>
            ))}
          </div>

          <div className={CARD + ' space-y-3'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">
                Imagens ({(data.about.images || []).length})
              </h3>
              <button onClick={addAboutImage} className={BTN_SECONDARY}>+ Adicionar imagem</button>
            </div>
            <p className="text-[11px] text-[#6E6458] font-sans italic">
              Renderizadas em grid 2 colunas no final da seção Sobre. Use o path relativo (ex. <code>/images/sobre/foto.jpg</code>) ou faça upload de um arquivo do computador.
            </p>
            {(data.about.images || []).map((img, i) => (
              <div key={i} className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-3 space-y-2">
                <div className="flex gap-3 items-start">
                  <div className="w-24 h-24 flex-shrink-0 bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded overflow-hidden flex items-center justify-center">
                    {img.src ? (
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-[#6E6458] font-mono">sem imagem</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <input
                      value={img.src || ''}
                      onChange={(e) => updateAboutImage(i, 'src', e.target.value)}
                      placeholder="Caminho ou data URL (/images/sobre/foto.jpg)"
                      className={INPUT + ' text-xs'}
                    />
                    <input
                      value={img.alt || ''}
                      onChange={(e) => updateAboutImage(i, 'alt', e.target.value)}
                      placeholder="Alt text (acessibilidade)"
                      className={INPUT + ' text-xs'}
                    />
                    <input
                      value={img.caption || ''}
                      onChange={(e) => updateAboutImage(i, 'caption', e.target.value)}
                      placeholder="Legenda (aparece abaixo da imagem, italic)"
                      className={INPUT + ' text-xs'}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <label className={BTN_SECONDARY + ' cursor-pointer'}>
                    upload…
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(i, e.target.files?.[0])}
                    />
                  </label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveAboutImage(i, -1)} className={BTN_SECONDARY} disabled={i === 0}>↑</button>
                    <button onClick={() => moveAboutImage(i, 1)} className={BTN_SECONDARY} disabled={i === (data.about.images || []).length - 1}>↓</button>
                    <button onClick={() => removeAboutImage(i)} className={BTN_DANGER_INLINE + ' px-2'}>remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={CARD + ' space-y-3'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Caminho (timeline) ({data.about.milestones.length})</h3>
              <button onClick={addMilestone} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.about.milestones.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-2">
                <input value={m.year} onChange={(e) => updateMilestone(i, 'year', e.target.value)} placeholder="Ano/sigla" className={INPUT + ' col-span-2 text-xs font-mono'} />
                <input value={m.label} onChange={(e) => updateMilestone(i, 'label', e.target.value)} placeholder="Label" className={INPUT + ' col-span-3 text-xs'} />
                <input value={m.detail} onChange={(e) => updateMilestone(i, 'detail', e.target.value)} placeholder="Detalhe" className={INPUT + ' col-span-6 text-xs'} />
                <button onClick={() => removeMilestone(i)} className={BTN_DANGER_INLINE + ' col-span-1 text-center'}>×</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CONTACT */}
      {activeBlock === 'contact' && (
        <div className={CARD + ' space-y-4'}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">
              Contato (seção final da home)
            </h3>
            <button
              onClick={() => resetBlock('contact')}
              className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#6E6458] hover:text-[#B48C50] transition-colors"
              title="Substitui o conteúdo desta seção pelo texto padrão."
            >
              ↺ Restaurar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Label da seção</label>
              <input
                value={data.contact?.sectionLabel ?? ''}
                onChange={(e) => updateBlock('contact', 'sectionLabel', e.target.value)}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Número WhatsApp (só dígitos)</label>
              <input
                value={data.contact?.whatsappNumber ?? ''}
                onChange={(e) => updateBlock('contact', 'whatsappNumber', e.target.value.replace(/\D/g, ''))}
                className={INPUT}
                placeholder="5581987349114"
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Título (italic)</label>
            <input
              value={data.contact?.title ?? ''}
              onChange={(e) => updateBlock('contact', 'title', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Subtítulo (lead)</label>
            <textarea
              value={data.contact?.lead ?? ''}
              rows={3}
              onChange={(e) => updateBlock('contact', 'lead', e.target.value)}
              className={TEXTAREA}
            />
          </div>

          <div className="border-t border-[rgba(180,140,80,0.1)] pt-3">
            <h4 className="text-xs uppercase tracking-widest text-[#6E6458] font-sans mb-3">Card principal (WhatsApp)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Label (caps acima do título)</label>
                <input
                  value={data.contact?.primaryLabel ?? ''}
                  onChange={(e) => updateBlock('contact', 'primaryLabel', e.target.value)}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Texto do botão</label>
                <input
                  value={data.contact?.primaryButton ?? ''}
                  onChange={(e) => updateBlock('contact', 'primaryButton', e.target.value)}
                  className={INPUT}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mt-3">
              <div>
                <label className={LABEL}>Título — prefixo regular</label>
                <input
                  value={data.contact?.primaryHeadingPrefix ?? ''}
                  onChange={(e) => updateBlock('contact', 'primaryHeadingPrefix', e.target.value)}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Título — ênfase (italic)</label>
                <input
                  value={data.contact?.primaryHeadingEmphasis ?? ''}
                  onChange={(e) => updateBlock('contact', 'primaryHeadingEmphasis', e.target.value)}
                  className={INPUT}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className={LABEL}>Parágrafo do card</label>
              <textarea
                value={data.contact?.primaryText ?? ''}
                rows={3}
                onChange={(e) => updateBlock('contact', 'primaryText', e.target.value)}
                className={TEXTAREA}
              />
            </div>
          </div>

          <div className="border-t border-[rgba(180,140,80,0.1)] pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">Instagram</h4>
              <input
                value={data.contact?.instagramLabel ?? ''}
                onChange={(e) => updateBlock('contact', 'instagramLabel', e.target.value)}
                className={INPUT}
                placeholder="Label (Instagram)"
              />
              <input
                value={data.contact?.instagramValue ?? ''}
                onChange={(e) => updateBlock('contact', 'instagramValue', e.target.value)}
                className={INPUT}
                placeholder="@usuario"
              />
              <input
                value={data.contact?.instagramUrl ?? ''}
                onChange={(e) => updateBlock('contact', 'instagramUrl', e.target.value)}
                className={INPUT}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-[#6E6458] font-sans">E-mail</h4>
              <input
                value={data.contact?.emailLabel ?? ''}
                onChange={(e) => updateBlock('contact', 'emailLabel', e.target.value)}
                className={INPUT}
                placeholder="Label (E-mail)"
              />
              <input
                value={data.contact?.emailValue ?? ''}
                onChange={(e) => updateBlock('contact', 'emailValue', e.target.value)}
                className={INPUT}
                placeholder="contato@..."
              />
              <p className="text-[10px] text-[#6E6458] font-sans italic mt-1">Deixe vazio pra esconder o card.</p>
            </div>
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
