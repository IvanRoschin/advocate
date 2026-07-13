import { logo } from '@/resources/content';
import { AppLink } from '@/components';
import { NextImage } from '../common';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  const src = variant === 'dark' ? `${logo.logoBlack}` : `${logo.logoWhite}`;

  return (
    <AppLink
      href="/"
      className="relative block h-12 w-40 shrink-0 2xl:h-14"
      aria-label="Go to homepage"
    >
      <NextImage
        src={src}
        alt="Company logo"
        fill
        preload
        sizes="160px"
        className="object-contain"
      />
    </AppLink>
  );
};

Logo.displayName = 'Logo';

export default Logo;
