import type { ReactNode } from 'react';

import { Header, ScrollToTopButton, Socials } from '@/app/components';
import Footer from '@/app/components/footer/Footer';

import type { OfferSectionKey } from '@/app/resources/content/pages/offer.layout';
import OfferAside from './OfferAside';
import OfferContent from './OfferContent';
import OfferHero from './OfferHero';
type OfferSectionComponent = () => ReactNode;

const SocialsSection: OfferSectionComponent = () => <Socials />;
const HeaderSection: OfferSectionComponent = () => <Header />;
const HeroSection: OfferSectionComponent = () => <OfferHero />;
const ContentSection: OfferSectionComponent = () => <OfferContent />;
const AsideSection: OfferSectionComponent = () => <OfferAside />;

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
