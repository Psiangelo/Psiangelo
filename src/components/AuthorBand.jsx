'use client';

import { motion } from 'framer-motion';
import AmbientVideo from '@/components/ui/AmbientVideo';
import Button, { ArrowIcon, WhatsAppIcon } from '@/components/ui/Button';
import { resolveImageSrc } from '@/lib/basepath';
import { useSitedata } from '@/lib/useSitedata';
import {
  getTherapy,
  getSettings,
  DEFAULT_THERAPY,
  DEFAULT_SETTINGS,
  SITEDATA_KEYS,
} from '@/lib/sitedata';

/**
 * AuthorBand — a pessoa por trás do conteúdo, e a ponte para a clínica.
 *
 * Fecha uma listagem: quem acabou de percorrer os ensaios ou as trilhas
 * descobre quem está do outro lado, e tem para onde ir. A conversão clínica
 * canônica continua morando em /psicoterapia-analitica/ (anti-canibalização de
 * SEO), aqui é só a costura.
 *
 * A foto, o nome e a credencial vêm da landing clínica, então não existe um
 * segundo lugar para manter atualizado. O que muda por página é o rótulo e o
 * texto: no blog é quem escreve, em estudos é quem organiza.
 */
export default function AuthorBand({
  id = 'quem-escreve',
  eyebrow = 'Quem escreve',
  body,
  secondary = { href: '/psicoterapia-analitica', label: 'Como atendo' },
  video = '/video/materiais.mp4',
  poster = '/video/materiais.jpg',
}) {
  const therapy = useSitedata(getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS.therapy);
  const settings = useSitedata(getSettings, DEFAULT_SETTINGS, SITEDATA_KEYS.settings);

  const photo = therapy?.hero?.photo || DEFAULT_THERAPY.hero.photo;
  const text = body || photo?.bio;

  const whatsappNumber = (settings.whatsappNumber || '').replace(/\D/g, '');
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        settings.whatsappMessage ||
          'Oi Gabriel, vim pelo seu site e gostaria de marcar uma primeira conversa online.',
      )}`
    : '/psicoterapia-analitica';

  return (
    <section
      id={id}
      className="relative overflow-hidden py-20 md:py-28 px-5 sm:px-6 md:px-12 section-border-t section-border-b"
    >
      <AmbientVideo src={video} poster={poster} opacity={0.42} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(95% 130% at 50% 50%, rgba(14,12,10,0.58) 0%, rgba(14,12,10,0.97) 80%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[980px] mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14"
      >
        {/* Retrato circular com anel dourado */}
        {photo?.src && (
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border border-accent/30">
              <img
                src={resolveImageSrc(photo.src)}
                alt={photo.alt || 'Ângelo'}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <span
              aria-hidden
              className="absolute -inset-3 rounded-full border border-accent/15 pointer-events-none"
            />
          </div>
        )}

        <div className="text-center md:text-left">
          <p className="meta-caps-accent mb-4">{eyebrow}</p>

          <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] text-text-bright leading-[1.2] mb-4">
            {photo?.name || 'Ângelo'}
            {photo?.credential && (
              <span className="block mt-2 font-sans text-[0.72rem] font-medium tracking-[0.2em] uppercase text-text-dim">
                {photo.credential}
              </span>
            )}
          </h2>

          {text && (
            <p className="text-[0.98rem] text-text leading-[1.9] mb-8 max-w-[58ch] mx-auto md:mx-0">
              {text}
            </p>
          )}

          <div className="btn-row justify-center md:justify-start">
            <Button href={whatsappUrl} variant="solid" iconLeft={<WhatsAppIcon />}>
              Marcar conversa
            </Button>
            {secondary?.href && (
              <Button href={secondary.href} variant="outline" icon={<ArrowIcon />}>
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
