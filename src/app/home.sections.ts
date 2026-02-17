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

import type { HomeSectionKey } from '@/app/resources/content/pages/home.layout';

export const HOME_SECTIONS: Record<HomeSectionKey, React.ComponentType> = {
  socials: Socials,
  header: Header,
  hero: Hero,
  services: Services,
  about: About,
  practices: Practices,
  advantages: Advantages,
  reviews: Reviews,
  whyChooseMe: WhyChooseMe,
  order: Order,
  footer: Footer,
  scrollToTop: ScrollToTopButton,
};
