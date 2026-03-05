import Link from 'next/link';

import { SubscribeForm } from '@/app/components/forms';
import { cn } from '@/app/lib';

import type { BlogCategoryItemDto, BlogRecentPostItemDto } from '@/app/types';
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
      {/* Categories */}
      <section className="p-4">
        <p className="text-accent mb-2 text-lg font-semibold">Категорії</p>

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
            <p className="text-muted-foreground text-sm">Немає категорій</p>
          )}
        </nav>
      </section>

      {/* Subscribe */}
      <section className="p-4">
        <p className="text-accent mb-2 text-lg font-semibold">
          Інформаційна розсилка
        </p>
        <p className="text-muted-foreground mb-4 text-sm">
          Отримуйте нові статті та практичні нотатки.
        </p>
        <SubscribeForm variant="aside" />
      </section>

      {/* Recent posts */}
      <section className="p-4">
        <p className="text-accent mb-2 text-lg font-semibold">Недавні записи</p>

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
            <li className="text-muted-foreground text-sm">Немає записів</li>
          )}
        </ul>
      </section>
    </>
  );
}
