import type { ReactNode } from 'react';

import {
  About,
  Advantages,
  Footer,
  Header,
  Hero,
  Order,
  Practices,
  Reviews,
  ScrollToTopButton,
  Services,
  Socials,
  WhyChooseMe,
} from '@/components';

import { ReviewResponseDTO } from './types';

import type { HomeSectionKey } from '@/app/resources/content/pages/home.layout';
export type HomeSectionProps = {
  reviews?: ReviewResponseDTO[];
};

export type HomeSectionComponent = (props: HomeSectionProps) => ReactNode;

const HomeHeaderSection: HomeSectionComponent = () => <Header scope="public" />;

const HomeSocialsSection: HomeSectionComponent = () => <Socials />;

const HomeHeroSection: HomeSectionComponent = () => <Hero />;

const HomeServicesSection: HomeSectionComponent = () => <Services />;

const HomeAboutSection: HomeSectionComponent = () => <About />;

const HomePracticesSection: HomeSectionComponent = () => <Practices />;

const HomeAdvantagesSection: HomeSectionComponent = () => <Advantages />;

const HomeReviewsSection: HomeSectionComponent = () => <Reviews />;

const HomeWhyChooseMeSection: HomeSectionComponent = () => <WhyChooseMe />;

const HomeOrderSection: HomeSectionComponent = () => <Order />;

const HomeFooterSection: HomeSectionComponent = () => <Footer />;

const HomeScrollToTopSection: HomeSectionComponent = () => (
  <ScrollToTopButton />
);

export const HOME_SECTIONS: Record<HomeSectionKey, HomeSectionComponent> = {
  socials: HomeSocialsSection,
  header: HomeHeaderSection,
  hero: HomeHeroSection,
  services: HomeServicesSection,
  about: HomeAboutSection,
  practices: HomePracticesSection,
  advantages: HomeAdvantagesSection,
  reviews: HomeReviewsSection,
  whyChooseMe: HomeWhyChooseMeSection,
  order: HomeOrderSection,
  footer: HomeFooterSection,
  scrollToTop: HomeScrollToTopSection,
};
