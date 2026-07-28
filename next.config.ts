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
};

export default nextConfig;
