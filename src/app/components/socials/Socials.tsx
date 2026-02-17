'use client';

import Link from 'next/link';

import { iconLibrary } from '@/app/resources/icons';
import { social } from '@/resources/content';

import type { IconName } from '@/app/resources/icons';

const Socials = () => {
  const essential = social.filter(s => s.essential && s.link);
  const secondary = social.filter(s => !s.essential && s.link);

  const renderIcon = (name: IconName) => {
    const Icon = iconLibrary[name];
    return <Icon className="h-5 w-5" aria-hidden />;
  };

  return (
    <div className="hidden bg-black pb-3 text-white sm:block">
      <div className="container flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-col gap-2">
          {essential.map(item => (
            <li key={`${item.icon}-${item.link}`}>
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {renderIcon(item.icon as IconName)}
                <span className="nav">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-2 sm:items-end">
          {secondary.map(item => (
            <li key={`${item.icon}-${item.link}`}>
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span className="nav">{item.name}</span>
                {renderIcon(item.icon as IconName)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Socials;
