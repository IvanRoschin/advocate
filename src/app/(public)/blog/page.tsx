import { articlePublicActions } from '@/app/actions/article.actions';
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
    articlePublicActions.list({ categorySlug: category }),
    articlePublicActions.recent(5),
    articlePublicActions.categories(),
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
