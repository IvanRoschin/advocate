'use client';

import { getRouteUrl } from '@/app/config/routes';
import { Btn, NextImage } from '@/components';
import { heroSection, person, social } from '@/resources';

const Hero = () => {
  const phoneLink =
    social.find(item => item.icon === 'phone' && item.essential && item.link)
      ?.link ?? null;

  return (
    <section
      className="relative flex min-h-screen w-full items-center overflow-hidden"
      itemScope
      itemType={heroSection.schemaType}
    >
      <NextImage
        useSkeleton
        src={heroSection.background.src}
        alt={heroSection.background.alt}
        fill
        priority
        className="-z-20 object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/30 to-black/60" />

      <div className="relative z-10 container px-4 text-white">
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
            component="a"
            href={getRouteUrl(heroSection.cta.primary.route)}
          />

          {phoneLink && (
            <Btn
              label={heroSection.cta.secondary.label}
              component="a"
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
