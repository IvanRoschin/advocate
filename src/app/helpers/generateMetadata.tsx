import type { Metadata } from 'next';

import { baseUrl } from '@/app/config/routes';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  siteName?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  extra?: Partial<Metadata>;
}

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
  extra = {},
}: MetadataProps): Metadata {
  const siteUrl = baseUrl; // <-- единый источник
  const pageUrl = new URL(path, siteUrl).toString();

  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : new URL(imageUrl, siteUrl).toString();

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,

    openGraph: {
      type: 'website',
      locale: 'uk_UA',
      title,
      description,
      url: pageUrl, // <-- важно
      siteName,
      images: [
        {
          url: fullImageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },

    ...extra,
  };
}
