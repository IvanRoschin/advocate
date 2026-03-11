import { notFound } from 'next/navigation';

import { renderLayout } from '@/app/lib/layouts/renderLayout';
import { serviceService } from '@/app/lib/services/service.service';
import { defaultServiceLayout } from '@/app/resources/content/pages/service.layout';
import { ServiceLayoutNode } from '@/app/types';
import {
  SERVICE_SECTIONS,
  ServiceSectionProps,
} from './_components/service.sections';

export const dynamic = 'force-dynamic';

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;

  let service;

  try {
    service = await serviceService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const sectionProps: ServiceSectionProps = { service };

  const layout: ServiceLayoutNode[] =
    Array.isArray(service.layout) && service.layout.length > 0
      ? service.layout
      : defaultServiceLayout;

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout,
        sections: SERVICE_SECTIONS,
        sectionProps,
      })}
    </main>
  );
}
