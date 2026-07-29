import type { NextConfig } from 'next';

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    pathname: '/dh6obdnyz/**',
  },
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
    pathname: '**',
  },
];

// Only needed for local dev (e.g. previewing images served from localhost);
// production builds shouldn't allow an image host that only exists on a
// developer's machine.
if (process.env.NODE_ENV !== 'production') {
  remotePatterns.push({
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
    pathname: '**',
  });
}

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns,
  },

  // 301-редиректы со старых WordPress-URL (roschin.com.ua) на новые пути.
  // Карта построена по факту через wp-sitemap-*.xml старого сайта — при
  // добавлении/переименовании услуг в БД (Service.slug) сверяйте с ней.
  async redirects() {
    return [
      // Общие страницы
      { source: '/practise-areas', destination: '/services', permanent: true },
      { source: '/posluhy', destination: '/services', permanent: true },
      { source: '/blog-2', destination: '/blog', permanent: true },
      {
        source: '/oplaty-posluhy',
        destination: '/payments',
        permanent: true,
      },
      {
        source: '/polityka-konfidentsijnosti',
        destination: '/privacy-policy',
        permanent: true,
      },
      { source: '/oferta-2', destination: '/offer', permanent: true },

      // Мусорные/дублирующие страницы WP
      { source: '/sample-page-2', destination: '/', permanent: true },
      { source: '/doma', destination: '/', permanent: true }, // дубль главной (RU)

      // Услуги: старый WP-slug -> новый Service.slug
      {
        source: '/rozirvannia-shliubu',
        destination: '/services/suprovid-pry-rozluchenni',
        permanent: true,
      },
      {
        source: '/stiahnennia-alimentiv',
        destination: '/services/styahnennya-alimentiv',
        permanent: true,
      },
      {
        source: '/podil-majna-podruzhzhia',
        destination: '/services/podil-mayna-podruzhzhya',
        permanent: true,
      },
      {
        source: '/dogovirna-robota',
        destination: '/services/perevirka-ta-analiz-dohovoriv',
        permanent: true,
      },
      {
        source: '/perevirka-ob-iektiv-nerukhomosti',
        destination: '/services/perevirka-nerukhomosti-pered-kupivleyu',
        permanent: true,
      },
      {
        source: '/robota-z-borzhnykamy',
        destination: '/services/styahnennya-borhu',
        permanent: true,
      },
      // TODO: этих двух услуг нет среди Service.slug в новой БД —
      // пока ведём на каталог услуг, уточните целевую страницу, если
      // услуги возвращаются в ассортимент.
      {
        source: '/pozbavlennia-batkivskykh-prav',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/reiestratsiia-biznesu',
        destination: '/services',
        permanent: true,
      },

      // Статьи блога и лендинг с коммерческим интентом
      {
        source: '/ia',
        destination: '/blog?category=simeyni-spory',
        permanent: true,
      },
      {
        source: '/bank-podav-do-sudu-choho-ochikuvaty',
        destination: '/blog?category=bankivski-spory',
        permanent: true,
      },
      {
        source: '/advokat-z-rozluchen-v-kyievi',
        destination: '/services/suprovid-pry-rozluchenni',
        permanent: true,
      },

      // Категории блога
      {
        source: '/category/simejni-spory',
        destination: '/blog?category=simeyni-spory',
        permanent: true,
      },
      {
        source: '/category/spory-z-bankamy',
        destination: '/blog?category=bankivski-spory',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
