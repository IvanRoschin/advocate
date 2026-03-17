'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

import { routes } from '@/app/config/routes';
import { AppLink } from '@/components';

const customNames: Record<string, string> = {
  blog: 'Блог',
  category: 'Категорія',
  services: 'Послуги',
  contact: 'Контакти',
  admin: 'Адмінка',
  users: 'Адміни',
  categories: 'Категорії',
  testimonials: 'Відгуки',
  slider: 'Слайди',
  search: 'Пошук',
  'suprovid-pry-rozluchenni': 'Супровід при розлученні',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Breadcrumbs() {
  const pathname = usePathname();

  const [titleBySlug, setTitleBySlug] = useState<Record<string, string>>({});

  const segments = useMemo(
    () =>
      pathname
        .split('/')
        .filter(Boolean)
        .map(seg => decodeURIComponent(seg)),
    [pathname]
  );

  const last = segments[segments.length - 1] ?? '';
  const isBlogSlug = segments[0] === 'blog' && segments.length >= 2;

  useEffect(() => {
    if (!isBlogSlug || !last) return;

    // если уже есть в кэше — не дергаем сеть
    if (titleBySlug[last]) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/v1/articles/title/${encodeURIComponent(last)}`,
          {
            cache: 'force-cache',
            signal: controller.signal,
          }
        );

        if (!res.ok) return;

        const data: { title: string } = await res.json();

        // ✅ setState только после async (это не вызывает warning)
        setTitleBySlug(prev => {
          if (prev[last] === data.title) return prev;
          return { ...prev, [last]: data.title };
        });
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;

        console.error('Breadcrumbs fetch error', e);
      }
    })();

    return () => controller.abort();
  }, [isBlogSlug, last, titleBySlug]);

  const crumbs = useMemo(() => {
    return segments.map((segment, idx) => {
      const isLast = idx === segments.length - 1;
      const href = '/' + segments.slice(0, idx + 1).join('/');

      let name = customNames[segment] || capitalize(segment.replace(/-/g, ' '));

      // ✅ если это последняя крошка в /blog/[slug] и есть title — подменяем
      if (isLast && isBlogSlug) {
        name = titleBySlug[segment] ?? name;
      }

      return { name, href };
    });
  }, [segments, isBlogSlug, titleBySlug]);

  return (
    <nav aria-label="breadcrumbs" className="mb-4 text-sm text-gray-600">
      <ol className="flex flex-wrap items-center space-x-2">
        <li>
          <AppLink
            href={routes.public.home}
            className="nav text-gray-600 hover:text-gray-600"
          >
            Головна
          </AppLink>
        </li>

        {crumbs.map((crumb, idx) => {
          const isLastCrumb = idx === crumbs.length - 1;

          return (
            <li key={crumb.href + idx} className="flex items-center space-x-2">
              <FaChevronRight className="mx-1 text-xs text-gray-400" />
              {isLastCrumb ? (
                <span className="text-gray-900" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <AppLink
                  href={crumb.href}
                  className="nav text-gray-600 hover:text-gray-600"
                >
                  {crumb.name}
                </AppLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
