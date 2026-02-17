import type { MetadataRoute } from 'next';

import { baseUrl, routes } from '@/app/config/routes';

/**
 * Берём только реальные страницы (строки, начинающиеся с "/"),
 * игнорируем якоря "#..." и любые вложенные объекты.
 */
const collectPublicPaths = (): string[] => {
  const result: string[] = [];

  const walk = (node: unknown) => {
    if (!node) return;

    if (typeof node === 'string') {
      if (node.startsWith('/')) result.push(node);
      return;
    }

    if (typeof node === 'object') {
      for (const v of Object.values(node as Record<string, unknown>)) {
        // пропускаем функции вроде article: (slug) => `/blog/${slug}`
        if (typeof v === 'function') continue;
        walk(v);
      }
    }
  };

  walk(routes.public);

  // Убираем /not-found из sitemap (обычно не индексируют)
  return Array.from(new Set(result)).filter(p => p !== routes.public.notFound);
};

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = collectPublicPaths();

  return paths.map(path => ({
    url: `${baseUrl}${path === '/' ? '' : path}`,
    lastModified: new Date(),
  }));
}
