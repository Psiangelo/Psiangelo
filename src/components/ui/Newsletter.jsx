'use client';

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/constants';
import { subscribeToNewsletter } from '@/lib/supabase-newsletter';

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
}) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setMessage('');

    const result = await subscribeToNewsletter(email, source);

    if (result.ok) {
      setStatus('success');
      setMessage(
        result.alreadySubscribed
          ? 'Você já está na lista. Obrigado.'
          : 'Inscrição feita. Obrigado por acompanhar.',
      );
      setEmail('');
    } else {
      setStatus('error');
      setMessage('Não deu para confirmar agora. Tenta de novo em instantes.');
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
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          noValidate
        >
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
            {status === 'loading' ? 'Enviando…' : 'Quero receber'}
          </button>
        </motion.form>

        <p aria-live="polite" className="mt-4 min-h-[1.25em] text-[0.85rem]">
          {status === 'success' && (
            <span className="text-accent">{message}</span>
          )}
          {status === 'error' && (
            <span className="text-text-dim">{message}</span>
          )}
        </p>
      </motion.div>
    </section>
  );
}
