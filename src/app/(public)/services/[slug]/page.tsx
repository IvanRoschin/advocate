import { ServiceReviewForm } from '@/app/components';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
import { articleService } from '@/app/lib/services';
import { pageSettingsService } from '@/app/lib/services/page-settings.service';
import { reviewService } from '@/app/lib/services/review.service';
import { serviceService } from '@/app/lib/services/service.service';
import { ServiceSectionKey } from '@/app/types';

import {
  SERVICE_SECTIONS,
  ServiceSectionProps,
} from './_components/service.sections';

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;

  const service = await serviceService.getPublicBySlug(slug);

  const articles = await articleService.getRelatedArticles(service.id);

  const reviews = await reviewService.getApprovedByTarget({
    targetType: 'service',
    targetId: service.id,
  });

  const sectionProps: ServiceSectionProps = {
    service,
    articles,
    reviews,
    reviewForm: <ServiceReviewForm serviceId={service.id} />,
  };

  const layout = await pageSettingsService.getServiceLayout();

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout<ServiceSectionKey, ServiceSectionProps>({
        layout,
        sections: SERVICE_SECTIONS,
        sectionProps,
      })}
    </main>
  );
}
