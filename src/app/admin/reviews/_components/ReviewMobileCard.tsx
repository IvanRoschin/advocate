import type { ReviewResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

type ReviewMobileCardProps = {
  row: ReviewResponseDTO;
  onEdit: (review: ReviewResponseDTO) => void;
  onDelete: (review: ReviewResponseDTO) => void;
};

function getStatusBadge(status: ReviewResponseDTO['status']) {
  switch (status) {
    case 'approved':
      return {
        label: 'Опубліковано',
        className:
          'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300',
      };

    case 'pending':
      return {
        label: 'На модерації',
        className:
          'rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      };

    case 'rejected':
      return {
        label: 'Відхилено',
        className:
          'rounded-full bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-500/15 dark:text-red-300',
      };

    default:
      return {
        label: status,
        className:
          'rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300',
      };
  }
}

export function ReviewMobileCard({
  row,
  onEdit,
  onDelete,
}: ReviewMobileCardProps) {
  const badge = getStatusBadge(row.status);

  const shortText =
    row.text.length > 140 ? `${row.text.slice(0, 140)}…` : row.text;

  return (
    <AdminTableCard
      title={row.authorName || 'Без автора'}
      subtitle={`ID: ${row._id}`}
      badge={<span className={badge.className}>{badge.label}</span>}
      footer={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="bg-foreground text-background inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-90"
          >
            Відкрити
          </button>

          <button
            type="button"
            onClick={() => onDelete(row)}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Видалити
          </button>
        </div>
      }
    >
      <AdminCardField label="Автор" value={row.authorName} />

      <AdminCardField
        label="Рейтинг"
        value={row.rating ? '⭐'.repeat(row.rating) : '—'}
      />

      <AdminCardField label="Тип" value={row.targetType} />

      <AdminCardField label="Текст" value={shortText} />
    </AdminTableCard>
  );
}
