import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextImage } from '@/app/components';
import { baseUrl } from '@/app/config/routes';
import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { articleService } from '@/app/lib/services/article.service';
import { Badge } from '@/components/ui/badge';
import { parseArticleContent } from '@/lib/toc/parseArticleContent';
import { ArticleListPreview } from '../_components/ArticleListPreview';
import { ShareSection } from '../_components/ShareSection';
import ArticleContent from '../ArticleContent';
import ArticleToc from '../ArticleToc';
import { estimateReadTimeFromHtml } from '../readTime';

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const article = await articleService.getPublicBySlug(slug);
  const cover = article.src?.[0];

  // Публичный метод отдаёт published, но оставим защиту на случай данных
  const isDraft = article.status === 'draft' || !article.publishedAt;

  return buildMetadata({
    title: article.title,
    description: article.subtitle ?? article.summary ?? undefined,
    path: `/blog/${article.slug}`,
    imageUrl: cover ?? '/images/ivan_roschin.webp',
    ogType: 'article',
    openGraph: {
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? article.publishedAt ?? undefined,
      section: article.category?.title ?? undefined,
    },
    extra: {
      robots: isDraft ? { index: false, follow: false } : undefined,
    },
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof articleService.getPublicBySlug>>;
  try {
    article = await articleService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const cover = article.src?.[0];
  const url = new URL(`/blog/${article.slug}`, baseUrl).toString();

  const { minutes } = estimateReadTimeFromHtml(article.content);
  const { html, toc } = parseArticleContent(article.content);

  const related = article.category?.id
    ? await articleService.getRelatedPublicByCategory({
        categoryId: article.category.id,
        excludeSlug: article.slug,
        limit: 6,
      })
    : [];

  // ✅ JSON-LD (точнее для блога: BlogPosting)
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
        <main className="min-w-0">
          <article className="min-w-0">
            <header className="space-y-3">
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

                <span className="text-accent text-sm">
                  ≈ {minutes} хв читання
                </span>
              </div>

              <h1 className="text-accent text-3xl font-semibold tracking-tight">
                {article.title}
              </h1>

              {article.subtitle ? (
                <p className="text-muted-foreground italic">
                  {article.subtitle}
                </p>
              ) : null}

              {/* ✅ Mobile TOC */}
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
                <div className="bg-muted relative mt-4 aspect-16/7 w-full overflow-hidden rounded-xl">
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

            <section className="mt-8">
              <ArticleContent html={html} />
            </section>

            <ShareSection title={article.title} url={url} />

            {related.length ? (
              <section className="mt-12">
                <h2 className="text-accent mb-4 text-lg font-semibold">
                  Ще з цієї категорії
                </h2>
                <ArticleListPreview items={related} baseHref="/blog" />
              </section>
            ) : null}
          </article>
        </main>

        {/* Desktop TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <ArticleToc items={toc} />
          </div>
        </aside>
      </div>
    </>
  );
}
