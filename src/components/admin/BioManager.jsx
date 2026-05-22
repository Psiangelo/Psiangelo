'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getBio, setBio, DEFAULT_BIO } from '@/lib/sitedata';
import { BIO_ICON_OPTIONS, BioCardIcon, hasBioIcon, inferBioIcon } from '@/components/bio/BioCardIcons';
import { BIO_ACCENTS } from '@/components/bio/BioAccents';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y min-h-[80px]';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4 sm:p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER_INLINE = 'text-red-400/70 hover:text-red-400 text-xs px-2 py-1';

export default function BioManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_BIO);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(getBio());
  }, []);

  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateImage = (idx, key, value) => {
    const images = [...data.images];
    images[idx] = { ...images[idx], [key]: value };
    setData({ ...data, images });
    setDirty(true);
  };

  const addImage = () => {
    const images = [...(data.images || []), { url: '', alt: '' }];
    setData({ ...data, images });
    setDirty(true);
  };

  const removeImage = (idx) => {
    const images = data.images.filter((_, i) => i !== idx);
    setData({ ...data, images });
    setDirty(true);
  };

  const moveImage = (idx, dir) => {
    const images = [...data.images];
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    [images[idx], images[target]] = [images[target], images[idx]];
    setData({ ...data, images });
    setDirty(true);
  };

  const updateLink = (idx, key, value) => {
    const links = [...data.links];
    links[idx] = { ...links[idx], [key]: value };
    setData({ ...data, links });
    setDirty(true);
  };

  const addLink = () => {
    const links = [...(data.links || []), { label: 'Novo link', href: '', image: '', icon: '', description: '' }];
    setData({ ...data, links });
    setDirty(true);
  };

  const removeLink = (idx) => {
    const links = data.links.filter((_, i) => i !== idx);
    setData({ ...data, links });
    setDirty(true);
  };

  const moveLink = (idx, dir) => {
    const links = [...data.links];
    const target = idx + dir;
    if (target < 0 || target >= links.length) return;
    [links[idx], links[target]] = [links[target], links[idx]];
    setData({ ...data, links });
    setDirty(true);
  };

  const resolveLinkImage = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/Psiangelo')) return url;
    if (url.startsWith('/')) return `/Psiangelo${url}`;
    return url;
  };

  const persist = () => {
    setBio(data);
    setDirty(false);
    addLogEntry?.('Bio/Linktree salva', `${data.images?.length || 0} imagens`);
    addToast?.('Bio salva', 'success');
  };

  const resetAll = () => {
    if (!confirm('Restaurar a Bio para o padrão? Suas edições serão perdidas.')) return;
    setData(DEFAULT_BIO);
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
          <h2 className="text-xl font-serif text-[#E8DDD0]">Bio / Linktree</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Página mobile em /bio — compartilhe como cartão de visita digital
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href="/Psiangelo/bio"
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_SECONDARY}
          >
            Abrir /bio
          </a>
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

      {/* Sticky save bar quando há mudanças */}
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

      {/* Identidade */}
      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] mb-4 text-sm uppercase tracking-widest">
          Identidade
        </h3>

        {/* Avatar */}
        <div className="mb-4">
          <label className={LABEL}>Foto de perfil (avatar)</label>
          <div className="flex items-start gap-3 flex-wrap">
            <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border border-[rgba(180,140,80,0.2)] bg-[#0E0C0A]">
              {data.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveLinkImage(data.avatar)}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6E6458] text-[10px]">
                  sem foto
                </div>
              )}
            </div>
            <div className="flex-1 min-w-[200px] space-y-2">
              <input
                type="text"
                value={data.avatar || ''}
                onChange={(e) => update('avatar', e.target.value)}
                className={INPUT}
                placeholder="/images/foto.jpg ou https://..."
              />
              <div className="flex gap-2 flex-wrap">
                <label className={BTN_SECONDARY + ' cursor-pointer'}>
                  Escolher arquivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 800 * 1024) {
                        addToast?.('Imagem muito grande (max 800KB). Use URL externa.', 'error');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => update('avatar', reader.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {data.avatar && (
                  <button
                    onClick={() => update('avatar', '')}
                    className={BTN_DANGER_INLINE}
                  >
                    remover
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#6E6458]">
                Cole uma URL ou suba um arquivo (max 800KB). Arquivos são salvos embutidos no navegador.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Nome exibido</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              className={INPUT}
              placeholder="Psiangelo"
            />
          </div>
          <div>
            <label className={LABEL}>Tagline (linha pequena abaixo do nome)</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              className={INPUT}
              placeholder="Psicologia Analítica · Jung"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={LABEL}>Bio curta (1-2 frases)</label>
          <textarea
            value={data.bio}
            onChange={(e) => update('bio', e.target.value)}
            className={TEXTAREA}
            rows={3}
            placeholder="Estudante de psicologia, estagiário clínico..."
          />
        </div>
      </div>

      {/* Galeria */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest">
              Galeria de imagens
            </h3>
            <p className="text-[11px] text-[#6E6458] mt-1">
              URLs de imagens (ex: <code className="text-[#B48C50]">/images/foto.jpg</code> ou URL completa).
              Aparece em grid 2 colunas.
            </p>
          </div>
          <button onClick={addImage} className={BTN_SECONDARY}>
            + Adicionar imagem
          </button>
        </div>

        {(!data.images || data.images.length === 0) && (
          <p className="text-xs text-[#6E6458] italic text-center py-4">
            Nenhuma imagem ainda. Clique em "Adicionar imagem" para começar.
          </p>
        )}

        <div className="space-y-3">
          {data.images?.map((image, idx) => {
            const isHidden = !!image.hidden;
            return (
              <div
                key={idx}
                className={`flex gap-3 items-start bg-[#0E0C0A] border rounded-lg p-3 transition-opacity ${
                  isHidden
                    ? 'border-[rgba(180,140,80,0.04)] opacity-50'
                    : 'border-[rgba(180,140,80,0.08)]'
                }`}
              >
                {/* Preview */}
                <div className="w-16 h-16 flex-shrink-0 bg-[#1A1714] border border-[rgba(180,140,80,0.12)] rounded overflow-hidden">
                  {image.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        image.url.startsWith('http')
                          ? image.url
                          : image.url.startsWith('/Psiangelo')
                            ? image.url
                            : image.url.startsWith('/')
                              ? `/Psiangelo${image.url}`
                              : image.url
                      }
                      alt={image.alt || ''}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6E6458] text-[10px]">
                      sem url
                    </div>
                  )}
                </div>

                {/* Campos */}
                <div className="flex-1 space-y-2 min-w-0">
                  {isHidden && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#6E6458] tracking-[0.2em] uppercase">
                      <span className="block w-1.5 h-1.5 rounded-full bg-[#6E6458]" />
                      Oculta — não aparece no /bio
                    </div>
                  )}
                  <input
                    type="text"
                    value={image.url || ''}
                    onChange={(e) => updateImage(idx, 'url', e.target.value)}
                    className={INPUT}
                    placeholder="/images/foto.jpg ou https://..."
                  />
                  <input
                    type="text"
                    value={image.alt || ''}
                    onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                    className={INPUT}
                    placeholder="Descrição (alt text)"
                  />
                </div>

                {/* Controles */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => updateImage(idx, 'hidden', !isHidden)}
                    className={
                      isHidden
                        ? 'px-3 py-1.5 border border-[rgba(180,140,80,0.4)] text-[#B48C50] text-[10px] font-sans tracking-wider uppercase rounded-lg hover:bg-[rgba(180,140,80,0.1)] transition-colors'
                        : BTN_SECONDARY
                    }
                    title={isHidden ? 'Publicar' : 'Ocultar'}
                  >
                    {isHidden ? 'publicar' : 'ocultar'}
                  </button>
                  <button
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    className={BTN_SECONDARY + (idx === 0 ? ' opacity-30 cursor-not-allowed' : '')}
                    title="Subir"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === data.images.length - 1}
                    className={
                      BTN_SECONDARY +
                      (idx === data.images.length - 1 ? ' opacity-30 cursor-not-allowed' : '')
                    }
                    title="Descer"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeImage(idx)}
                    className={BTN_DANGER_INLINE}
                    title="Remover"
                  >
                    remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botões / Cards */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest">
              Botões e cards
            </h3>
            <p className="text-[11px] text-[#6E6458] mt-1">
              <strong className="text-[#B8AD9E]">Com imagem</strong> → card com foto.
              <strong className="text-[#B8AD9E]"> Com ícone</strong> → card com SVG hermético (mandala, livro, chave…).
              <strong className="text-[#B8AD9E]"> Sem nada</strong> → botão simples.
              Descrição é opcional em todos. Imagem ganha do ícone.
            </p>
          </div>
          <button onClick={addLink} className={BTN_SECONDARY}>
            + Adicionar link
          </button>
        </div>

        {(!data.links || data.links.length === 0) && (
          <p className="text-xs text-[#6E6458] italic text-center py-4">
            Nenhum link ainda. Clique em "Adicionar link".
          </p>
        )}

        <div className="space-y-4">
          {data.links?.map((link, idx) => {
            const preview = resolveLinkImage(link.image);
            const isHidden = !!link.hidden;
            const hasIcon = !preview && hasBioIcon(link.icon);
            return (
              <div
                key={idx}
                className={`bg-[#0E0C0A] border rounded-lg p-4 space-y-3 transition-opacity ${
                  isHidden
                    ? 'border-[rgba(180,140,80,0.04)] opacity-50'
                    : 'border-[rgba(180,140,80,0.08)]'
                }`}
              >
                {isHidden && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#6E6458] tracking-[0.2em] uppercase">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#6E6458]" />
                    Oculto — não aparece no /bio
                  </div>
                )}
                <div className="flex items-start gap-3">
                  {/* Preview miniatura — imagem OU ícone hermético */}
                  <div className="w-16 h-16 flex-shrink-0 bg-[#1A1714] border border-[rgba(180,140,80,0.12)] rounded overflow-hidden flex items-center justify-center">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt={link.label || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                      />
                    ) : hasIcon ? (
                      <div className="w-12 h-12">
                        <BioCardIcon name={link.icon} />
                      </div>
                    ) : (
                      <span className="text-[#6E6458] text-[10px] text-center px-1">
                        sem<br/>imagem
                      </span>
                    )}
                  </div>

                  {/* Label + Href */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div>
                      <label className={LABEL}>Texto do botão</label>
                      <input
                        type="text"
                        value={link.label || ''}
                        onChange={(e) => updateLink(idx, 'label', e.target.value)}
                        className={INPUT}
                        placeholder="Ex: Contato comigo"
                      />
                    </div>
                    <div>
                      <label className={LABEL}>Link (href)</label>
                      <input
                        type="text"
                        value={link.href || ''}
                        onChange={(e) => updateLink(idx, 'href', e.target.value)}
                        className={INPUT}
                        placeholder="https://... ou /materiais ou wa.me/..."
                      />
                    </div>
                  </div>

                  {/* Controles */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => updateLink(idx, 'hidden', !isHidden)}
                      className={
                        isHidden
                          ? 'px-3 py-1.5 border border-[rgba(180,140,80,0.4)] text-[#B48C50] text-[10px] font-sans tracking-wider uppercase rounded-lg hover:bg-[rgba(180,140,80,0.1)] transition-colors'
                          : BTN_SECONDARY
                      }
                      title={isHidden ? 'Publicar (mostrar no /bio)' : 'Ocultar (não mostrar no /bio)'}
                    >
                      {isHidden ? 'publicar' : 'ocultar'}
                    </button>
                    <button
                      onClick={() => moveLink(idx, -1)}
                      disabled={idx === 0}
                      className={BTN_SECONDARY + (idx === 0 ? ' opacity-30 cursor-not-allowed' : '')}
                      title="Subir"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveLink(idx, 1)}
                      disabled={idx === data.links.length - 1}
                      className={BTN_SECONDARY + (idx === data.links.length - 1 ? ' opacity-30 cursor-not-allowed' : '')}
                      title="Descer"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeLink(idx)}
                      className={BTN_DANGER_INLINE}
                      title="Remover"
                    >
                      remover
                    </button>
                  </div>
                </div>

                {/* Imagem + descrição em linha */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>Imagem (URL opcional)</label>
                    <input
                      type="text"
                      value={link.image || ''}
                      onChange={(e) => updateLink(idx, 'image', e.target.value)}
                      className={INPUT}
                      placeholder="/images/foto.jpg ou https://..."
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Descrição (opcional)</label>
                    <input
                      type="text"
                      value={link.description || ''}
                      onChange={(e) => updateLink(idx, 'description', e.target.value)}
                      className={INPUT}
                      placeholder="Texto curto que aparece antes do botão"
                    />
                  </div>
                </div>

                {/* Grid visual de ícones — clique pra escolher */}
                {!link.image && (
                  <IconPicker
                    value={link.icon || ''}
                    inferred={!link.icon ? inferBioIcon(link) : null}
                    onChange={(name) => updateLink(idx, 'icon', name)}
                  />
                )}
                {link.image && (
                  <p className="text-[11px] text-[#6E6458] italic">
                    Card mostrando a <strong>imagem</strong>. Remova-a pra usar um ícone SVG.
                  </p>
                )}

                {/* Picker de cor/accent — sempre disponível, afeta o card todo */}
                <ColorPicker
                  value={link.accent || ''}
                  positionInList={idx}
                  onChange={(name) => updateLink(idx, 'accent', name)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Grid visual de ícones SVG ---------- */
function IconPicker({ value, onChange, inferred }) {
  // ignora a opção vazia (vai virar "auto" no header)
  const items = BIO_ICON_OPTIONS.filter((o) => o.value !== '');
  const selected = value || '';
  const effective = selected || inferred || '';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">
          Ícone do card
          {!selected && inferred && (
            <span className="ml-2 normal-case tracking-normal text-[#B48C50] italic">
              auto: {BIO_ICON_OPTIONS.find((o) => o.value === inferred)?.label?.toLowerCase() || inferred}
            </span>
          )}
        </label>
        {selected && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] uppercase tracking-widest text-[#6E6458] hover:text-[#B48C50] transition-colors"
            title="Voltar pra detecção automática pelo label/href"
          >
            usar automático
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 bio-icon-picker">
        {items.map((opt) => {
          const isSelected = selected === opt.value;
          const isAuto = !selected && inferred === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              title={opt.label}
              aria-label={opt.label}
              aria-pressed={isSelected}
              className={
                'group relative aspect-square rounded-lg border transition-all flex flex-col items-center justify-center p-2 pb-4 overflow-hidden ' +
                (isSelected
                  ? 'border-[#B48C50] bg-[#B48C50]/15 shadow-[0_0_0_1px_rgba(180,140,80,0.5)_inset]'
                  : isAuto
                    ? 'border-[rgba(180,140,80,0.45)] bg-[rgba(180,140,80,0.06)]'
                    : 'border-[rgba(180,140,80,0.15)] bg-[#0E0C0A] hover:border-[#B48C50] hover:bg-[rgba(180,140,80,0.08)]')
              }
            >
              <div className="picker-icon-slot pointer-events-none flex items-center justify-center" style={{ width: '60%', aspectRatio: '1 / 1' }}>
                <BioCardIcon name={opt.value} />
              </div>
              <span className="block w-full text-[8px] font-sans uppercase tracking-wider text-center text-[#8C8378] group-hover:text-[#B48C50] pointer-events-none truncate mt-1">
                {opt.label}
              </span>
              {isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4A853]" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-[#6E6458] italic">
        Clique num ícone pra fixar. Sem seleção, o /bio escolhe sozinho pelo nome do link (ex.: "Contato" → WhatsApp).
      </p>
    </div>
  );
}

/* ---------- Picker visual de cor/accent (paleta hermética) ---------- */
function ColorPicker({ value, onChange, positionInList = 0 }) {
  const selected = value || '';
  // accent inferido pelo ciclo padrão quando nada foi escolhido
  const cycleFallback = BIO_ACCENTS[positionInList % BIO_ACCENTS.length]?.value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">
          Cor do card
          {!selected && cycleFallback && (
            <span className="ml-2 normal-case tracking-normal text-[#B48C50] italic">
              auto: {BIO_ACCENTS.find((a) => a.value === cycleFallback)?.label?.toLowerCase()}
            </span>
          )}
        </label>
        {selected && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] uppercase tracking-widest text-[#6E6458] hover:text-[#B48C50] transition-colors"
            title="Voltar pro ciclo automático de cores"
          >
            usar automático
          </button>
        )}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {BIO_ACCENTS.map((acc) => {
          const isSelected = selected === acc.value;
          const isAuto = !selected && cycleFallback === acc.value;
          // preview: gradient mídia esquerda → flat direita
          const bg = `linear-gradient(90deg, ${acc.media1} 0%, ${acc.media2} 30%, ${acc.flat} 60%, ${acc.flat} 100%)`;
          return (
            <button
              key={acc.value}
              type="button"
              onClick={() => onChange(acc.value)}
              title={`${acc.label} — ${acc.description}`}
              aria-label={acc.label}
              aria-pressed={isSelected}
              className={
                'group relative aspect-[5/4] rounded-lg border transition-all overflow-hidden ' +
                (isSelected
                  ? 'border-[#D4A853] shadow-[0_0_0_2px_rgba(212,168,83,0.55)]'
                  : isAuto
                    ? 'border-[rgba(180,140,80,0.45)]'
                    : 'border-[rgba(180,140,80,0.12)] hover:border-[#B48C50]')
              }
              style={{ background: bg }}
            >
              {/* label embaixo, em barra translúcida pra dar legibilidade */}
              <span
                className="absolute bottom-0 left-0 right-0 px-1 py-0.5 text-[8px] font-sans uppercase tracking-wider text-center truncate"
                style={{
                  background: 'rgba(14, 12, 10, 0.72)',
                  color: '#E8DDD0',
                }}
              >
                {acc.label}
              </span>
              {isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4A853] shadow-[0_0_0_1px_rgba(14,12,10,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-[#6E6458] italic">
        Clique numa cor pra fixar este card. Sem seleção, o /bio alterna entre as 10 cores pra dar ritmo visual.
      </p>
    </div>
  );
}
