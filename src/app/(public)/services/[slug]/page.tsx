import { getServicePrice } from '@/app/config/servicePrices';
import type { Metadata } from 'next';

import { articlePublicActions } from '@/app/actions/article.actions';
import { pageSettingsActions } from '@/app/actions/page-settings.actions';
import { reviewPublicActions } from '@/app/actions/review.actions';
import { servicePublicActions } from '@/app/actions/service.actions';
import PublicReviewForm from '@/app/components/forms/public/PublicReviewForm';
import { baseUrl } from '@/app/config/routes';
import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { LayoutNode, renderLayout } from '@/app/lib/layouts/renderLayout';
import { ServiceSectionKey } from '@/app/types';

import {
  SERVICE_SECTIONS,
  ServiceSectionProps,
} from './_components/service.sections';

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

const SERVICE_TITLE_SUFFIX = 'адвокат у Києві | Іван Рощин';

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  let service: Awaited<
    ReturnType<typeof servicePublicActions.findPublishedBySlug>
  >;
  try {
    service = await servicePublicActions.findPublishedBySlug({ slug });
  } catch {
    return {};
  }
  if (!service) return {};

  const title =
    service.seoTitle?.trim() || `${service.title} — ${SERVICE_TITLE_SUFFIX}`;
  const description =
    service.seoDescription?.trim() || service.summary?.trim() || undefined;

  return buildMetadata({
    title,
    description,
    path: `/services/${service.slug}`,
    imageUrl: service.src?.[0] ?? '/images/ivan_roschin.webp',
    imageAlt: service.title,
  });
}

function buildServiceJsonLd(service: {
  slug: string;
  title: string;
  summary?: string;
  seoDescription?: string;
}) {
  const url = new URL(`/services/${service.slug}`, baseUrl).toString();
  const price = getServicePrice(service.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.seoDescription || service.summary || undefined,
    url,
    serviceType: service.title,
    areaServed: [
      { '@type': 'City', name: 'Київ' },
      { '@type': 'Country', name: 'Україна' },
    ],
    provider: {
      '@type': 'Attorney',
      name: 'Адвокат Іван Рощин',
      url: baseUrl,
    },
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'UAH',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: price.from,
              priceCurrency: 'UAH',
              ...(price.unit ? { unitText: price.unit } : {}),
            },
          },
        }
      : {}),
  };
}

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
    reviewForm: <PublicReviewForm targetType="service" targetId={service.id} />,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildServiceJsonLd(service)),
        }}
      />
      <main className="bg-background text-foreground min-h-screen">
        {renderLayout<ServiceSectionKey, ServiceSectionProps>({
          layout,
          sections: SERVICE_SECTIONS,
          sectionProps,
        })}
      </main>
    </>
  );
}
