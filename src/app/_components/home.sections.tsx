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

import Footer from '@/app/components/footer/Footer';
import Faq from '@/app/components/sections/faq/Faq';
import Practices from '@/app/components/sections/practices/Practices';
import Process from '@/app/components/sections/process/Process';
import Reviews from '@/app/components/sections/reviews/Reviews';
import Services from '@/app/components/sections/services/Services';
import { HomeSectionKey } from '@/app/resources/content/pages/home.layout';
import { ReviewResponseDTO, ServicePublicPageDto } from '@/app/types';

export type HomeSectionProps = {
  reviews?: ReviewResponseDTO[];
  services?: ServicePublicPageDto[];
};

export type HomeSectionComponent = (props: HomeSectionProps) => ReactNode;

const HomeHeaderSection: HomeSectionComponent = () => <Header />;

const HomeSocialsSection: HomeSectionComponent = () => <Socials />;

const HomeHeroSection: HomeSectionComponent = () => <Hero />;

const HomeServicesSection: HomeSectionComponent = () => <Services />;

const HomeAboutSection: HomeSectionComponent = () => <About />;

const HomePracticesSection: HomeSectionComponent = () => <Practices />;

const HomeAdvantagesSection: HomeSectionComponent = () => <Advantages />;

const HomeReviewsSection: HomeSectionComponent = props => (
  <Reviews reviews={props.reviews ?? []} />
);
const HomeWhyChooseMeSection: HomeSectionComponent = () => <WhyChooseMe />;

const HomeProcessSection: HomeSectionComponent = () => <Process />;

const HomeFaqSection: HomeSectionComponent = () => <Faq />;

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
  process: HomeProcessSection,
  faq: HomeFaqSection,
  order: HomeOrderSection,
  footer: HomeFooterSection,
  scrollToTop: HomeScrollToTopSection,
};
