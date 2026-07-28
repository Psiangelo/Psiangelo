'use client';

import PageHero from '@/components/ui/PageHero';
import TherapistCard from './TherapistCard';
import { getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';

/**
 * TherapyHeroSection — hero de /psicoterapia-analitica.
 * Lê o texto de getTherapy() (editável em Admin → Terapia → Hero) em vez de
 * hardcoded, e acopla o TherapistCard (foto + bio) ao lado via sideCard.
 */
export default function TherapyHeroSection() {
  const therapy = useSitedata(getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS.therapy);
  const hero = therapy.hero;

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      emphasis={hero.emphasis}
      lead={hero.lead}
      sideCard={<TherapistCard />}
    />
  );
}
