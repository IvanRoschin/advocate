import { FaTelegram, FaViber } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

import { getRouteUrl } from '@/app/config/routes';
import {
  formatServicePrice,
  getServicePrice,
} from '@/app/config/servicePrices';
import { Btn, NextImage } from '@/components';
import { heroSection, person, social } from '@/resources';

const messengerIcons = {
  telegram: FaTelegram,
  viber: FaViber,
} as const;

/**
 * Перший екран: один статичний банер замість слайдера.
 * - Реальне фото адвоката замість стокового молотка (довіра).
 * - H1 про задачу клієнта, а не загальне «адвокат у складних ситуаціях».
 * - Месенджери поруч із CTA: в Україні клієнт частіше пише, ніж телефонує.
 * Серверний компонент: увесь текст є в HTML одразу, без очікування гідратації.
 */
const Hero = () => {
  const phoneLink =
    social.find(item => item.icon === 'phone' && item.essential && item.link)
      ?.link ?? null;

  const messengers = social.filter(
    (item): item is typeof item & { icon: keyof typeof messengerIcons } =>
      (item.icon === 'telegram' || item.icon === 'viber') && !!item.link
  );

  const consultationPrice = getServicePrice(heroSection.consultationSlug);
  const note = [
    consultationPrice &&
      `Консультація адвоката — ${formatServicePrice(consultationPrice)}`,
    heroSection.note,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <section
      id={heroSection.id}
      itemScope
      itemType={heroSection.schemaType}
      className="relative flex w-full items-center overflow-hidden bg-[#0f1115] pt-28 pb-40 sm:min-h-256 sm:pb-36 md:pb-64 lg:min-h-192 lg:pb-44 xl:pt-24 xl:pb-52"
    >
      {/* Нейтральний фон з акцентним світінням — без стокових зображень */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 70% at 80% 40%, color-mix(in srgb, var(--accentcolor) 22%, transparent) 0%, transparent 70%), linear-gradient(180deg, #14171d 0%, #0b0d10 100%)',
        }}
      />

      <div className="font-eukrainehead text-hero relative z-30 container grid items-center gap-10 px-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          {/* Мобільний «бейдж» з фото: на lg+ фото показується окремою колонкою */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="border-accent relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2">
              <NextImage
                src={heroSection.portrait.src}
                alt={heroSection.portrait.alt}
                fill
                sizes="56px"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="text-sm leading-tight">
              <p className="text-hero-title font-semibold">{person.name}</p>
              <p className="text-hero-note">{person.role}</p>
            </div>
          </div>

          <p className="text-hero-uptitle mb-5 text-xs tracking-widest uppercase md:text-sm">
            {heroSection.header.uptitle}
          </p>

          <h1 className="text-hero-title mb-4 text-3xl leading-tight font-bold md:text-5xl">
            {heroSection.header.title}:{' '}
            <span className="text-accent block text-2xl md:mt-2 md:text-4xl">
              {heroSection.header.titleAccent}
            </span>
          </h1>

          <p className="text-hero-subtitle mt-5 mb-6 max-w-2xl text-base md:text-lg">
            {heroSection.subtitle}
          </p>

          <ul className="mb-8 flex flex-col gap-2 text-sm md:flex-row md:flex-wrap md:gap-x-6 md:text-base">
            {heroSection.facts.map(fact => (
              <li
                key={fact}
                className="text-hero-subtitle flex items-center gap-2"
              >
                <FiCheck className="text-accent shrink-0" aria-hidden />
                {fact}
              </li>
            ))}
          </ul>

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

          {messengers.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-hero-note">
                {heroSection.cta.messengersLabel}
              </span>
              {messengers.map(m => {
                const Icon = messengerIcons[m.icon];
                return (
                  <a
                    key={m.icon}
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hero-title hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 transition-colors"
                  >
                    <Icon aria-hidden />
                    {m.name}
                  </a>
                );
              })}
            </div>
          )}

          <p className="text-hero-note mt-6 text-xs">{note}</p>
        </div>

        <div className="relative hidden aspect-[2/3] w-full max-w-sm justify-self-end overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 lg:block">
          <NextImage
            src={heroSection.portrait.src}
            alt={heroSection.portrait.alt}
            fill
            sizes="(min-width: 1024px) 384px, 0px"
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
