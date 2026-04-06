import { renderLayout } from '@/app/lib/layouts/renderLayout';
import { articleService } from '@/app/lib/services/article.service';
import {
  blogLayout,
  BlogLayoutNode,
} from '@/app/resources/content/pages/blog.layout';
import { BLOG_SECTIONS, BlogSectionProps } from './_components/blog.sections';

type BlogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;

  const [items, recent, categories] = await Promise.all([
    articleService.getPublicList({ categorySlug: category }),
    articleService.getRecentPublic(5),
    articleService.getPublicCategoriesWithCounts(),
  ]);

  const sectionProps: BlogSectionProps = {
    category,
    items,
    recent,
    categories,
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: blogLayout as BlogLayoutNode[],
        sections: BLOG_SECTIONS,
        sectionProps,
        renderGroup: ({ node, children, index }) => (
          <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              {children}
            </div>
          </div>
        ),
      })}
    </main>
  );
}
