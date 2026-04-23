'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  publishSnapshot,
  fetchLatestSnapshot,
  isSiteSupabaseConfigured,
  isSiteSupabaseWriteConfigured,
} from '@/lib/supabase-site';
import { markPublished } from '@/lib/unpublishedChanges';

/**
 * PublishManager — publica o conteúdo do admin no site público.
 *
 * Modo Supabase (recomendado, 1 clique): envia o snapshot pra tabela
 * site_content. Visitantes pegam ao carregar o site — sem commit/push.
 *
 * Modo manual (fallback): copia/baixa JSON pra substituir
 * src/data/site-content.json, commitar e pushar. Usado quando Supabase
 * não está configurado ou está offline.
 */

const EXCLUDED_KEYS = new Set([
  'angelo_admin_auth',
  'angelo_admin_password',
  'angelo_admin_activity_log',
  'angelo_admin_content_version',
  // Metadados locais do banner "mudanças não publicadas" — se forem pro
  // snapshot, o ContentBootstrap sobrescreve o hash local com um valor
  // antigo e o banner aparece mesmo sem edições.
  'angelo_admin_last_published_hash',
  'angelo_admin_last_published_at',
]);
const ADMIN_KEY_PREFIX = 'angelo_admin_';

function collectAdminKeys() {
  if (typeof window === 'undefined') return {};
  const out = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!key.startsWith(ADMIN_KEY_PREFIX)) continue;
    if (EXCLUDED_KEYS.has(key)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) continue;
      out[key] = JSON.parse(raw);
    } catch {
      /* valor não é JSON — pula */
    }
  }
  return out;
}

function buildSnapshot() {
  const data = collectAdminKeys();
  return {
    version: Date.now(),
    publishedAt: new Date().toISOString(),
    note: "Snapshot publicado do painel admin.",
    data,
  };
}

function formatTimeAgo(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}

