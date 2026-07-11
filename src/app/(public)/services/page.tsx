import type { Metadata } from 'next';

import { servicePublicActions } from '@/app/actions/service.actions';
import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
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
  const servicesRow = await servicePublicActions.list({ limit: 20 });
  const services = servicesRow.items;

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
