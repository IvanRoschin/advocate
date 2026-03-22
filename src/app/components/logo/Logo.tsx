import { AppLink } from '@/components';
import { logo } from '@/resources/content';

import { NextImage } from '../common';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  const src = variant === 'dark' ? `${logo.logoBlack}` : `${logo.logoWhite}`;

  return (
    <AppLink href="/" className="block shrink-0" aria-label="Go to homepage">
      <NextImage
        useSkeleton
        src={src}
        alt="Company logo"
        width={200}
        height={60}
        priority
        className="h-12 w-auto object-contain 2xl:h-14"
      />
    </AppLink>
  );
};

Logo.displayName = 'Logo';

export default Logo;
