'use client';

import { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

import { useThemeStore } from '@/app/store/theme.store';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactNode;
  disabled?: boolean;
}

export default function Modal({ isOpen, onClose, body, disabled }: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  const theme = useThemeStore(state => state.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowModal(true), 10);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowModal(false), 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;
    onClose();
  }, [disabled, onClose]);

  // ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, handleClose]);

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative w-full max-w-md transform rounded-3xl p-8 shadow-2xl transition-all duration-200 ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0'
        } ${
          isDark
            ? 'border border-zinc-700 bg-zinc-900'
            : 'border border-gray-100 bg-white'
        }`}
      >
        {/* Кнопка закриття */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 z-10 rounded-full p-2 transition-all hover:scale-110 focus:outline-none ${
            isDark
              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              : 'text-neutral-500 hover:bg-gray-100 hover:text-neutral-700'
          }`}
          aria-label="Закрити"
        >
          <IoMdClose size={22} />
        </button>

        {/* Контент (ModalNotification та інші) */}
        {body}
      </div>
    </div>
  );
}
