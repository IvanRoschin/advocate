import type { ReactNode } from 'react';

import Link from 'next/link';

import { Header, ScrollToTopButton, Socials } from '@/app/components';
import Footer from '@/app/components/footer/Footer';
import { privacyPolicyContent } from '@/app/resources/content/pages/privacy-policy.content';

import type { PrivacyPolicySectionKey } from '@/app/resources/content/pages/privacy-policy.layout';
export type PrivacyPolicySectionProps = Record<string, never>;
type PrivacyPolicySectionComponent = (
  props?: PrivacyPolicySectionProps
) => ReactNode;

const SocialsSection: PrivacyPolicySectionComponent = () => <Socials />;
const HeaderSection: PrivacyPolicySectionComponent = () => <Header />;

const HeroSection: PrivacyPolicySectionComponent = () => (
  <section className="container py-8 lg:py-10">
    <div className="max-w-3xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
        {privacyPolicyContent.eyebrow}
      </p>

      <h1 className="text-foreground text-3xl font-semibold tracking-tight lg:text-4xl">
        {privacyPolicyContent.heading}
      </h1>

      <p className="text-muted-foreground mt-4 text-base leading-7">
        {privacyPolicyContent.lead}
      </p>
    </div>
  </section>
);

const ContentSection: PrivacyPolicySectionComponent = () => (
  <section className="min-w-0">
    <article className="border-border bg-card rounded-2xl border p-5 lg:p-6">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>{privacyPolicyContent.intro}</p>

        {privacyPolicyContent.sections.map(section => (
          <section key={section.title} className="mt-8 first:mt-0">
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
      </div>
    </article>
  </section>
);

const AsideSection: PrivacyPolicySectionComponent = () => (
  <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
    <div className="border-border bg-card rounded-2xl border p-5">
      <h2 className="text-foreground text-lg font-semibold">
        {privacyPolicyContent.aside.title}
      </h2>

      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {privacyPolicyContent.aside.description}
      </p>

      <div className="mt-4">
        <Link
          href={privacyPolicyContent.aside.href}
          className="text-accent text-sm font-semibold"
        >
          {privacyPolicyContent.aside.label}
        </Link>
      </div>
    </div>
  </aside>
);

const FooterSection: PrivacyPolicySectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);
const ScrollToTopSection: PrivacyPolicySectionComponent = () => (
  <ScrollToTopButton />
);

export const PRIVACY_POLICY_SECTIONS: Record<
  PrivacyPolicySectionKey,
  PrivacyPolicySectionComponent
> = {
  socials: SocialsSection,
  header: HeaderSection,
  hero: HeroSection,
  content: ContentSection,
  aside: AsideSection,
  footer: FooterSection,
  scrollToTop: ScrollToTopSection,
};
