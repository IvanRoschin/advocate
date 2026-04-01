import Link from 'next/link';

import Btn from '@/app/components/ui/button/Btn';
import { routes } from '@/app/config';
import { serviceService } from '@/app/lib/services/service.service';
import { practicesSection } from '@/app/resources';
import PracticesCard from './PracticesCard';

export default async function Practices() {
  const services = await serviceService.getPublicList({ limit: 4 });

  return (
    <section
      id={practicesSection.id}
      className="bg-practices-section section"
      itemScope
      itemType={practicesSection.schemaType}
    >
      <div className="container">
        <header className="section-header">
          <span className="bg-accent mb-4 h-8 w-px" />
          <p className="text-practices-uptitle text-xs tracking-widest uppercase">
            {practicesSection.header.uptitle}
          </p>
          <h2 className="text-practices-title font-eukrainehead mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            {practicesSection.header.title}
          </h2>
          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        <div className="section-content">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {services.map(service => (
                <PracticesCard
                  key={service.id}
                  title={service.title}
                  description={service.summary}
                  href={`/services/${service.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border p-6 text-center">
              Наразі опублікованих послуг ще немає.
            </div>
          )}

          <div className="mt-8 flex items-center justify-center">
            <Link href={routes.public.services}>
              <Btn label={practicesSection.cta.label} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
