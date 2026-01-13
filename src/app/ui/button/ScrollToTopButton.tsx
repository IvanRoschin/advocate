'use client';

import { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Повернутися нагору"
      className={`fixed right-6 bottom-6 z-999 rounded-xl bg-[#b89b5e] p-3 text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-[#a88b51] focus:ring-2 focus:ring-[#b89b5e]/50 focus:outline-none ${visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'} `}
    >
      <IoIosArrowUp size={22} />
    </button>
  );
};

export default ScrollToTopButton;
