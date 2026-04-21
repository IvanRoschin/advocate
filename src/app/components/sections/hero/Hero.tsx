'use client';

import { getRouteUrl } from '@/app/config/routes';
import { SlideResponseDTO } from '@/app/types';
import { Btn } from '@/components';
import { HeroCarousel } from '@/components/sections/hero/HeroCarousel';
import { heroSection, person, social } from '@/resources';

type HeroProps = {
  slides: SlideResponseDTO[];
};

const Hero = ({ slides }: HeroProps) => {
  const phoneLink =
    social.find(item => item.icon === 'phone' && item.essential && item.link)
      ?.link ?? null;

  return (
    <section className="relative flex h-screen w-full items-center overflow-hidden md:min-h-100">
      <HeroCarousel items={slides} className="z-0" showBars showArrows />
      <div className="bg-hero-overlay pointer-events-none absolute inset-0 z-10" />
      <div className="font-eukrainehead text-hero relative z-30 container px-4">
        <p className="text-hero-uptitle mb-6 text-xs tracking-widest uppercase md:text-sm">
          {heroSection.header.uptitle}
        </p>

        <div className="relative mb-6 after:block after:h-px after:w-40 after:bg-white after:content-['']" />

        <h1 className="text-hero-title mb-4 text-3xl leading-tight font-bold md:text-5xl">
          {heroSection.header.title}
          <br />
          <span className="group text-accent relative mt-2 inline-block text-2xl font-bold md:text-4xl">
            {person.name}
            <span className="bg-accent absolute -bottom-1 left-0 h-0.75 w-0 transition-all duration-500 group-hover:w-full" />
          </span>
        </h1>

        <p className="text-hero-subtitle mt-6 mb-8 max-w-xl text-base md:text-lg">
          {heroSection.subtitle}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Btn
            label={heroSection.cta.primary.label}
            href={getRouteUrl(heroSection.cta.primary.route)}
          />

          {phoneLink && (
            <Btn
              label={heroSection.cta.secondary.label}
              href={phoneLink}
              uiVariant={heroSection.cta.secondary.uiVariant}
            />
          )}
        </div>

        <p className="text-hero-note mt-6 text-xs">{heroSection.note}</p>
      </div>
    </section>
  );
};

export default Hero;
