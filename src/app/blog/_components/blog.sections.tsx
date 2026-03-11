import type { ReactNode } from 'react';

import { blog } from '@/app/resources/content';
import { Footer, Header, ScrollToTopButton, Socials } from '@/components';

import { ArticleListPreview } from './ArticleListPreview';
import BlogAside from './BlogAside';

import type { BlogSectionKey } from '@/app/resources/content/pages/blog.layout';
export type BlogSectionProps = {
  category?: string;
  items: Awaited<
    ReturnType<
      typeof import('@/app/lib/services/article.service').articleService.getPublicList
    >
  >;
  recent: Awaited<
    ReturnType<
      typeof import('@/app/lib/services/article.service').articleService.getRecentPublic
    >
  >;
  categories: Awaited<
    ReturnType<
      typeof import('@/app/lib/services/article.service').articleService.getPublicCategoriesWithCounts
    >
  >;
};

export type BlogSectionComponent = (props: BlogSectionProps) => ReactNode;

const BlogHeroSection: BlogSectionComponent = () => (
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

const BlogFiltersSection: BlogSectionComponent = ({
  recent,
  categories,
  category,
}) => (
  <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
    <BlogAside
      recent={recent}
      categories={categories}
      activeCategory={category ?? ''}
    />
  </aside>
);

const BlogArticlesSection: BlogSectionComponent = ({ items }) => (
  <section className="min-w-0">
    <ArticleListPreview items={items} baseHref={blog.path} />
  </section>
);

const BlogPaginationSection: BlogSectionComponent = () => null;

const BlogSubscribeSection: BlogSectionComponent = () => null;

const BlogSocialsSection: BlogSectionComponent = () => <Socials />;
const BlogHeaderSection: BlogSectionComponent = () => <Header />;
const BlogFooterSection: BlogSectionComponent = () => <Footer />;
const BlogScrollToTopSection: BlogSectionComponent = () => (
  <ScrollToTopButton />
);

export const BLOG_SECTIONS: Record<BlogSectionKey, BlogSectionComponent> = {
  socials: BlogSocialsSection,
  header: BlogHeaderSection,
  hero: BlogHeroSection,
  filters: BlogFiltersSection,
  articles: BlogArticlesSection,
  pagination: BlogPaginationSection,
  subscribe: BlogSubscribeSection,
  footer: BlogFooterSection,
  scrollToTop: BlogScrollToTopSection,
};
