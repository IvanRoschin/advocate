import type { Metadata } from 'next';

import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
import { serviceService } from '@/app/lib/services/service.service';
import { servicesLayout } from '@/app/resources/content/pages/services.layout';
import {
  SERVICES_SECTIONS,
  ServicesSectionProps,
} from './_components/services.sections';

export const metadata: Metadata = buildMetadata({
  title: 'Послуги адвоката | Іван Рощин',
  description:
    'Юридичні послуги адвоката Івана Рощина: консультації, представництво в суді, супровід справ та правовий захист.',
  path: '/services',
  imageUrl: '/images/ivan_roschin.webp',
});

export default async function ServicesPage() {
  const services = await serviceService.getPublicList();

  const sectionProps: ServicesSectionProps = {
    services,
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: servicesLayout,
        sections: SERVICES_SECTIONS,
        sectionProps,
      })}
    </main>
  );
}
