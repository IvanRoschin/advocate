import type { ReactNode } from 'react';

import { Header, ScrollToTopButton, Socials } from '@/app/components';
import Footer from '@/app/components/footer/Footer';
import type { PrivacyPolicySectionKey } from '@/app/resources/content/pages/privacy-policy.layout';

import PrivacyAside from './PrivacyAside';
import PrivacyContent from './PrivacyContent';
import PrivacyHero from './PrivacyHero';

export type PrivacyPolicySectionProps = Record<string, never>;
type PrivacyPolicySectionComponent = (
  props?: PrivacyPolicySectionProps
) => ReactNode;

const SocialsSection: PrivacyPolicySectionComponent = () => <Socials />;
const HeaderSection: PrivacyPolicySectionComponent = () => <Header />;
const HeroSection: PrivacyPolicySectionComponent = () => <PrivacyHero />;
const ContentSection: PrivacyPolicySectionComponent = () => <PrivacyContent />;
const AsideSection: PrivacyPolicySectionComponent = () => <PrivacyAside />;

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
