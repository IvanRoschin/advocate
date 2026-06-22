import {
  getArticleCategoriesWithCounts,
  getArticlesPublicList,
  getRecentArticlesPublic,
} from '@/app/actions/article.actions';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
import {
  blogLayout,
  BlogLayoutNode,
} from '@/app/resources/content/pages/blog.layout';

import { BLOG_SECTIONS } from './_components/blog.sections';

type BlogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;

  const [list, recent, categories] = await Promise.all([
    getArticlesPublicList({ categorySlug: category }),
    getRecentArticlesPublic(5),
    getArticleCategoriesWithCounts(),
  ]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: blogLayout as BlogLayoutNode[],
        sections: BLOG_SECTIONS,
        sectionProps: {
          category,
          initialItems: list.items,
          hasMore: list.hasMore,
          recent,
          categories,
        },
      })}
    </main>
  );
}
