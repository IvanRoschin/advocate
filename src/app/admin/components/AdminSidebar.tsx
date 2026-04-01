'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { memo } from 'react';

import { useNavItems } from '@/app/components/header/nav.shared';
import { cn } from '@/app/lib/utils';
import { AppLink } from '@/components';

const AdminSidebar = memo(() => {
  const items = useNavItems('admin');

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/signin',
    });
  };

  return (
    <aside className="bg-surface-input sticky top-0 flex h-screen w-64 flex-col border-r border-gray-200 p-6 dark:border-white/10">
      <div className="mb-6">
        <h2 className="text-accent text-xl font-semibold">Адмінка</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map(({ key, href, label, Icon }) => (
          <AppLink
            key={key}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 transition',
              'hover:bg-neutral-100 dark:hover:bg-white/10'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </AppLink>
        ))}
      </nav>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
            'border border-red-200 text-red-600 hover:bg-red-50',
            'dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10'
          )}
        >
          <LogOut className="h-4 w-4" />
          <span>Вийти</span>
        </button>
      </div>
    </aside>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
