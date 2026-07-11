import { articlePublicActions } from '@/app/actions/article.actions';
import { pageSettingsActions } from '@/app/actions/page-settings.actions';
import { reviewPublicActions } from '@/app/actions/review.actions';
import { servicePublicActions } from '@/app/actions/service.actions';
import { ServiceReviewForm } from '@/app/components';
import { LayoutNode, renderLayout } from '@/app/lib/layouts/renderLayout';
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

  const service = await servicePublicActions.findPublishedBySlug({
    slug,
  });

  const [articles, reviews, rawLayout] = await Promise.all([
    articlePublicActions.list({
      categorySlug: slug,
      limit: 10,
    }),

    reviewPublicActions.list({
      targetType: 'service',
      targetId: service.id,
    }),

    pageSettingsActions.getLayout('service'),
  ]);

  const layout = (rawLayout ?? []) as readonly LayoutNode<ServiceSectionKey>[];

  const sectionProps: ServiceSectionProps = {
    service,
    articles: articles.items,
    reviews: reviews.items,
    reviewForm: <ServiceReviewForm serviceId={service.id} />,
  };

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
