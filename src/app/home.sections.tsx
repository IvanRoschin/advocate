import type { ReactNode } from 'react';

import {
  About,
  Advantages,
  Hero,
  Order,
  ScrollToTopButton,
  Socials,
  WhyChooseMe,
} from '@/components';
import Header from '@/components/header/Header';

import Footer from './components/footer/Footer';
import Practices from './components/sections/practices/Practices';
import Reviews from './components/sections/reviews/Reviews';
import Services from './components/sections/services/Services';
import { HomeSectionKey } from './resources/content/pages/home.layout';
import {
  ReviewResponseDTO,
  ServicePublicPageDto,
  SlideResponseDTO,
} from './types';

export type HomeSectionProps = {
  reviews?: ReviewResponseDTO[];
  services?: ServicePublicPageDto[];
  slides?: SlideResponseDTO[];
};

export type HomeSectionComponent = (props: HomeSectionProps) => ReactNode;

const HomeHeaderSection: HomeSectionComponent = () => <Header />;

const HomeSocialsSection: HomeSectionComponent = () => <Socials />;

const HomeHeroSection: HomeSectionComponent = props => (
  <Hero slides={props.slides ?? []} />
);

const HomeServicesSection: HomeSectionComponent = () => <Services />;

const HomeAboutSection: HomeSectionComponent = () => <About />;

const HomePracticesSection: HomeSectionComponent = () => <Practices />;

const HomeAdvantagesSection: HomeSectionComponent = () => <Advantages />;

const HomeReviewsSection: HomeSectionComponent = props => (
  <Reviews reviews={props.reviews ?? []} />
);
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
