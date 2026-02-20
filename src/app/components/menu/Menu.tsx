'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

import { getRouteUrl } from '@/app/config/routes';
import { mainMenu, menuText } from '@/app/resources';
import { AppLink } from '@/components';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  // Escape -> close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swipe left to close (mobile sidebar)
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!isOpen || !sidebar) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const startX = touchStartX.current;
      if (startX == null) return;

      const delta = e.touches[0].clientX - startX;
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
      {/* Mobile burger */}
      <div className="flex items-center sm:hidden">
        <button
          type="button"
          onClick={toggle}
          className="text-accent z-1001 rounded-full bg-white/80 p-2 shadow-md focus:outline-none"
          aria-label={isOpen ? menuText.closeAria : menuText.burgerAria}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Desktop menu */}
      <ul className="h2 mx-auto hidden w-full max-w-5xl grid-cols-3 gap-2 text-sm font-medium text-gray-700 sm:mb-4 sm:grid sm:gap-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4 xl:pt-8">
        {mainMenu.map(({ title, route }) => (
          <li key={route} className="text-center">
            <AppLink
              href={getRouteUrl(route)}
              className="group hover:text-accent focus:text-accent relative block py-2 transition-colors duration-500 ease-out"
            >
              {title}
              <span className="bg-accent absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full group-focus:w-full" />
            </AppLink>
          </li>
        ))}
      </ul>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-1000 transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label={menuText.closeAria}
          onClick={close}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        >
          <span className="sr-only">{menuText.closeOverlay}</span>
        </button>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`absolute top-0 left-0 h-full w-72 transform bg-white shadow-md transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={menuText.mobileMenuAria}
        >
          <ul className="flex h-full flex-col divide-y divide-gray-200">
            {mainMenu.map(({ title, route }) => (
              <li key={route}>
                <AppLink
                  href={getRouteUrl(route)}
                  onClick={close}
                  className="hover:text-accent block px-6 py-4 text-gray-800 hover:bg-gray-100"
                >
                  {title}
                </AppLink>
              </li>
            ))}

            <li className="mt-auto px-6 py-6">
              <AppLink
                href={getRouteUrl(menuText.ctaRoute)}
                onClick={close}
                className="bg-accent hover:bg-accent block w-full rounded-md py-3 text-center font-semibold text-white"
              >
                {menuText.cta}
              </AppLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
