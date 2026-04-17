import type { ReactNode } from 'react';

import { Header } from '@/app/components';
import Footer from '@/app/components/footer/Footer';

import { ArticleListPreview } from '../../_components/ArticleListPreview';
import { ShareSection } from '../../_components/ShareSection';
import ArticleContent from './ArticleContent';
import { TocItem } from './ArticleToc';
import ArticleToc from './ArticleToc.client.tsx';
import { HeroSection } from './HeroSection';
import ReviewsSection from './ReviewsSection.client';

import type { ArticleSectionKey, ReviewResponseDTO } from '@/app/types';
type RelatedArticle = Awaited<
  ReturnType<
    typeof import('@/app/lib/services/article.service').articleService.getRelatedPublicByCategory
  >
>[number];

type ArticlePageDto = Awaited<
  ReturnType<
    typeof import('@/app/lib/services/article.service').articleService.getPublicBySlug
  >
>;

export type BlogArticleSectionProps = {
  article: ArticlePageDto;
  html: string;
  minutes: number;
  toc: TocItem[];
  reviews?: ReviewResponseDTO[];
  reviewForm?: ReactNode;

  related: RelatedArticle[];
  url: string;
};

export type BlogArticleSectionComponent = (
  props: BlogArticleSectionProps
) => React.ReactElement | null;

const BlogArticleHeaderSection: BlogArticleSectionComponent = () => <Header />;

const BlogArticleHeroSection: BlogArticleSectionComponent = ({
  article,
  minutes,
  toc,
}) => <HeroSection article={article} minutes={minutes} toc={toc} />;

const BlogArticleContentSection: BlogArticleSectionComponent = ({
  html,
  toc,
}) => {
  return (
    <section className="container pb-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <ArticleContent html={html ?? ''} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ArticleToc items={toc} />
          </div>
        </aside>
      </div>
    </section>
  );
};

const BlogArticleShareSection: BlogArticleSectionComponent = ({
  article,
  url,
}) => {
  return (
    <section className="container pb-10">
      <ShareSection title={article.title} url={url} />
    </section>
  );
};

const BlogArticleRelatedSection: BlogArticleSectionComponent = ({
  related,
}) => {
  if (!related?.length) return null;
  return (
    <section className="container pb-14">
      <h2 className="text-accent mb-4 text-lg font-semibold">
        Ще з цієї категорії
      </h2>
      <ArticleListPreview items={related} baseHref="/blog" />
    </section>
  );
};

const BlogArticleReviewsSection: BlogArticleSectionComponent = ({
  reviews = [],
  reviewForm,
}) => {
  if (!reviews.length && !reviewForm) return null;

  return (
    <ReviewsSection title="Відгуки" reviews={reviews} reviewForm={reviewForm} />
  );
};

const BlogArticleTocSection: BlogArticleSectionComponent = () => null;

const BlogArticleFooterSection: BlogArticleSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);

/**
 * Секция-заглушка. Нужна только если твой renderLayout требует,
 * чтобы каждый key был в map sections. Фактический desktop TOC уже встроен в content.
 */

export const BLOG_ARTICLE_SECTIONS: Record<
  ArticleSectionKey,
  BlogArticleSectionComponent
> = {
  header: BlogArticleHeaderSection,
  hero: BlogArticleHeroSection,
  content: BlogArticleContentSection,
  share: BlogArticleShareSection,
  related: BlogArticleRelatedSection,
  toc: BlogArticleTocSection,
  reviews: BlogArticleReviewsSection,
  footer: BlogArticleFooterSection,
};
