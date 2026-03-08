import { articleService } from '@/app/lib/services/article.service';

import { ArticleListPreview } from './_components/ArticleListPreview';
import BlogAside from './_components/BlogAside';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [items, recent, categories] = await Promise.all([
    articleService.getPublicList({ categorySlug: category }),
    articleService.getRecentPublic(5),
    articleService.getPublicCategoriesWithCounts(),
  ]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="container py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="min-w-0">
            <ArticleListPreview items={items} baseHref="/blog" />
          </section>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <BlogAside
              recent={recent}
              categories={categories}
              activeCategory={category ?? ''}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
