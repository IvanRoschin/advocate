import { articlePublicActions } from '@/app/actions/article.actions';
import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
import {
  blogLayout,
  BlogLayoutNode,
} from '@/app/resources/content/pages/blog.layout';

import { BLOG_SECTIONS } from './_components/blog.sections';

import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Блог адвоката | Іван Рощин',
  description:
    'Статті адвоката Івана Рощина про цивільне, господарське та адміністративне право: практичні поради, роз’яснення законодавства, судова практика.',
  path: '/blog',
  imageUrl: '/images/ivan_roschin.webp',
});

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
