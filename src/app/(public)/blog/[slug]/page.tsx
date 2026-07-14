import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { articlePublicActions } from '@/app/actions/article.actions';
import { pageSettingsActions } from '@/app/actions/page-settings.actions';
import { reviewPublicActions } from '@/app/actions/review.actions';
import PublicReviewForm from '@/app/components/forms/public/PulicReviewForm';
import { baseUrl } from '@/app/config/routes';
import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { LayoutNode, renderLayout } from '@/app/lib/layouts/renderLayout';
import { parseArticleContent } from '@/lib/toc/parseArticleContent';

import {
  BLOG_ARTICLE_SECTIONS,
  BlogArticleSectionProps,
} from './_components/article.sections';
import { estimateReadTimeFromHtml } from './_components/readTime';

import type { ArticleSectionKey } from '@/app/types';
type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await articlePublicActions.findBySlug(slug);

  if (!article) return {};

  const cover = article.src?.[0];
  const isDraft = article.status === 'draft' || !article.publishedAt;

  return buildMetadata({
    title: article.title,
    description: article.subtitle ?? article.summary ?? undefined,
    path: `/blog/${article.slug}`,
    imageUrl: cover ?? '/images/ivan_roschin.webp',
    ogType: 'article',
    openGraph: {
      publishedTime: article.publishedAt?.toString() ?? undefined,
      modifiedTime:
        article.updatedAt?.toString() ??
        article.publishedAt?.toString() ??
        undefined,
      section: article.category?.title ?? undefined,
    },
    extra: {
      robots: isDraft ? { index: false, follow: false } : undefined,
    },
  });
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof articlePublicActions.findBySlug>>;

  try {
    article = await articlePublicActions.findBySlug(slug);
  } catch {
    notFound();
  }
  if (!article) {
    notFound();
  }

  const cover = article.src?.[0];
  const url = new URL(`/blog/${article.slug}`, baseUrl).toString();

  const { minutes } = estimateReadTimeFromHtml(article.content);
  const { html, toc } = parseArticleContent(article.content);

  const related = article.category?.id
    ? await articlePublicActions.related({
        categoryId: article.category.id,
        excludeSlug: article.slug,
        limit: 6,
      })
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.subtitle ?? article.summary ?? undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
    mainEntityOfPage: url,
    image: cover ? [cover] : undefined,
    author: {
      '@type': 'Person',
      name: 'Іван Рощин',
    },
    articleSection: article.category?.title ?? undefined,
    keywords: article.tags?.length ? article.tags.join(', ') : undefined,
  };

  const reviewsRow = await reviewPublicActions.list({
    targetType: 'article',
    targetId: article.id,
  });
  const reviews = reviewsRow.items;

  const sectionProps: BlogArticleSectionProps = {
    article,
    html,
    minutes,
    toc,
    related,
    url,
    reviews,
    reviewForm: <PublicReviewForm targetType="article" targetId={article.id} />,
  };
  const layout = (await pageSettingsActions.getLayout(
    'article'
  )) as readonly LayoutNode<ArticleSectionKey>[];
  if (!layout) {
    notFound();
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-background text-foreground min-h-screen">
        {renderLayout<ArticleSectionKey, BlogArticleSectionProps>({
          layout,
          sections: BLOG_ARTICLE_SECTIONS,
          sectionProps,
        })}
      </main>
    </>
  );
}
