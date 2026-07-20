import type { ReactNode } from 'react';

import Footer from '@/app/components/footer/Footer';
import type { BlogSectionKey } from '@/app/resources/content/pages/blog.layout';
import {
  ArticleListItemDto,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
} from '@/app/types';
import { Header, ScrollToTopButton, Socials } from '@/components';
import { BlogArticlesFeed } from './BlogArticlesFeed';
import BlogAside from './BlogAside';
import BlogHero from './BlogHero';
/* --------------------------------- Types ---------------------------------- */

type BlogSectionProps = {
  category?: string;
  initialItems: ArticleListItemDto[];
  hasMore: boolean;
  recent: BlogRecentPostItemDto[];
  categories: BlogCategoryItemDto[];
};

export type BlogSectionComponent = (props: BlogSectionProps) => ReactNode;

/* -------------------------------- Sections -------------------------------- */

const HeroSection: BlogSectionComponent = () => <BlogHero />;

const FiltersSection: BlogSectionComponent = ({
  recent,
  categories,
  category,
}) => (
  <aside className="border-accent w-full min-w-0 shrink-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:w-80 lg:self-start lg:border-l">
    <BlogAside
      recent={recent}
      categories={categories}
      activeCategory={category ?? ''}
    />
  </aside>
);

const ArticlesSection: BlogSectionComponent = ({ initialItems, hasMore }) => (
  <section className="min-w-0 flex-1">
    <BlogArticlesFeed initialItems={initialItems} hasMore={hasMore} />
  </section>
);

const PaginationSection: BlogSectionComponent = () => null;
const SubscribeSection: BlogSectionComponent = () => null;
const SocialsSection: BlogSectionComponent = () => <Socials />;
const HeaderSection: BlogSectionComponent = () => <Header />;
const FooterSection: BlogSectionComponent = () => <Footer />;
const ScrollToTopSection: BlogSectionComponent = () => <ScrollToTopButton />;

/* ------------------------------ Registry ---------------------------------- */

export const BLOG_SECTIONS: Record<BlogSectionKey, BlogSectionComponent> = {
  socials: SocialsSection,
  header: HeaderSection,
  hero: HeroSection,
  filters: FiltersSection,
  articles: ArticlesSection,
  pagination: PaginationSection,
  subscribe: SubscribeSection,
  footer: FooterSection,
  scrollToTop: ScrollToTopSection,
};
