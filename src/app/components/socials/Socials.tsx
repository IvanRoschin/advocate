'use client';

import { iconLibrary } from '@/app/resources/icons';
import { AppLink } from '@/components';
import { social } from '@/resources/content';

import type { IconName } from '@/app/resources/icons';

const Socials = () => {
  const essential = social.filter(
    s => s.essential && s.link && s.visible !== false
  );
  const secondary = social.filter(
    s => !s.essential && s.link && s.visible !== false
  );

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
