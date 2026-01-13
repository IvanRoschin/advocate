import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  const src =
    variant === 'dark' ? '/logo_black_bg.webp' : '/logo_white_bg.webp';

  return (
    <Link
      href="/"
      className="relative block h-20 w-35 shrink-0 sm:w-40 lg:w-50"
      aria-label="Go to homepage"
    >
      <Image
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
