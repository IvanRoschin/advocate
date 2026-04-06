'use client';

import { memo, useMemo } from 'react';

import { useNavItems } from '@/app/components/header/nav.shared';
import { getUserScope } from '@/app/lib/auth/getUserScope';
import { cn } from '@/app/lib/utils';
import { useUserStore } from '@/app/store/user.store';
import { AppLink } from '@/components';

const ClientSidebar = memo(() => {
  const user = useUserStore(state => state.user);

  const scope = useMemo(() => getUserScope(user?.role), [user?.role]);
  const items = useNavItems(scope);

  return (
    <aside className="bg-surface-input sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 p-6 dark:border-white/10">
      <div className="mb-6">
        <h2 className="text-accent text-xl font-semibold">
          Кабінет користувача
        </h2>
      </div>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {items.map(item => {
          const itemClassName = cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
            'hover:bg-neutral-100 dark:hover:bg-white/10',
            item.enabled === false && 'pointer-events-none opacity-50'
          );

          const content = (
            <>
              <item.Icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </>
          );

          if ('href' in item && typeof item.href === 'string') {
            return (
              <AppLink
                key={item.key}
                href={item.href}
                className={itemClassName}
              >
                {content}
              </AppLink>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={'onClick' in item ? item.onClick : undefined}
              disabled={item.enabled === false}
              className={cn(itemClassName, 'w-full')}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </aside>
  );
});

ClientSidebar.displayName = 'ClientSidebar';

export default ClientSidebar;
