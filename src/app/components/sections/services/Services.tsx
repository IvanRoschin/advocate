import { servicesSection } from '@/app/resources';
import { iconLibrary } from '@/app/resources/icons';

import ServiceCard from './ServiceCard';

const Services = () => {
  return (
    <section className="pointer-events-none absolute inset-x-0 top-full z-20 -translate-y-[219px] sm:-translate-y-[205px] lg:-translate-y-16">
      {' '}
      <div className="pointer-events-auto container grid grid-cols-2 lg:grid-cols-4">
        {servicesSection.items.map(service => {
          const Icon = iconLibrary[service.icon];

          return (
            <ServiceCard
              key={service.id}
              icon={<Icon />}
              title={service.title}
              text={service.text}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Services;
