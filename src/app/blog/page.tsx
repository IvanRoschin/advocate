import { articleService } from '@/app/lib/services/article.service';
import {
  blogLayout,
  BlogLayoutNode,
} from '@/app/resources/content/pages/blog.layout';

import { BLOG_SECTIONS, BlogSectionProps } from './_components/blog.sections';

type BlogPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
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

  const renderSection = (
    key: keyof typeof BLOG_SECTIONS,
    uniqueKey: string
  ) => {
    const Section = BLOG_SECTIONS[key];

    return <Section key={uniqueKey} {...sectionProps} />;
  };

  const renderNode = (node: BlogLayoutNode, index: number) => {
    if (!node.display) return null;

    if (node.type === 'section') {
      return renderSection(node.key, `${node.key}-${index}`);
    }

    return (
      <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {node.items.map((item, itemIndex) =>
            item.display
              ? renderSection(item.key, `${node.key}-${item.key}-${itemIndex}`)
              : null
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      {blogLayout.map(renderNode)}
    </main>
  );
}
