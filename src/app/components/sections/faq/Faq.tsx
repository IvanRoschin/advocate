import { faqSection } from '@/app/resources';

/**
 * FAQ на нативних <details> — працює без JS, відповіді є в HTML.
 * JSON-LD FAQPage допомагає пошуковикам і AI-асистентам цитувати відповіді.
 */
export default function Faq() {
  const { id, header, items } = faqSection;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section id={id} className="bg-why-section section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4">
        <header className="section-header text-center">
          <span className="bg-accent mb-4 inline-block h-8 w-px" />
          <p className="text-accent text-xs tracking-widest uppercase">
            {header.uptitle}
          </p>
          <h2 className="text-why-title font-eukrainehead mt-3 text-2xl font-bold sm:text-3xl md:text-4xl">
            {header.title}
          </h2>
          <span className="bg-accent mt-4 inline-block h-8 w-px" />
        </header>

        <div className="section-content space-y-4">
          {items.map(item => (
            <details
              key={item.id}
              className="bg-why-card border-why-card group rounded-2xl border"
            >
              <summary className="text-why-card-title hover:text-accent flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-semibold transition-colors md:text-lg [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="text-accent ml-3 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-app px-5 pb-4 text-sm md:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
