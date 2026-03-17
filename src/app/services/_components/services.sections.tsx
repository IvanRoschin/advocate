import type { ReactNode } from 'react';

import Link from 'next/link';

import { NextImage } from '@/app/components';
import { Footer, Header } from '@/components';

import type { ServicesSectionKey } from '@/app/resources/content/pages/services.layout';
import type { ServiceListItemDto } from '@/app/types';

export type ServicesSectionProps = {
  services: ServiceListItemDto[];
};

export type ServicesSectionComponent = (
  props: ServicesSectionProps
) => ReactNode;

const ServicesHeaderSection: ServicesSectionComponent = () => <Header />;

const ServicesHeroSection: ServicesSectionComponent = () => (
  <section className="min-w-0">
    <div className="max-w-3xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
        Послуги
      </p>

      <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
        Юридичні послуги
      </h1>

      <p className="text-app mt-4 text-base leading-7">
        Оберіть напрям правової допомоги, який відповідає вашій ситуації.
      </p>
    </div>
  </section>
);

const ServicesListSection: ServicesSectionComponent = ({ services }) => {
  if (services.length === 0) {
    return (
      <section className="min-w-0">
        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-app text-base leading-7">
            Наразі опублікованих послуг ще немає.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(service => (
          <article
            key={service.id}
            className="border-border bg-card overflow-hidden rounded-2xl border"
          >
            {service.src ? (
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <NextImage
                  src={service.src}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="p-5">
              <h2 className="text-accent text-xl font-semibold">
                {service.title}
              </h2>

              <p className="text-app mt-3 text-sm leading-6">
                {service.summary}
              </p>

              <div className="mt-5">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-accent text-sm font-semibold"
                >
                  Детальніше
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const ServicesFooterSection: ServicesSectionComponent = () => <Footer />;

export const SERVICES_SECTIONS: Record<
  ServicesSectionKey,
  ServicesSectionComponent
> = {
  header: ServicesHeaderSection,
  hero: ServicesHeroSection,
  list: ServicesListSection,
  footer: ServicesFooterSection,
};
