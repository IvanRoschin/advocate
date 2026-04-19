import type { CategoryResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';

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
  const imageCount = Array.isArray(row.icon) ? row.icon.length : 0;

  return (
    <AdminTableCard
      title={row.title || 'Без назви'}
      subtitle={row.slug || '—'}
      badge={
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">
          Категорія
        </span>
      }
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
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
