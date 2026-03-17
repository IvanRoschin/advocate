import type { ReactNode } from 'react';

import { Breadcrumbs, NextImage, ReviewsSection } from '@/app/components';
import type {
  ReviewResponseDTO,
  ServicePublicPageDto,
  ServiceSectionKey,
} from '@/app/types';

export type ServiceSectionProps = {
  service: ServicePublicPageDto;
  reviews?: ReviewResponseDTO[];
  reviewForm?: ReactNode;
};

export type ServiceSectionComponent = (props: ServiceSectionProps) => ReactNode;

const ServiceHeroSection: ServiceSectionComponent = ({ service }) => {
  const hero = service.sections.hero;

  if (!hero) return null;

  const imageSrc = hero.src?.[0] || service.src?.[0];

  return (
    <section className="container py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="min-w-0">
          <Breadcrumbs />
          <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-5xl">
            {hero.title || service.title}
          </h1>
          <p className="text-app mt-4 text-base leading-7 lg:text-lg">
            {hero.description || service.summary}
          </p>
        </div>
        {imageSrc ? (
          <div className="relative min-h-70 min-w-0 overflow-hidden rounded-2xl lg:min-h-90">
            <NextImage
              src={imageSrc}
              alt={hero.title || service.title}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

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
      <div className="mb-6 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {process.title}
        </h2>
      </div>

      <div className="grid gap-4">
        {process.steps.map((step, index) => (
          <article
            key={`${step.title}-${index}`}
            className="border-border bg-card rounded-2xl border p-5"
          >
            <div className="text-accent text-sm font-semibold">
              Крок {index + 1}
            </div>

            <h3 className="text-accent mt-2 text-lg font-semibold">
              {step.title}
            </h3>

            <p className="text-app mt-3 text-sm leading-6">
              {step.description}
            </p>
          </article>
        ))}
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

      <div className="grid gap-4">
        {faq.items.map((item, index) => (
          <article
            key={`${item.question}-${index}`}
            className="border-border bg-card rounded-2xl border p-5"
          >
            <h3 className="text-accent text-lg font-semibold">
              {item.question}
            </h3>

            <p className="text-app mt-3 text-sm leading-6">{item.answer}</p>
          </article>
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
            <button
              type="button"
              className="bg-accent text-accent-foreground rounded-xl px-5 py-3 text-sm font-semibold"
            >
              {cta.buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SERVICE_SECTIONS: Record<
  ServiceSectionKey,
  ServiceSectionComponent
> = {
  hero: ServiceHeroSection,
  benefits: ServiceBenefitsSection,
  process: ServiceProcessSection,
  faq: ServiceFaqSection,
  reviews: ServiceReviewsSection,
  cta: ServiceCtaSection,
};
