/**
 * HomeDisclaimer — faixa discreta logo abaixo do hero, informando o status
 * de estagiário clínico e a supervisão. Compliance com CFP / CRP:
 * o profissional em estágio não pode se anunciar como "psicólogo" — precisa
 * deixar visível que é estágio supervisionado.
 *
 * Server component, sem 'use client'.
 */
export default function HomeDisclaimer() {
  return (
    <section
      aria-label="Status profissional"
      className="relative py-5 md:py-7 px-5 sm:px-6 md:px-12 border-y border-border-subtle/40 bg-bg-card/20"
    >
      <div className="max-w-[1180px] mx-auto flex items-start gap-4 text-[0.82rem] md:text-[0.88rem] leading-relaxed text-text-dim">
        <span
          aria-hidden
          className="flex-shrink-0 mt-1 block w-1.5 h-1.5 rounded-full bg-accent/70"
        />
        <p className="font-serif">
          Atendo como <strong className="text-text font-normal">estagiário de psicologia</strong>,
          em estágio clínico supervisionado pela{' '}
          <strong className="text-text font-normal">Associação Allos</strong>. Ao
          concluir a graduação e obter registro no CRP, esta indicação será
          atualizada.
        </p>
      </div>
    </section>
  );
}
