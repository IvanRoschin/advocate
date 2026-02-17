import Link from 'next/link';

import { logo } from '@/resources/content';
import { NextImage } from '../common';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  const src = variant === 'dark' ? `${logo.logoBlack}` : `${logo.logoWhite}`;

  return (
    <Link
      href="/"
      className="relative block h-20 w-35 shrink-0 sm:w-40 lg:w-50"
      aria-label="Go to homepage"
    >
      <NextImage
        useSkeleton
        src={src}
        alt="Company logo"
        fill
        priority
        sizes="(max-width: 640px) 140px,
               (max-width: 1024px) 160px,
               200px"
        className="object-contain"
      />
    </Link>
  );
};

Logo.displayName = 'Logo';

export default Logo;
