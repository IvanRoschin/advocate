import {
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTelegram,
  FaViber,
} from 'react-icons/fa6';
import { HiEnvelope } from 'react-icons/hi2';

import { AppLink } from '@/components';
import { social } from '@/resources/content';

import type { IconName } from '@/app/resources/icons';

// Small fixed map of just the icons `social` ever references, not the full
// `iconLibrary` barrel (60+ icons, including admin-only ones) — same
// reasoning as nav.public.ts. This component renders on every page.
const socialIcons = {
  email: HiEnvelope,
  phone: FaPhone,
  telegram: FaTelegram,
  viber: FaViber,
  instagram: FaInstagram,
  facebook: FaFacebook,
} satisfies Partial<Record<IconName, unknown>>;

const Socials = () => {
  const essential = social.filter(
    s => s.essential && s.link && s.visible !== false
  );
  const secondary = social.filter(
    s => !s.essential && s.link && s.visible !== false
  );

  const renderIcon = (name: IconName) => {
    const Icon = socialIcons[name as keyof typeof socialIcons];
    if (!Icon) return null;
    return <Icon className="h-5 w-5" aria-hidden />;
  };

  // tel:/viber:/mailto: не відкриваємо в новій вкладці — лише http(s).
  const linkProps = (link: string) =>
    /^https?:/.test(link)
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

  return (
    <div className="bg-socials text-socials socials-divider hidden sm:block">
      <div className="container flex items-center justify-between gap-6 py-2 lg:py-3">
        {/* Телефони: в рядок на планшеті, у стовпчик (2 рядки) на десктопі */}
        <ul className="socials-link flex items-center gap-x-6 gap-y-1 lg:flex-col lg:items-start">
          {essential.map(item => (
            <li key={`${item.icon}-${item.link}`}>
              <AppLink
                href={item.link}
                {...linkProps(item.link)}
                className="flex items-center gap-2 text-sm lg:text-base"
              >
                {renderIcon(item.icon as IconName)}
                <span className="nav">{item.name}</span>
              </AppLink>
            </li>
          ))}
        </ul>

        {/*
          Месенджери та соцмережі:
          - планшет: лише іконки в рядок (компактно);
          - десктоп (lg+): сітка 2×2 з назвами — висота як у блоку телефонів.
        */}
        <ul className="flex items-center gap-4 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-1">
          {secondary.map(item => (
            <li key={`${item.icon}-${item.link}`}>
              <AppLink
                href={item.link}
                {...linkProps(item.link)}
                aria-label={item.name}
                title={item.name}
                className="flex items-center gap-2 lg:justify-end"
              >
                <span className="nav hidden lg:inline">{item.name}</span>
                {renderIcon(item.icon as IconName)}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Socials;
