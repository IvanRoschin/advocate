'use client';

import { CldImage } from 'next-cloudinary';

import { AppLink, NextImage } from '@/app/components';
import { imageVariants } from '@/app/config/imageVariants';

import type { ArticleListItemDto } from '@/app/types';
type Props = {
  articles: ArticleListItemDto[];
};

export default function RelatedArticles({ articles }: Props) {
  if (!articles) return null;

  const variant = imageVariants.hero;

  return (
    <section className="container py-10 lg:py-14">
      <div className="mb-6">
        <h2 className="text-accent text-2xl font-semibold lg:text-3xl">
          Пов’язані статті
        </h2>
        <p className="text-app mt-2 text-sm">
          Матеріали, що доповнюють цю послугу
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <AppLink
            key={article.id}
            href={`/blog/${article.slug}`}
            className="border-border bg-card group rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {article.src?.[0] && (
              <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                <NextImage
                  as={CldImage}
                  src={article.src[0]}
                  alt={article.title}
                  fill
                  sizes={variant.sizes}
                  useSkeleton
                  preload
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-4">
              <h3 className="text-accent line-clamp-2 text-base font-semibold">
                {article.title}
              </h3>

              <p className="text-app mt-2 line-clamp-3 text-sm">
                {article.summary}
              </p>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
