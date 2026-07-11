import type { ReactNode } from 'react';

import Footer from '@/app/components/footer/Footer';
import { blog } from '@/app/resources/content';
import type { BlogSectionKey } from '@/app/resources/content/pages/blog.layout';
import {
  ArticleListItemDto,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
} from '@/app/types';
import { Header, ScrollToTopButton, Socials } from '@/components';
import { BlogArticlesFeed } from './BlogArticlesFeed';
import BlogAside from './BlogAside';
/* --------------------------------- Types ---------------------------------- */

export type BlogSectionProps = {
  category?: string;
  initialItems: ArticleListItemDto[];
  hasMore: boolean;
  recent: BlogRecentPostItemDto[];
  categories: BlogCategoryItemDto[];
};

export type BlogSectionComponent = (props: BlogSectionProps) => ReactNode;

/* -------------------------------- Sections -------------------------------- */

const HeroSection: BlogSectionComponent = () => (
  <section className="container pt-10 lg:pt-14">
    <div className="mb-8 max-w-3xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
        {blog.eyebrow}
      </p>
      <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
        {blog.heading}
      </h1>
      <p className="text-app mt-4 text-base leading-7">{blog.lead}</p>
    </div>
  </section>
);

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
