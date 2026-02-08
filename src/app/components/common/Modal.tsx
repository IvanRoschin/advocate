'use client';
import { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactNode;
  disabled?: boolean;
}

export default function Modal({ isOpen, onClose, body, disabled }: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowModal(true), 0); // асинхронно
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowModal(false), 200);
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative w-full max-w-xl transform rounded-2xl bg-white p-6 shadow-xl transition-all duration-200 ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
        <button
          onClick={handleClose}
          className="hover:border-accentcolor absolute top-4 right-4 cursor-pointer rounded-full border border-neutral-400 p-1 transition"
        >
          <IoMdClose size={18} />
        </button>
        {body}
      </div>
    </div>
  );
}
