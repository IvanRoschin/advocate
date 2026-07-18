'use client';

import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

import { useThemeStore } from '@/app/store/theme.store';
import { Btn } from '@/components';

interface ModalNotificationProps {
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ModalNotification = ({
  title = 'Увага',
  message,
  onConfirm,
  onCancel,
}: ModalNotificationProps) => {
  const theme = useThemeStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full" // прибрали border, padding, bg, rounded
    >
      {/* Іконка + Заголовок */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
            isDark
              ? 'bg-amber-500/10 text-amber-500'
              : 'bg-amber-500/10 text-amber-600'
          }`}
        >
          <FiAlertCircle className="h-10 w-10" />
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      {/* Повідомлення */}
      <p className="mb-8 px-2 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
        {message}
      </p>

      {/* Кнопки */}
      <div className="flex gap-3">
        {onCancel && (
          <Btn
            type="button"
            label="Скасувати"
            onClick={onCancel}
            uiVariant="outline"
            className="flex-1 py-3 text-base font-medium"
          />
        )}

        {onConfirm && (
          <Btn
            type="button"
            label="OK"
            onClick={onConfirm}
            uiVariant="accent"
            className="flex-1 py-3 text-base font-medium"
          />
        )}
      </div>
    </motion.div>
  );
};

export default ModalNotification;
