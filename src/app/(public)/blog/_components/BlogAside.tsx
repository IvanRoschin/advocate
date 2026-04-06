import Link from 'next/link';

import { SubscribeForm } from '@/app/components/forms';
import { cn } from '@/app/lib';
import { blog } from '@/app/resources/content';
import { BlogCategoryItemDto, BlogRecentPostItemDto } from '@/app/types';

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function BlogAside({
  categories,
  recent,
  activeCategory,
}: {
  categories: BlogCategoryItemDto[];
  recent: BlogRecentPostItemDto[];
  activeCategory?: string;
}) {
  return (
    <>
      <section className="p-4">
        <p className="text-accent mb-2 text-lg font-semibold">
          {blog.aside.categoriesTitle}
        </p>

        <nav className="space-y-2">
          {categories.length ? (
            categories.map(c => (
              <Link
                key={c.id}
                href={`/blog?category=${c.slug}`}
                className={cn(
                  'flex items-center justify-between text-sm hover:underline',
                  activeCategory === c.slug && 'text-accent font-semibold'
                )}
              >
                <span className="truncate">{c.title}</span>
                <span className="text-muted-foreground text-xs">{c.count}</span>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              {blog.aside.emptyCategories}
            </p>
          )}
        </nav>
      </section>

      <section className="p-4">
        <p className="text-accent mb-2 text-lg font-semibold">
          {blog.aside.newsletterTitle}
        </p>
        <p className="text-muted-foreground mb-4 text-sm leading-6">
          {blog.aside.newsletterDescription}
        </p>
        <SubscribeForm variant="aside" />
      </section>

      <section className="p-4">
        <p className="text-accent mb-2 text-lg font-semibold">
          {blog.aside.recentTitle}
        </p>

        <ul className="space-y-3">
          {recent.length ? (
            recent.map(p => (
              <li key={p.id}>
                <Link
                  className="nav block text-sm"
                  href={`/blog/${p.slug || p.id}`}
                >
                  {p.title}
                </Link>

                {p.publishedAt ? (
                  <p className="text-muted-foreground text-xs">
                    {formatDate(p.publishedAt)}
                  </p>
                ) : null}
              </li>
            ))
          ) : (
            <li className="text-muted-foreground text-sm">
              {blog.aside.emptyRecent}
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
