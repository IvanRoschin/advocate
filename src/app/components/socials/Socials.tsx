'use client';

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

  return (
    <div className="bg-socials text-socials socials-divider hidden pb-3 sm:block">
      <div className="container flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <ul className="socials-link flex flex-col items-center gap-2">
          {essential.map(item => (
            <li key={`${item.icon}-${item.link}`}>
              <AppLink
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {renderIcon(item.icon as IconName)}
                <span className="nav">{item.name}</span>
              </AppLink>
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-2 sm:items-end">
          {secondary.map(item => (
            <li key={`${item.icon}-${item.link}`}>
              <AppLink
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span className="nav">{item.name}</span>
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
