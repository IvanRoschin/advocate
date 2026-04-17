'use client';

import { CldImage } from 'next-cloudinary';

import { Breadcrumbs } from '@/app/components';
import { imageVariants } from '@/app/config/imageVariants';
import { formatDate } from '@/app/helpers';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { Badge } from '@/components/ui/badge';

import { TocItem } from './ArticleToc';
import ArticleToc from './ArticleToc.client.tsx';

type ArticlePageDto = Awaited<
  ReturnType<
    typeof import('@/app/lib/services/article.service').articleService.getPublicBySlug
  >
>;

export type BlogArticleSectionProps = {
  article: ArticlePageDto;
  minutes: number;
  toc: TocItem[];
};

export const HeroSection = ({
  article,
  minutes,
  toc,
}: BlogArticleSectionProps) => {
  const variant = imageVariants.card;

  const publicId = article.src?.[0]
    ? getCloudinarySrc(article.src[0])
    : undefined;

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

          {publicId ? (
            <div className="bg-muted relative mt-4 aspect-16/7 w-full overflow-hidden rounded-2xl">
              <CldImage
                src={publicId}
                alt={article.title}
                fill
                sizes={variant.sizes}
                className="object-cover"
              />
            </div>
          ) : null}
        </header>
      </article>
    </section>
  );
};
