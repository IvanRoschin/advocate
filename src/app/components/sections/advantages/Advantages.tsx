'use client';

import { Btn, NextImage } from '@/components';
import { advantagesSection, social } from '@/resources';

import AdvantageItem from './AdvantageItem';

const Advantages = () => {
  const phoneLink =
    social.find(s => s.icon === 'phone' && s.essential && s.link)?.link ?? null;

  const phoneLabel = phoneLink ? phoneLink.replace(/^tel:/, '+38') : null;

  return (
    <section
      id={advantagesSection.id}
      className="text-advantages relative flex min-h-screen items-center py-20"
      itemScope
      itemType={advantagesSection.schemaType}
    >
      <NextImage
        src={advantagesSection.background.src}
        alt={advantagesSection.background.alt}
        fill
        priority
        className="-z-20 object-cover"
        useSkeleton
      />

      <div className="bg-advantages-overlay absolute inset-0 -z-10" />

      <div className="relative z-10 container grid gap-16 px-4 lg:grid-cols-2">
        <div>
          <p className="text-accent mb-4 text-sm tracking-widest uppercase">
            {advantagesSection.header.uptitle}
          </p>

          <h2 className="text-advantages-title font-eukrainehead mb-10 text-3xl leading-tight font-bold md:text-4xl">
            {advantagesSection.header.titleTop} <br />
            <span className="text-accent">
              {advantagesSection.header.titleAccent}
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {advantagesSection.metrics.map(m => (
              <AdvantageItem
                key={m.id}
                value={m.value}
                suffix={m.suffix}
                text={m.text}
              />
            ))}
          </div>
        </div>

        <div className="bg-advantages-panel flex flex-col justify-center rounded-3xl p-8 backdrop-blur-md">
          <h3 className="font-eukrainehead text-advantages-title mb-4 text-2xl font-bold">
            {advantagesSection.cta.title}
          </h3>

          <p className="text-advantages-muted mb-6">
            Отримайте <strong>первинну консультацію</strong> та зрозумійте
            реальні перспективи вашої справи вже сьогодні.
          </p>

          {phoneLink && (
            <Btn
              label={`${advantagesSection.cta.buttonPrefix}${phoneLabel ? ` ${phoneLabel}` : ''}`}
              href={phoneLink}
              uiVariant="accent"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
