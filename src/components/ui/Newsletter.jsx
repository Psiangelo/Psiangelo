'use client';

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/constants';
import { subscribeToNewsletter } from '@/lib/supabase-newsletter';

/**
 * Texto do consentimento, guardado junto com o e-mail no banco.
 *
 * LGPD: consentimento tem que ser livre, informado e específico, e você tem
 * que conseguir PROVAR depois a que a pessoa consentiu. Por isso o texto vai
 * para o banco junto com a data — se ele mudar, quem assinou antes continua
 * com o registro do que aceitou de fato.
 *
 * Ao alterar este texto, suba a versão.
 */
export const CONSENT_VERSION = 1;
export const CONSENT_TEXT =
  'Aceito receber por e-mail os avisos de publicação do Psiangelo (ensaios, verbetes e trilhas) e declaro ter lido a Política de Privacidade. Sei que posso cancelar quando quiser.';

/**
 * Newsletter — captura de e-mail.
 *
 * Insere em `newsletter_subscribers` via Supabase (setup/newsletter.sql).
 * E-mail duplicado é tratado como sucesso (a pessoa já está na lista) —
 * nunca expõe erro cru do banco. Sem Supabase configurado ou sem a tabela
 * criada, falha em silêncio: o visitante só vê "algo deu errado", sem
 * poluir o console.
 *
 * `source` prop identifica onde o formulário foi preenchido (home, post de
 * blog etc.) — útil pra saber depois o que converteu mais.
 *
 * Vive em components/ui/ (não components/home/) porque é usado tanto na
 * home quanto ao fim de cada ensaio (BlogPostView.jsx).
 */
export default function Newsletter({
  source = 'home',
  eyebrow = 'Acompanhar por e-mail',
  title = 'Um aviso por',
  emphasis = 'e-mail, quando publico.',
  lead = 'Sem newsletter semanal, sem funil. Um e-mail quando sai um ensaio novo, um verbete novo no glossário ou uma trilha nova.',
  buttonLabel = 'Quero receber',
  buttonLoadingLabel = 'Enviando…',
  successMessage = 'Inscrição feita. Obrigado por acompanhar.',
  alreadySubscribedMessage = 'Você já está na lista. Obrigado.',
  errorMessage = 'Não deu para confirmar agora. Tenta de novo em instantes.',
  consentLabel = 'Aceito receber os avisos de publicação por e-mail e li a',
  consentRequiredMessage = 'Marque a caixa de consentimento para continuar.',
}) {
  const inputId = useId();
  const consentId = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;

    // Consentimento é pré-requisito, não detalhe: sem marcar, não envia.
    // Marcar por padrão seria consentimento não-livre, o que a LGPD não aceita.
    if (!consent) {
      setStatus('error');
      setMessage(consentRequiredMessage);
      return;
    }

    setStatus('loading');
    setMessage('');

    const result = await subscribeToNewsletter(email, source, {
      text: CONSENT_TEXT,
      version: CONSENT_VERSION,
    });

    if (result.ok) {
      setStatus('success');
      setMessage(result.alreadySubscribed ? alreadySubscribedMessage : successMessage);
      setEmail('');
    } else {
      setStatus('error');
      setMessage(errorMessage);
    }
  }

  return (
    <section
      id="assinar"
      aria-labelledby="newsletter-title"
      className="relative py-16 md:py-24 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <motion.div
        initial="visible"
        animate="visible"
        variants={stagger}
        className="relative max-w-[640px] mx-auto text-center"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            {eyebrow}
          </p>
          <span className="block w-10 h-px bg-accent/50" />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          id="newsletter-title"
          className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] text-text-bright leading-[1.15] mb-4 tracking-[-0.01em]"
        >
          {title} <em className="italic text-accent">{emphasis}</em>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="font-serif italic text-text-dim text-[1rem] leading-relaxed max-w-md mx-auto mb-9"
        >
          {lead}
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-md mx-auto"
          noValidate
        >
          <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor={inputId} className="sr-only">
            Seu e-mail
          </label>
          <input
            id={inputId}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 bg-bg-card border border-border-subtle focus:border-accent/60 text-text-bright text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-text-dim/50 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-bg bg-accent px-6 py-3 hover:bg-text-bright transition-colors disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
          >
            {status === 'loading' ? buttonLoadingLabel : buttonLabel}
          </button>
          </div>

          <label
            htmlFor={consentId}
            className="flex items-start gap-2.5 text-left cursor-pointer"
          >
            <input
              id={consentId}
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={status === 'loading'}
              className="mt-[0.2rem] w-4 h-4 shrink-0 accent-accent cursor-pointer"
            />
            <span className="font-sans text-[0.76rem] leading-relaxed text-text-dim">
              {consentLabel}{' '}
              <Link
                href="/privacidade"
                className="text-accent underline underline-offset-2 hover:text-text-bright transition-colors"
              >
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
        </motion.form>

        <p aria-live="polite" className="mt-4 min-h-[1.25em] text-[0.85rem]">
          {status === 'success' && (
            <span className="text-accent">{message}</span>
          )}
          {status === 'error' && (
            <span className="text-text-dim">{message}</span>
          )}
        </p>

        {/* O que a pessoa está aceitando, em texto claro e antes do envio.
            É a diferença entre consentimento informado e caixinha marcada. */}
        <motion.p
          variants={fadeUp}
          className="mt-6 font-sans text-[0.72rem] leading-relaxed text-text-dim/70 max-w-md mx-auto"
        >
          Só aviso de publicação. Sem propaganda, sem parceiro comercial, sem repasse do seu
          e-mail para ninguém. Frequência baixa: no máximo um por semana, e às vezes nenhum.
          Para sair, é responder qualquer e-mail pedindo, ou usar o link de descadastro.
        </motion.p>
      </motion.div>
    </section>
  );
}