export default function PublishManager({ addToast, addLogEntry }) {
  const [snapshot, setSnapshot] = useState(null);
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [remote, setRemote] = useState(null);
  const [remoteLoading, setRemoteLoading] = useState(true);

  const refresh = () => setSnapshot(buildSnapshot());

  const loadRemote = async () => {
    if (!isSiteSupabaseConfigured) {
      setRemoteLoading(false);
      return;
    }
    setRemoteLoading(true);
    try {
      const latest = await fetchLatestSnapshot();
      setRemote(latest);
    } catch {
      setRemote(null);
    } finally {
      setRemoteLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    loadRemote();
    const onStorage = (e) => {
      if (e.key && e.key.startsWith(ADMIN_KEY_PREFIX)) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const json = useMemo(() => snapshot ? JSON.stringify(snapshot, null, 2) : '', [snapshot]);
  const keyCount = snapshot ? Object.keys(snapshot.data).length : 0;
  const sizeKb = json ? (new Blob([json]).size / 1024).toFixed(1) : '0';

  const handlePublishSupabase = async () => {
    if (!snapshot) return;
    if (!isSiteSupabaseWriteConfigured) {
      addToast?.('Falta NEXT_PUBLIC_SUPABASE_SERVICE_KEY no .env.local', 'error');
      return;
    }
    setPublishing(true);
    const result = await publishSnapshot({ data: snapshot.data, note: snapshot.note });
    setPublishing(false);
    if (result.ok) {
      markPublished();
      addToast?.('Publicado no Supabase — visitantes já veem as mudanças', 'success');
      addLogEntry?.('Publicado (Supabase)', `versão ${result.version}, ${keyCount} chaves`);
      loadRemote();
    } else {
      addToast?.(`Falha ao publicar: ${result.error}`, 'error');
    }
  };

  const handleCopy = async () => {
    if (!json) return;
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast?.('JSON copiado', 'success');
      addLogEntry?.('Snapshot copiado', `${keyCount} chaves`);
    } catch {
      addToast?.('Falha ao copiar — use o botão Baixar', 'error');
    }
  };

  const handleDownload = () => {
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-content.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast?.('site-content.json baixado', 'success');
  };

  const supabaseStatus = !isSiteSupabaseConfigured
    ? { label: 'Não configurado', tone: 'warn' }
    : !isSiteSupabaseWriteConfigured
      ? { label: 'Leitura apenas (sem service key)', tone: 'warn' }
      : { label: 'Pronto', tone: 'ok' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="text-xl font-serif text-[#E8DDD0] mb-2">Publicar no site</h2>
        <p className="text-sm text-[#B8AD9E] font-sans leading-relaxed max-w-2xl">
          O painel salva as edições neste navegador. <strong className="text-[#E8DDD0]">Publicar</strong>{' '}
          envia um snapshot pro Supabase — visitantes veem as mudanças ao recarregar, sem commit/push.
        </p>
      </div>

      {/* Status Supabase */}
      <div className={`mb-6 rounded-xl border p-4 ${
        supabaseStatus.tone === 'ok'
          ? 'bg-green-900/10 border-green-900/30'
          : 'bg-yellow-900/10 border-yellow-900/30'
      }`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#6E6458] font-sans mb-1">Supabase</p>
            <p className={`text-sm font-sans ${
              supabaseStatus.tone === 'ok' ? 'text-green-200/90' : 'text-yellow-200/90'
            }`}>
              {supabaseStatus.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">Última publicação</p>
            <p className="text-sm text-[#E8DDD0] font-sans">
              {remoteLoading
                ? '…'
                : remote
                  ? formatTimeAgo(remote.published_at)
                  : 'nenhuma ainda'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">Chaves</p>
          <p className="text-2xl font-serif text-[#E8DDD0]">{keyCount}</p>
        </div>
        <div className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">Tamanho</p>
          <p className="text-2xl font-serif text-[#E8DDD0]">{sizeKb} <span className="text-xs text-[#6E6458]">KB</span></p>
        </div>
        <div className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">Versão atual</p>
          <p className="text-[0.7rem] font-mono text-[#B48C50] break-all leading-tight">
            {snapshot?.version ?? '—'}
          </p>
        </div>
      </div>

      {/* Ação primária: publicar no Supabase */}
      <button
        onClick={handlePublishSupabase}
        disabled={publishing || !isSiteSupabaseWriteConfigured || keyCount === 0}
        className="w-full bg-[#B48C50] hover:bg-[#C8A068] disabled:bg-[#1A1714] disabled:text-[#6E6458] disabled:cursor-not-allowed text-[#0E0C0A] font-sans font-semibold text-sm tracking-wide px-5 py-4 rounded-xl transition-colors mb-3"
      >
        {publishing ? 'Publicando…' : 'Publicar agora (Supabase)'}
      </button>

      {/* Ações secundárias: fallback manual */}
      <details className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl overflow-hidden mb-6">
        <summary className="cursor-pointer px-5 py-3 text-sm text-[#B8AD9E] font-sans hover:bg-[#221E1A] transition-colors select-none">
          Publicação manual (commit no repo) — fallback
        </summary>
        <div className="px-5 py-4 border-t border-[rgba(180,140,80,0.08)] space-y-3">
          <p className="text-xs text-[#6E6458] font-sans leading-relaxed">
            Use se o Supabase estiver fora: cola o JSON em{' '}
            <code className="text-[#B48C50] bg-[#0E0C0A] px-1 py-0.5 rounded">src/data/site-content.json</code>,
            commita e pusha. Deploy automático atualiza o site em ~1 min.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 min-w-[160px] bg-[#0E0C0A] hover:bg-[#1A1714] border border-[rgba(180,140,80,0.2)] text-[#E8DDD0] font-sans text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              {copied ? 'Copiado!' : 'Copiar JSON'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 min-w-[160px] bg-[#0E0C0A] hover:bg-[#1A1714] border border-[rgba(180,140,80,0.2)] text-[#E8DDD0] font-sans text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              Baixar site-content.json
            </button>
            <button
              onClick={refresh}
              className="bg-[#0E0C0A] hover:bg-[#1A1714] border border-[rgba(180,140,80,0.1)] text-[#6E6458] font-sans text-xs px-3 py-2.5 rounded-lg transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>
      </details>

      {/* Setup inicial */}
      {!isSiteSupabaseWriteConfigured && (
        <details className="bg-[#1A1714] border border-yellow-900/30 rounded-xl overflow-hidden mb-6">
          <summary className="cursor-pointer px-5 py-3 text-sm text-yellow-200/80 font-sans hover:bg-[#221E1A] transition-colors select-none">
            Como configurar o Supabase (primeira vez)
          </summary>
          <div className="px-5 py-4 border-t border-yellow-900/20 text-sm text-[#B8AD9E] font-sans leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                No Supabase (pode usar um projeto existente), rode o SQL em{' '}
                <code className="text-[#B48C50] text-xs bg-[#0E0C0A] px-1.5 py-0.5 rounded">
                  setup/site-content-schema.sql
                </code>.
              </li>
              <li>
                Crie/edite{' '}
                <code className="text-[#B48C50] text-xs bg-[#0E0C0A] px-1.5 py-0.5 rounded">.env.local</code>{' '}
                na raiz com:
              </li>
            </ol>
            <pre className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-3 text-[11px] font-mono text-[#B8AD9E] overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=eyJ...`}
            </pre>
            <p className="text-xs text-[#6E6458]">
              Depois rode <code className="text-[#B48C50] bg-[#0E0C0A] px-1 py-0.5 rounded">npm run build</code>{' '}
              e commite o novo deploy. (O{' '}
              <code className="text-[#B48C50] bg-[#0E0C0A] px-1 py-0.5 rounded">.env.local</code> não vai pro git, mas as vars
              precisam estar disponíveis no build que o GitHub Actions roda — adicione como secrets no repo.)
            </p>
          </div>
        </details>
      )}

      {/* Preview JSON */}
      <details className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl overflow-hidden">
        <summary className="cursor-pointer px-5 py-3 text-sm text-[#B8AD9E] font-sans hover:bg-[#221E1A] transition-colors select-none">
          Visualizar snapshot atual ({keyCount} chaves)
        </summary>
        <pre className="px-5 py-4 text-[11px] text-[#B8AD9E] font-mono overflow-auto max-h-96 border-t border-[rgba(180,140,80,0.08)] bg-[#0E0C0A]">
          {json || '// snapshot ainda não foi gerado'}
        </pre>
      </details>

      {keyCount === 0 && (
        <div className="mt-4 bg-yellow-900/10 border border-yellow-900/30 rounded-xl p-4">
          <p className="text-sm text-yellow-200/80 font-sans">
            Nenhuma chave gerenciada encontrada no localStorage. Edite algo no admin primeiro.
          </p>
        </div>
      )}
    </motion.div>
  );
}
