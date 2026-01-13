'use client';

import Btn from '@/app/ui/button/Btn';

import Logo from '../logo/Logo';
import Menu from '../menu/Menu';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white py-5 shadow-sm xl:py-0">
      <div className="mx-10 gap-6 xl:flex xl:items-center xl:justify-between">
        {/* Верхняя панель: логотип и меню */}
        <div className="flex items-center justify-between sm:justify-start">
          <Logo variant="light" />
          <Menu />
        </div>
        {/* Кнопка для десктопа */}
        <div className="mt-4 hidden w-full sm:mt-0 sm:block xl:w-auto xl:shrink-0">
          <div className="flex justify-center xl:justify-end">
            <Btn title="Запис на консультацію" component="a" href="#order" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
