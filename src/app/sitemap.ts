import type { MetadataRoute } from 'next';

import { articlePublicActions } from '@/app/actions/article.actions';
import { servicePublicActions } from '@/app/actions/service.actions';
import { baseUrl, routes } from '@/app/config/routes';

// Regenerate the sitemap at most once an hour so new services and
// articles from the admin panel show up without a redeploy.
export const revalidate = 3600;

// auth-страницы (signin/register/...) не индексируем
const AUTH_PATHS = new Set<string>(Object.values(routes.public.auth));

// Large enough to fetch every published item in one page.
const MAX_ITEMS = 1000;

/**
 * Берём только реальные страницы (строки, начинающиеся с "/"),
 * игнорируем якоря "#...", auth-страницы и любые вложенные объекты.
 */
const collectPublicPaths = (): string[] => {
  const result: string[] = [];

  const walk = (node: unknown) => {
    if (!node) return;

    if (typeof node === 'string') {
      if (node.startsWith('/') && !node.includes('#') && !AUTH_PATHS.has(node)) {
        result.push(node);
      }
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

const toUrl = (path: string) => `${baseUrl}${path === '/' ? '' : path}`;

const toDate = (value?: string) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = collectPublicPaths().map(
    path => ({
      url: toUrl(path),
      lastModified: new Date(),
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1 : 0.6,
    })
  );

  // Both actions fall back to an empty list at build time / on DB errors,
  // so the sitemap never fails — it just contains fewer URLs.
  const [services, articles] = await Promise.all([
    servicePublicActions.list({ limit: MAX_ITEMS }),
    articlePublicActions.list({ limit: MAX_ITEMS }),
  ]);

  const serviceEntries: MetadataRoute.Sitemap = services.items.map(s => ({
    url: toUrl(`/services/${s.slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.items.map(a => ({
    url: toUrl(`/blog/${a.slug}`),
    lastModified: toDate(a.updatedAt) ?? toDate(a.publishedAt) ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const seen = new Set<string>();
  return [...staticEntries, ...serviceEntries, ...articleEntries].filter(
    entry => {
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    }
  );
}
