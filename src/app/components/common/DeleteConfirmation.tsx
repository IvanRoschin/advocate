'use client';

import { Btn } from '@/components';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmation = ({
  onConfirm,
  onCancel,
  title = 'елемент',
  message,
}: DeleteConfirmationProps) => {
  return (
    <div className="w-full text-center">
      {/* Іконка попередження */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/10 dark:text-red-500">
        <span className="text-4xl">⚠️</span>
      </div>

      {/* Заголовок */}
      <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Ви впевнені?
      </h3>

      {/* Повідомлення */}
      <p className="mb-8 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
        {message || `Ви хочете видалити цей ${title}?`}
        <br />
        Цю дію неможливо скасувати.
      </p>

      {/* Кнопки */}
      <div className="flex gap-3">
        <Btn
          type="button"
          label="Скасувати"
          onClick={onCancel}
          uiVariant="outline"
          className="flex-1 py-3 text-base font-medium"
        />

        <Btn
          type="button"
          label="Видалити"
          onClick={onConfirm}
          uiVariant="destructive"
          className="flex-1 py-3 text-base font-medium"
        />
      </div>
    </div>
  );
};

export default DeleteConfirmation;
