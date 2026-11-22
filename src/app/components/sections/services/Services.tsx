import {
  formatServicePrice,
  getServicePrice,
} from '@/app/config/servicePrices';
import { routes } from '@/app/config/routes';
import { servicesSection } from '@/app/resources';
import { iconLibrary } from '@/app/resources/icons';

import ServiceCard from './ServiceCard';

const Services = () => {
  return (
    <section className="pointer-events-none absolute inset-x-0 top-full z-20 translate-y-0 sm:-translate-y-24 md:-translate-y-55 lg:-translate-y-32 xl:-translate-y-40">
      <div className="pointer-events-auto container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {servicesSection.items.map(service => {
          const Icon = iconLibrary[service.icon];
          const price = getServicePrice(service.slug);

          return (
            <ServiceCard
              key={service.id}
              icon={<Icon />}
              title={service.title}
              text={service.text}
              href={
                service.slug
                  ? `${routes.public.services}/${service.slug}`
                  : routes.public.services
              }
              price={price ? formatServicePrice(price) : undefined}
              moreLabel={servicesSection.moreLabel}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Services;
