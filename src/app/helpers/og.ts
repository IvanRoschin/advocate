import { baseUrl } from '@/app/config/routes';

export function buildOgImageUrl(params: {
  title: string;
  subtitle?: string;
  tag?: string;
}) {
  const u = new URL('/api/og', baseUrl);
  u.searchParams.set('title', params.title);
  if (params.subtitle) u.searchParams.set('subtitle', params.subtitle);
  if (params.tag) u.searchParams.set('tag', params.tag);
  return u.toString();
}
