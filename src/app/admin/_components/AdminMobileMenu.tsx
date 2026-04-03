'use client';

import { LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

import { useNavItems } from '@/app/components/header/nav.shared';
import { getUserScope } from '@/app/lib/auth/getUserScope';
import { cn } from '@/app/lib/utils';
import { useUserStore } from '@/app/store/user.store';
import { AppLink } from '@/components';

export default function AdminMobileMenu() {
  const user = useUserStore(state => state.user);

  const scope = useMemo(() => getUserScope(user?.role), [user?.role]);
  const items = useNavItems(scope);

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/signin',
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <div className="border-border bg-app/90 sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur xl:hidden">
        <p className="text-foreground text-sm font-semibold">Адмінка</p>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Відкрити меню"
          className="hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-xl transition"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-50 xl:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={cn(
            'bg-surface-input absolute top-0 right-0 flex h-dvh w-[320px] max-w-[88vw] flex-col border-l border-gray-200 p-5 shadow-xl transition-transform duration-300 dark:border-white/10',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-accent text-lg font-semibold">Меню</h2>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Закрити меню"
              className="hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-xl transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {items.map(({ key, href, label, Icon }) => (
              <AppLink
                key={key}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
                  'hover:bg-neutral-100 dark:hover:bg-white/10'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="font-medium">{label}</span>
              </AppLink>
            ))}
          </nav>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                'border border-red-200 text-red-600 hover:bg-red-50',
                'dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10'
              )}
            >
              <LogOut className="h-4 w-4" />
              <span>Вийти</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
