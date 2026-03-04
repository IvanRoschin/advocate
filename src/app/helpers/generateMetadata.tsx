import type { Metadata } from 'next';

import { baseUrl } from '@/app/config/routes';

type OgType = 'website' | 'article';

type OgImages = NonNullable<
  Exclude<Metadata['openGraph'], null | undefined>['images']
>;

export type OpenGraphExtras = {
  // базовые
  type?: OgType;
  locale?: string;
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  images?: OgImages;

  // ✅ article-specific (в Next это существует, но из union не вытаскивалось)
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: string | URL | Array<string | URL> | null;
  section?: string | string[];
  tags?: string | string[];
};

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  /** relative path like "/blog/my-post" */
  path?: string;
  siteName?: string;

  /** can be absolute ("https://...") or relative ("/images/...") */
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;

  /** allow switching OG type for blog articles */
  ogType?: OgType;

  /** optional canonical override; if not provided, uses resolved pageUrl */
  canonical?: string;

  /** ✅ additions for openGraph without forcing `type` */
  openGraph?: OpenGraphExtras;

  /** ✅ additional metadata (robots/icons/verification/etc.) */
  extra?: Omit<Partial<Metadata>, 'openGraph' | 'twitter' | 'alternates'> & {
    alternates?: Metadata['alternates'];
    twitter?: Partial<NonNullable<Metadata['twitter']>>;
  };
}

const normalizeSiteUrl = (url: string) => url.replace(/\/$/, '');

const toAbsoluteUrl = (url: string, siteUrl: string) =>
  url.startsWith('http') ? url : new URL(url, siteUrl).toString();

/**
 * ✅ Refactored SEO helper:
 * - Single source of truth: baseUrl
 * - Absolute canonical + OG/Twitter URLs
 * - Safe merge openGraph/twitter/alternates (no overwrites of base fields)
 * - Allows openGraph extras WITHOUT requiring `type`
 */
export function generateMetadata({
  title = 'Адвокат Іван Рощин — професійна правнича допомога в Києві',
  description = 'Адвокат Іван Рощин: професійна правнича допомога у цивільних, господарських та адміністративних справах. Захист прав, консультації, представництво в суді.',
  keywords = [
    'адвокат Київ',
    'адвокат Ірпінь',
    'адвокат Іван Рощин Київ',
    'юрист Київ',
    'юридична допомога Київ',
    'правова допомога Київ',
    'представництво в суді Київ',
    'сімейний адвокат Київ',
    'сімейний адвокат Ірпінь',
    'цивільний адвокат Київ',
    'цивільний адвокат Ірпінь',
    'спадковий адвокат Київ',
    'спадковий адвокат Ірпінь',
    'адвокат по спадщині Київ',
    'адвокат по спадщині Ірпінь',
    'цивільні справи',
    'адміністративні справи',
    'консультація адвоката Київ',
  ],
  path = '/',
  siteName = 'Адвокат Іван Рощин',
  imageUrl = '/images/ivan_roschin.webp',
  imageWidth = 680,
  imageHeight = 1024,
  imageAlt = 'Адвокат Іван Рощин — юридична допомога',
  ogType = 'website',
  canonical,
  openGraph,
  extra = {},
}: MetadataProps): Metadata {
  const siteUrl = normalizeSiteUrl(baseUrl);
  const pageUrl = new URL(path, siteUrl).toString();

  const fullImageUrl = toAbsoluteUrl(imageUrl, siteUrl);
  const canonicalUrl = canonical ? toAbsoluteUrl(canonical, siteUrl) : pageUrl;

  // базовая картинка (можно заменить через openGraph.images)
  const defaultOgImages: NonNullable<
    NonNullable<Metadata['openGraph']>['images']
  > = [
    {
      url: fullImageUrl,
      width: imageWidth,
      height: imageHeight,
      alt: imageAlt,
    },
  ];

  // ✅ базовый OG (гарантируем type)
  const baseOpenGraph: NonNullable<Metadata['openGraph']> = {
    type: ogType,
    locale: 'uk_UA',
    title,
    description,
    url: pageUrl,
    siteName,
    images: defaultOgImages,
  };

  const baseTwitter: NonNullable<Metadata['twitter']> = {
    card: fullImageUrl ? 'summary_large_image' : 'summary',
    title,
    description,
    images: fullImageUrl ? [fullImageUrl] : undefined,
  };

  // ✅ мерджим OG: type всегда будет (из ogType или openGraph.type)
  const mergedOpenGraph: NonNullable<Metadata['openGraph']> = {
    ...baseOpenGraph,
    ...(openGraph ?? {}),
    type: openGraph?.type ?? ogType,
    images: openGraph?.images ?? baseOpenGraph.images,
  };

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,

    alternates: {
      canonical: canonicalUrl,
      ...(extra.alternates ?? {}),
    },

    openGraph: mergedOpenGraph,

    twitter: {
      ...baseTwitter,
      ...(extra.twitter ?? {}),
    },

    ...extra,
  };
}
