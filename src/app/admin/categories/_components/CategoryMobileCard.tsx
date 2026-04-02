import type { CategoryResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

type CategoryMobileCardProps = {
  row: CategoryResponseDTO;
  onEdit: (category: CategoryResponseDTO) => void;
  onDelete: (category: CategoryResponseDTO) => void;
};

export function CategoryMobileCard({
  row,
  onEdit,
  onDelete,
}: CategoryMobileCardProps) {
  const imageCount = Array.isArray(row.src) ? row.src.length : 0;

  return (
    <AdminTableCard
      title={row.title || 'Без назви'}
      subtitle={row.slug || '—'}
      badge={
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">
          Категорія
        </span>
      }
      footer={
        <div className="flex flex-wrap justify-between">
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
      <AdminCardField label="Назва" value={row.title || '—'} />
      <AdminCardField label="Slug" value={row.slug || '—'} />
      <AdminCardField
        label="Зображення"
        value={imageCount > 0 ? String(imageCount) : '—'}
      />
    </AdminTableCard>
  );
}
