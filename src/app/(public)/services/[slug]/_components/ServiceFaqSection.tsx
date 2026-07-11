import { ServiceSectionComponent } from './service.sections';

export const ServiceFaqSection: ServiceSectionComponent = ({ service }) => {
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
