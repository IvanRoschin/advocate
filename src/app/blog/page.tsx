import { articleService } from '@/app/lib/services/article.service';
import { blog } from '@/app/resources/content';

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
        <div className="mb-8 max-w-3xl">
          <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
            {blog.eyebrow}
          </p>

          <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
            {blog.heading}
          </h1>

          <p className="text-app mt-4 text-base leading-7">{blog.lead}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="min-w-0">
            <ArticleListPreview items={items} baseHref={blog.path} />
          </section>

          <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
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
