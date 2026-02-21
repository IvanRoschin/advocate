'use client';

import { useRouter } from 'next/navigation';

import { useAppStore } from '@/app/store/app.store';

import { Btn } from '../ui';
import Heading from './Heading';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  goHomeAfterReset?: boolean;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'За Вашим запитом нічого не знайдейно 🤷‍♂️',
  subtitle = 'Спробуйте змінити фільтри ⚙️',
  showReset,
  actionLabel,
  actionHref,
  goHomeAfterReset = false,
  onReset,
  actionOnClick,
}) => {
  const router = useRouter();
  const { filters } = useAppStore();

  const setCategory = filters.setCategory;
  const setSort = filters.setSort;

  const handleResetFilters = () => {
    setCategory?.('');
    setSort?.('');
    if (goHomeAfterReset) router.push('/');
    onReset?.();
  };

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="mt-4 flex w-48 flex-col gap-2">
        {showReset && (
          <Btn
            type="button"
            uiVariant="outline"
            label="Видалити фільтри"
            onClick={handleResetFilters}
          />
        )}
        {actionLabel && actionHref && (
          <Btn
            type="button"
            label={actionLabel}
            onClick={() => router.push(actionHref)}
            uiVariant="outline"
          />
        )}
        {actionLabel && actionOnClick && (
          <Btn label={actionLabel} onClick={actionOnClick} />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
