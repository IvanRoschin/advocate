'use client';

import { getRouteUrl } from '@/app/config/routes';
import { Btn } from '@/components';
import {
  CarouselItem,
  HeroCarousel,
} from '@/components/sections/hero/HeroCarousel';
import { heroSection, person, social } from '@/resources';

const slides: CarouselItem[] = [
  { src: '/images/bg/hero_bg.webp', alt: 'Hero background 1' },
  { src: '/images/bg/hero_bg_2.webp', alt: 'Hero background 2' },
  { src: '/images/bg/hero_bg_3.webp', alt: 'Hero background 3' },
];

const Hero = () => {
  const phoneLink =
    social.find(item => item.icon === 'phone' && item.essential && item.link)
      ?.link ?? null;

  return (
    <section className="relative flex h-screen w-full items-center overflow-hidden">
      {/* Слайдер */}
      <HeroCarousel
        items={slides}
        className="z-0"
        showBars
        showArrows
        // временно для проверки:
        debugBarsTopRight
      />

      {/* Затемнение */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/50" />
      {/* Контент */}
      <div className="relative z-30 container px-4 text-white">
        <p className="mb-6 text-xs tracking-widest text-gray-300 uppercase md:text-sm">
          {heroSection.header.uptitle}
        </p>

        <div className="after:bg-accent relative mb-6 after:block after:h-px after:w-40 after:content-['']" />

        <h1 className="mb-4 text-3xl leading-tight font-bold md:text-5xl">
          {heroSection.header.title}
          <br />
          <span className="font-eukrainehead group text-accent relative mt-2 inline-block text-2xl font-bold md:text-4xl">
            {person.name}
            <span className="bg-accent absolute -bottom-1 left-0 h-0.75 w-0 transition-all duration-500 group-hover:w-full" />
          </span>
        </h1>

        <p className="mt-6 mb-8 max-w-xl text-base text-gray-200 md:text-lg">
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

        <p className="app-text mt-6 text-xs">{heroSection.note}</p>
      </div>
    </section>
  );
};

export default Hero;
