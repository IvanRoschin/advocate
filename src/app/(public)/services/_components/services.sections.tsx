import type { ReactNode } from 'react';

import Footer from '@/app/components/footer/Footer';
import { ServiceListItemDto } from '@/app/types';
import { Header } from '@/components';

import { ServicesFeed } from './ServicesFeed';

import type { ServicesSectionKey } from '@/app/resources/content/pages/services.layout';
export type ServicesSectionProps = {
  services: ServiceListItemDto[];
  hasMore: boolean;
};

export type ServicesSectionComponent = (
  props: ServicesSectionProps
) => ReactNode;

const HeaderSection: ServicesSectionComponent = () => <Header />;

const HeroSection: ServicesSectionComponent = () => (
  <section className="min-w-0">
    <div className="mb-20 max-w-3xl">
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

const ListSection: ServicesSectionComponent = ({ services, hasMore }) => (
  <section className="min-w-0">
    <ServicesFeed initialItems={services} hasMore={hasMore} />
  </section>
);

const FooterSection: ServicesSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);

export const SERVICES_SECTIONS: Record<
  ServicesSectionKey,
  ServicesSectionComponent
> = {
  header: HeaderSection,
  hero: HeroSection,
  list: ListSection,
  footer: FooterSection,
};
