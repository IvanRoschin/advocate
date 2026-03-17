import type { ReactNode } from 'react';

import { Breadcrumbs, NextImage, ReviewsSection } from '@/app/components';
import { formatDate } from '@/app/helpers';
import { ArticleSectionKey, ReviewResponseDTO } from '@/app/types';
import { Badge } from '@/components/ui/badge';

import { ArticleListPreview } from '../../_components/ArticleListPreview';
import { ShareSection } from '../../_components/ShareSection';
import ArticleContent from './ArticleContent';
import ArticleToc, { TocItem } from './ArticleToc';

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
) => ReactNode;

const BlogArticleHeroSection: BlogArticleSectionComponent = ({
  article,
  minutes,
  toc,
}) => {
  const cover = article.src?.[0];

  return (
    <section className="container py-10 lg:py-14">
      <article className="min-w-0">
        <header className="space-y-4">
          <div className="mb-8"></div>
          <Breadcrumbs />
          <div className="flex flex-wrap items-center gap-2">
            {article.category?.title ? (
              <Badge variant="secondary">{article.category.title}</Badge>
            ) : null}

            {article.publishedAt ? (
              <time
                className="text-muted-foreground text-sm"
                dateTime={article.publishedAt}
              >
                {formatDate(article.publishedAt)}
              </time>
            ) : (
              <Badge variant="outline">draft</Badge>
            )}

            <span className="text-muted-foreground">•</span>

            <span className="text-accent text-sm">≈ {minutes} хв читання</span>
          </div>

          <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-5xl">
            {article.title}
          </h1>

          {article.subtitle ? (
            <p className="text-muted-foreground max-w-3xl text-base leading-7 italic lg:text-lg">
              {article.subtitle}
            </p>
          ) : null}

          {toc.length ? (
            <div className="mt-4 lg:hidden">
              <details className="border-accent rounded-xl border p-4">
                <summary className="text-accent cursor-pointer font-semibold">
                  Зміст
                </summary>

                <div className="mt-3">
                  <ArticleToc items={toc} />
                </div>
              </details>
            </div>
          ) : null}

          {cover ? (
            <div className="bg-muted relative mt-4 aspect-16/7 w-full overflow-hidden rounded-2xl">
              <NextImage
                useSkeleton
                src={cover}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          ) : null}
        </header>
      </article>
    </section>
  );
};

const BlogArticleContentSection: BlogArticleSectionComponent = ({
  html,
  toc,
}) => {
  return (
    <section className="container pb-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <ArticleContent html={html} />
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
  if (related.length === 0) return null;
  return (
    <section className="container pb-14">
      <h2 className="text-accent mb-4 text-lg font-semibold">
        Ще з цієї категорії
      </h2>

      <ArticleListPreview items={related} baseHref="/blog" />
    </section>
  );
};

const BlogArticleTocSection: BlogArticleSectionComponent = () => null;

const BlogArticleReviewsSection: BlogArticleSectionComponent = ({
  reviews = [],
  reviewForm,
}) => {
  return (
    <ReviewsSection title="Відгуки" reviews={reviews} reviewForm={reviewForm} />
  );
};

/**
 * Секция-заглушка. Нужна только если твой renderLayout требует,
 * чтобы каждый key был в map sections. Фактический desktop TOC уже встроен в content.
 */

export const BLOG_ARTICLE_SECTIONS: Record<
  ArticleSectionKey,
  BlogArticleSectionComponent
> = {
  hero: BlogArticleHeroSection,
  content: BlogArticleContentSection,
  share: BlogArticleShareSection,
  related: BlogArticleRelatedSection,
  toc: BlogArticleTocSection,
  reviews: BlogArticleReviewsSection,
};
