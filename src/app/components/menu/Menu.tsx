'use client';

import { useEffect, useRef, useState } from 'react';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

const menu = [
  { title: 'Головна', link: '/#' },
  { title: 'Про мене', link: '/#about' },
  { title: 'Практики', link: '/#practices' },
  { title: 'Блог', link: '/blog' },
  { title: 'Оплата послуг', link: '/payment' },
  { title: 'Контакти', link: '/contacts' },
];

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  // Запрет прокрутки body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Свайп влево
  useEffect(() => {
    const start = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const move = (e: TouchEvent) => {
      if (!touchStartX.current) return;
      if (e.touches[0].clientX - touchStartX.current < -50) {
        setIsOpen(false);
        touchStartX.current = null;
      }
    };

    const sidebar = sidebarRef.current;
    if (isOpen && sidebar) {
      sidebar.addEventListener('touchstart', start);
      sidebar.addEventListener('touchmove', move);
    }

    return () => {
      sidebar?.removeEventListener('touchstart', start);
      sidebar?.removeEventListener('touchmove', move);
    };
  }, [isOpen]);

  return (
    <nav className="font-eukrainehead">
      {/* Мобильный бургер */}
      <div className="flex items-center sm:hidden">
        <button
          type="button"
          onClick={toggleMenu}
          className="text-accent z-1001 rounded-full bg-white/80 p-2 shadow-md focus:outline-none"
          aria-label="Меню"
        >
          {isOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Десктопное меню */}
      <ul className="mx-auto hidden w-full max-w-5xl grid-cols-3 gap-2 text-sm font-medium text-gray-700 sm:mb-4 sm:grid sm:gap-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4 xl:pt-8">
        {menu.map(({ title, link }) => (
          <li key={title} className="text-center">
            <a
              href={link}
              className="group hover:text-accent focus:text-accent relative block py-2 transition-colors duration-500 ease-out"
            >
              {title}
              <span className="bg-accent absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full group-focus:w-full" />
            </a>
          </li>
        ))}
      </ul>

      {/* Мобильное меню */}
      <div
        className={`fixed inset-0 z-1000 transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Затемнение */}
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        >
          Закрыть меню
        </button>

        {/* Сайдбар */}
        <div
          ref={sidebarRef}
          className={`absolute top-0 left-0 h-full w-72 transform bg-white shadow-md transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <ul className="flex h-full flex-col divide-y divide-gray-200">
            {menu.map(({ title, link }) => (
              <li key={title}>
                <a
                  href={link}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-accent block px-6 py-4 text-gray-800 hover:bg-gray-100"
                >
                  {title}
                </a>
              </li>
            ))}
            <li className="mt-auto px-6 py-6">
              <button
                type="button"
                onClick={() => {
                  console.warn('Cnock-Cnock');
                  setIsOpen(false);
                }}
                className="bg-accent hover:bg-accent w-full rounded-md py-3 font-semibold text-white"
              >
                Записатись на консультацію
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
