import type { ReactNode } from 'react';

import Link from 'next/link';

import { Header, ScrollToTopButton, Socials } from '@/app/components';
import Footer from '@/app/components/footer/Footer';
import { offerContent } from '@/app/resources/content/pages/offer.content';

import type { OfferSectionKey } from '@/app/resources/content/pages/offer.layout';
type OfferSectionComponent = () => ReactNode;

const SocialsSection: OfferSectionComponent = () => <Socials />;
const HeaderSection: OfferSectionComponent = () => <Header />;

const HeroSection: OfferSectionComponent = () => (
  <section className="container py-8 lg:py-10">
    <div className="max-w-3xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
        {offerContent.eyebrow}
      </p>

      <h1 className="text-foreground text-3xl font-semibold tracking-tight lg:text-4xl">
        {offerContent.heading}
      </h1>

      <p className="text-muted-foreground mt-4 text-base leading-7">
        {offerContent.lead}
      </p>
    </div>
  </section>
);

const ContentSection: OfferSectionComponent = () => (
  <section className="min-w-0">
    <article className="border-border bg-card rounded-2xl border p-5 lg:p-6">
      <div className="space-y-8">
        <p className="text-muted-foreground text-sm leading-7">
          {offerContent.intro}
        </p>

        {offerContent.sections.map(section => (
          <section key={section.title}>
            <h2 className="text-foreground text-xl font-semibold">
              {section.title}
            </h2>

            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, index) => (
                <p
                  key={`${section.title}-${index}`}
                  className="text-muted-foreground text-sm leading-7"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            {offerContent.requisites.title}
          </h2>

          <ul className="mt-3 space-y-2">
            {offerContent.requisites.items.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="text-muted-foreground text-sm leading-7"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  </section>
);

const AsideSection: OfferSectionComponent = () => (
  <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
    <div className="border-border bg-card rounded-2xl border p-5">
      <h2 className="text-foreground text-lg font-semibold">
        {offerContent.aside.title}
      </h2>

      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {offerContent.aside.description}
      </p>

      <div className="mt-4">
        <Link
          href={offerContent.aside.href}
          className="text-accent text-sm font-semibold"
        >
          {offerContent.aside.label}
        </Link>
      </div>
    </div>
  </aside>
);

const FooterSection: OfferSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);
const ScrollToTopSection: OfferSectionComponent = () => <ScrollToTopButton />;

export const OFFER_SECTIONS: Record<OfferSectionKey, OfferSectionComponent> = {
  socials: SocialsSection,
  header: HeaderSection,
  hero: HeroSection,
  content: ContentSection,
  aside: AsideSection,
  footer: FooterSection,
  scrollToTop: ScrollToTopSection,
};
