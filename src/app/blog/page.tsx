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
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <main className="w-full lg:max-w-[80%] lg:flex-[0_0_80%]">
        <ArticleListPreview items={items} baseHref="/blog" />
      </main>

      <aside className="border-accent w-full lg:max-w-[20%] lg:flex-[0_0_20%] lg:border-l-2 lg:pl-6">
        <div className="space-y-6 lg:sticky lg:top-6">
          <BlogAside
            recent={recent}
            categories={categories}
            activeCategory={category ?? ''}
          />
        </div>
      </aside>
    </div>
  );
}
