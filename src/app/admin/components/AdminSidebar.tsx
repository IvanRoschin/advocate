'use client';

import { memo } from 'react';

import { useNavItems } from '@/app/components/header/nav.shared';
import { AppLink } from '@/components';

const AdminSidebar = memo(() => {
  const items = useNavItems('admin');

  return (
    <aside className="bg-surface-input sticky top-0 h-screen w-64 border-r border-gray-200 p-6">
      <h2 className="text-accent mb-6 text-xl font-semibold">Админка</h2>

      <nav className="flex flex-col gap-2">
        {items.map(({ key, href, label, Icon }) => (
          <AppLink
            key={key}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-neutral-100 dark:hover:bg-white/10"
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </AppLink>
        ))}
      </nav>
    </aside>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
