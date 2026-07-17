import type { ReactNode } from 'react';

import { Header, ReviewsSection } from '@/app/components';
import Footer from '@/app/components/footer/Footer';
import type {
  ArticleListItemDto,
  ReviewResponseDTO,
  ServicePublicPageDto,
  ServiceSectionKey,
} from '@/app/types';

import RelatedArticles from './RelatedArticles';
import ServiceBenefits from './ServiceBenefits';
import ServiceCta from './ServiceCta';
import ServiceFaq from './ServiceFaq';
import ServiceHero from './ServiceHero';
import ServiceProcess from './ServiceProcess';

export type ServiceSectionProps = {
  service: ServicePublicPageDto;
  articles: ArticleListItemDto[];
  reviews?: ReviewResponseDTO[];
  reviewForm?: ReactNode;
};

export type ServiceSectionComponent = (props: ServiceSectionProps) => ReactNode;

const ServiceHeaderSection: ServiceSectionComponent = () => <Header />;

const ServiceHeroSection: ServiceSectionComponent = ({ service }) => (
  <ServiceHero service={service} />
);

const ServiceBenefitsSection: ServiceSectionComponent = ({ service }) => (
  <ServiceBenefits service={service} />
);

const ServiceProcessSection: ServiceSectionComponent = ({ service }) => (
  <ServiceProcess service={service} />
);

const ServiceFaqSection: ServiceSectionComponent = ({ service }) => (
  <ServiceFaq service={service} />
);

const ServiceReviewsSection: ServiceSectionComponent = ({
  reviews = [],
  reviewForm,
}) => (
  <ReviewsSection title="Відгуки" reviews={reviews} reviewForm={reviewForm} />
);

const ServiceRelatedArticlesSection: ServiceSectionComponent = ({
  articles,
}) => <RelatedArticles articles={articles} />;

const ServiceCtaSection: ServiceSectionComponent = ({ service }) => (
  <ServiceCta service={service} />
);

const ServiceFooterSection: ServiceSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);

export const SERVICE_SECTIONS: Record<
  ServiceSectionKey,
  ServiceSectionComponent
> = {
  header: ServiceHeaderSection,
  hero: ServiceHeroSection,
  benefits: ServiceBenefitsSection,
  process: ServiceProcessSection,
  faq: ServiceFaqSection,
  reviews: ServiceReviewsSection,
  relatedArticles: ServiceRelatedArticlesSection,
  cta: ServiceCtaSection,
  footer: ServiceFooterSection,
};
