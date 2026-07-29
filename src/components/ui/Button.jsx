'use client';

import Link from 'next/link';

/**
 * Button — único desenho de botão do site.
 *
 * Escolhe a tag sozinho: `href` interno vira <Link>, href externo (http, mailto,
 * tel, wa.me) vira <a target="_blank">, e sem href vira <button>. Isso evita o
 * padrão antigo de repetir a mesma pilha de classes Tailwind em cada CTA.
 *
 *   <Button href="/blog" variant="solid" icon={<Arrow />}>Ler ensaios</Button>
 */

const VARIANTS = {
  solid: 'btn btn--solid',
  outline: 'btn',
  wine: 'btn btn--wine',
  ghost: 'btn btn--ghost',
};

const SIZES = {
  sm: 'btn--sm',
  md: '',
  lg: 'btn--lg',
};

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

const isExternal = (href) =>
  typeof href === 'string' &&
  /^(https?:|mailto:|tel:)/.test(href);

export default function Button({
  href,
  variant = 'outline',
  size = 'md',
  icon,
  iconLeft,
  block = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [VARIANTS[variant] || VARIANTS.outline, SIZES[size], block ? 'btn--block' : '', className]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {iconLeft}
      <span>{children}</span>
      {icon}
    </>
  );

  if (href && isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {inner}
      </a>
    );
  }

  if (href) {
    // Âncoras na mesma página (#contato) não passam pelo router
    if (href.startsWith('#')) {
      return (
        <a href={href} className={classes} {...rest}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  );
}
