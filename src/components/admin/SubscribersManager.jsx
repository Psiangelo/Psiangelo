'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchSubscribers, deleteSubscriber } from '@/lib/supabase-newsletter';

/**
 * SubscribersManager — lista os inscritos na newsletter e permite exportar.
 *
 * A leitura exige ADMIN LOGADO: a policy de SELECT em newsletter_subscribers é
 * só para `authenticated` (setup/newsletter.sql). A chave pública do site
 * insere mas não lê, de propósito — ela vai no bundle, e com leitura liberada
 * qualquer pessoa baixaria a lista inteira de e-mails.
 *
 * O botão de remover existe porque a LGPD dá ao titular o direito de
 * eliminação: alguém precisa poder executar o pedido de saída.
 */

const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-xl p-5';
const BTN =
  'font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function SubscribersManager({ addToast }) {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState('loading'); // loading | ready | error | unauth
  const [errorMsg, setErrorMsg] = useState('');

  const load = useCallback(async () => {
    setState('loading');
    const result = await fetchSubscribers();
    if (result.ok) {
      setRows(result.rows);
      setState('ready');
      return;
    }
    setErrorMsg(result.error || '');
    setState(result.error === 'unauthenticated' ? 'unauth' : 'error');
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = () => {
    // ; como separador e BOM: é o que o Excel em português abre sem
    // transformar tudo numa coluna só e sem quebrar acento.
    const head = ['email', 'origem', 'inscrito_em', 'consentimento_em', 'texto_consentimento'];
    const lines = rows.map((r) =>
      [
        r.email,
        r.source || '',
        r.created_at || '',
        r.consent_at || '',
        `"${String(r.consent_text || '').replace(/"/g, '""')}"`,
      ].join(';'),
    );
    const csv = '﻿' + [head.join(';'), ...lines].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscritos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast?.(`${rows.length} inscrito(s) exportado(s)`, 'success');
  };

  const remove = async (row) => {
    if (!window.confirm(`Remover ${row.email} da lista? A LGPD exige atender esse pedido, e a ação não tem volta.`)) return;
    const result = await deleteSubscriber(row.id);
    if (result.ok) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      addToast?.('Removido da lista', 'success');
    } else {
      addToast?.('Não deu para remover agora', 'error');
    }
  };

  if (state === 'loading') {
    return <div className={CARD}><p className="text-sm text-[#B8AD9E] font-sans">Carregando inscritos…</p></div>;
  }

  if (state === 'unauth') {
    return (
      <div className={CARD}>
        <p className="text-sm text-yellow-200/80 font-sans mb-2">Sessão não autenticada</p>
        <p className="text-sm text-[#B8AD9E] font-sans leading-relaxed">
          A lista de inscritos só é legível com login de verdade. Faça login no painel e recarregue.
        </p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={CARD}>
        <p className="text-sm text-yellow-200/80 font-sans mb-2">Não deu para ler a lista</p>
        <p className="text-sm text-[#B8AD9E] font-sans leading-relaxed mb-3">
          Se a tabela ainda não existe, ou se as políticas de acesso não foram criadas, rode{' '}
          <code className="text-[#B48C50] text-xs bg-[#0E0C0A] px-1.5 py-0.5 rounded">setup/newsletter.sql</code>{' '}
          no SQL Editor do Supabase e recarregue.
        </p>
        {errorMsg && <p className="text-xs text-[#6E6458] font-mono">{errorMsg}</p>}
        <button type="button" onClick={load} className={`${BTN} bg-[#B48C50] text-[#0E0C0A] hover:bg-[#E8DDD0] mt-4`}>
          Tentar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={CARD}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif text-[1.6rem] text-[#E8DDD0] leading-none">{rows.length}</p>
            <p className="text-xs text-[#6E6458] font-sans uppercase tracking-widest mt-1">
              {rows.length === 1 ? 'inscrito' : 'inscritos'}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={load} className={`${BTN} bg-[#221E1A] text-[#B8AD9E] hover:bg-[#2A2521]`}>
              Atualizar
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={rows.length === 0}
              className={`${BTN} bg-[#B48C50] text-[#0E0C0A] hover:bg-[#E8DDD0]`}
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={CARD}>
          <p className="text-sm text-[#B8AD9E] font-sans">
            Ninguém inscrito ainda. O formulário fica na home e ao fim de cada ensaio.
          </p>
        </div>
      ) : (
        <div className={`${CARD} p-0 overflow-hidden`}>
          {/* Tabela no desktop */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-[rgba(180,140,80,0.15)]">
                <th className="text-left px-5 py-3 text-[0.68rem] uppercase tracking-widest text-[#6E6458] font-sans">E-mail</th>
                <th className="text-left px-5 py-3 text-[0.68rem] uppercase tracking-widest text-[#6E6458] font-sans">Origem</th>
                <th className="text-left px-5 py-3 text-[0.68rem] uppercase tracking-widest text-[#6E6458] font-sans">Inscrito em</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[rgba(180,140,80,0.07)] last:border-0">
                  <td className="px-5 py-3 text-sm text-[#E8DDD0] font-sans break-all">{r.email}</td>
                  <td className="px-5 py-3 text-sm text-[#B8AD9E] font-sans">{r.source || '—'}</td>
                  <td className="px-5 py-3 text-sm text-[#B8AD9E] font-mono text-xs">{formatDate(r.created_at)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      className="text-xs text-[#6E6458] hover:text-red-300 font-sans transition-colors"
                    >
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards no mobile */}
          <ul className="md:hidden divide-y divide-[rgba(180,140,80,0.07)]">
            {rows.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <p className="text-sm text-[#E8DDD0] font-sans break-all mb-1">{r.email}</p>
                <p className="text-xs text-[#6E6458] font-mono mb-2">
                  {formatDate(r.created_at)} · {r.source || '—'}
                </p>
                <button
                  type="button"
                  onClick={() => remove(r)}
                  className="text-xs text-[#6E6458] hover:text-red-300 font-sans transition-colors"
                >
                  remover
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={CARD}>
        <p className="text-[0.68rem] uppercase tracking-widest text-[#6E6458] font-sans mb-2">Para disparar e-mail</p>
        <p className="text-sm text-[#B8AD9E] font-sans leading-relaxed">
          Este painel mostra e exporta a lista. O envio em massa precisa de um serviço de disparo
          (o site é estático e não envia e-mail). Exporte o CSV e importe na ferramenta de envio
          que preferir. Todo e-mail enviado precisa de link de descadastro, e quem pedir para sair
          deve ser removido aqui também.
        </p>
      </div>
    </div>
  );
}
