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
import ServiceCtaOrderButton from './ServiceCtaOrderButton';
import ServiceHero from './ServiceHero';

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

const ServiceBenefitsSection: ServiceSectionComponent = ({ service }) => {
  const benefits = service.sections.benefits;

  if (!benefits || benefits.items.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="mb-6 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {benefits.title}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="border-border bg-card rounded-2xl border p-5"
          >
            <h3 className="text-accent text-lg font-semibold">{item.title}</h3>

            <p className="text-app mt-3 text-sm leading-6">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

const ServiceProcessSection: ServiceSectionComponent = ({ service }) => {
  const process = service.sections.process;

  if (!process || process.steps.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="mb-10 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {process.title}
        </h2>
      </div>

      <div className="relative">
        <div
          className="absolute top-2 bottom-2 left-4.75 w-px lg:left-5.75"
          style={{ backgroundColor: 'var(--accentcolor)', opacity: 0.25 }}
        />

        <div className="space-y-8">
          {process.steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="relative flex gap-5 pl-0"
            >
              <div
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold lg:h-12 lg:w-12"
                style={{
                  borderColor: 'var(--accentcolor)',
                  color: 'var(--accentcolor)',
                  backgroundColor: 'var(--background)',
                }}
              >
                {index + 1}
              </div>

              <div className="min-w-0 pt-1.5">
                <h3 className="text-accent text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-app mt-2 text-sm leading-6">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceFaqSection: ServiceSectionComponent = ({ service }) => {
  const faq = service.sections.faq;

  if (!faq || faq.items.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="mb-6 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {faq.title}
        </h2>
      </div>

      <div className="divide-border divide-y border-t border-b">
        {faq.items.map((item, index) => (
          <details
            key={`${item.question}-${index}`}
            className="faq-item group py-4"
          >
            <summary className="text-accent flex cursor-pointer list-none items-center justify-between text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                className="ml-4 shrink-0 text-2xl leading-none font-light transition-transform duration-200 group-open:rotate-45"
                style={{ color: 'var(--accentcolor)' }}
              >
                +
              </span>
            </summary>
            <div className="faq-panel">
              <p className="text-app pt-3 pr-8 text-sm leading-6">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

const ServiceReviewsSection: ServiceSectionComponent = ({
  reviews = [],
  reviewForm,
}) => {
  return (
    <ReviewsSection title="Відгуки" reviews={reviews} reviewForm={reviewForm} />
  );
};

const ServiceRelatedArticlesSection: ServiceSectionComponent = ({
  articles,
}) => <RelatedArticles articles={articles} />;

const ServiceCtaSection: ServiceSectionComponent = ({ service }) => {
  const cta = service.sections.cta;

  if (!cta) return null;

  return (
    <section className="container py-10 lg:pb-14">
      <div className="border-border bg-card rounded-3xl border p-6 lg:p-8">
        <div className="max-w-2xl">
          <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
            {cta.title}
          </h2>

          <p className="text-app mt-4 text-base leading-7">{cta.description}</p>

          <div className="mt-6">
            <ServiceCtaOrderButton label={cta.buttonLabel} />
          </div>
        </div>
      </div>
    </section>
  );
};

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
