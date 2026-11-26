import { articlePublicActions } from '@/app/actions/article.actions';
import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
import { BLOG_PAGE_SIZE } from '@/app/resources/content';
import {
  blogLayout,
  BlogLayoutNode,
} from '@/app/resources/content/pages/blog.layout';

import { BLOG_SECTIONS } from './_components/blog.sections';

import type { Metadata } from 'next';

const BLOG_TITLE = 'Блог адвоката | Іван Рощин';
const BLOG_DESCRIPTION =
  'Статті адвоката Івана Рощина про цивільне, господарське та адміністративне право: практичні поради, роз’яснення законодавства, судова практика.';

type BlogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

/**
 * /blog?category=… — відфільтрований список, а не окрема сторінка.
 * Раніше canonical вказував на /blog при іншому вмісті, і Google обирав
 * власну канонічну («канонічні версії, вибрані Google і користувачем,
 * не збігаються»). Тепер: self-canonical + noindex,follow — фільтри не
 * індексуються, а посилання на статті з них Google проходить.
 */
export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { category } = await searchParams;

  if (!category) {
    return buildMetadata({
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      path: '/blog',
      imageUrl: '/images/ivan_roschin.webp',
    });
  }

  const path = `/blog?category=${encodeURIComponent(category)}`;
  return buildMetadata({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    path,
    canonical: path,
    imageUrl: '/images/ivan_roschin.webp',
    extra: { robots: { index: false, follow: true } },
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;

  const [list, recent, categories] = await Promise.all([
    articlePublicActions.list({
      categorySlug: category,
      limit: BLOG_PAGE_SIZE,
    }),
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
