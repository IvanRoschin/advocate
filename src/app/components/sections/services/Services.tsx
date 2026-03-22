import { servicesSection } from '@/app/resources';
import { iconLibrary } from '@/app/resources/icons';
import ServiceCard from './ServiceCard';

const Services = () => {
  return (
    <section className="absolute top-full left-0 z-20 w-full -translate-y-1/5 sm:-translate-y-1/4 md:-translate-y-1/2">
      <div className="container grid grid-cols-1 md:grid-cols-2 md:py-10 lg:grid-cols-4">
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
