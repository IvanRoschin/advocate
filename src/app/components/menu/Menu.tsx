'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

import { navCta } from '@/app/config/nav';
import { AppLink } from '@/components';
import { cn } from '@/lib/utils';
import { menuText } from '@/resources';

import { useNavItems } from '../header/nav.shared';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  const items = useNavItems();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!isOpen || !sidebar) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const startX = touchStartX.current;
      if (startX == null) return;

      const delta = (e.touches[0]?.clientX ?? startX) - startX;
      if (delta < -50) {
        close();
        touchStartX.current = null;
      }
    };

    sidebar.addEventListener('touchstart', onTouchStart, { passive: true });
    sidebar.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      sidebar.removeEventListener('touchstart', onTouchStart);
      sidebar.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen, close]);

  return (
    <nav className="font-eukrainehead" aria-label={menuText.navAria}>
      <div className="flex items-center sm:hidden">
        <button
          type="button"
          onClick={toggle}
          className="bg-menu-trigger text-menu-trigger z-1001 rounded-full p-2 shadow-md focus:outline-none"
          aria-label={isOpen ? menuText.closeAria : menuText.burgerAria}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      <ul className="text-menu-desktop h2 mx-auto hidden w-full max-w-5xl grid-cols-3 gap-2 text-sm font-medium sm:mb-4 sm:grid sm:gap-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4 xl:pt-8">
        {items.map(({ route, href, label }) => (
          <li key={route} className="text-center">
            <AppLink
              href={href}
              className="group hover:text-accent focus:text-accent relative block py-2 transition-colors duration-500 ease-out"
            >
              {label}
              <span className="bg-accent absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full group-focus:w-full" />
            </AppLink>
          </li>
        ))}
      </ul>

      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-1000 transition-opacity duration-300',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label={menuText.closeAria}
          onClick={close}
          className="bg-menu-overlay absolute inset-0 backdrop-blur-sm"
        >
          <span className="sr-only">{menuText.closeOverlay}</span>
        </button>

        <div
          ref={sidebarRef}
          className={cn(
            'bg-menu-sidebar absolute top-0 left-0 h-full w-72 transform shadow-md transition-transform duration-300',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          role="dialog"
          aria-modal="true"
          aria-label={menuText.mobileMenuAria}
        >
          <ul className="divide-menu-sidebar flex h-full flex-col divide-y">
            {items.map(({ route, href, label }) => (
              <li key={route}>
                <AppLink
                  href={href}
                  onClick={close}
                  className="text-menu-sidebar-link hover:text-accent hover:bg-menu-sidebar-hover block px-6 py-4 transition-colors"
                >
                  {label}
                </AppLink>
              </li>
            ))}

            <li className="mt-auto px-6 py-6">
              <AppLink
                href={navCta.href}
                onClick={close}
                className="bg-accent text-menu-cta block w-full rounded-md py-3 text-center font-semibold transition-opacity hover:opacity-90"
              >
                {navCta.label}
              </AppLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
