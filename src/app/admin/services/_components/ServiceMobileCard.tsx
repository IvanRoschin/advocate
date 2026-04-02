import type { ServiceResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

type ServiceMobileCardProps = {
  row: ServiceResponseDTO;
  onEdit: (service: ServiceResponseDTO) => void;
  onDelete: (service: ServiceResponseDTO) => void;
};

function getServiceStatusBadge(status: ServiceResponseDTO['status']) {
  switch (status) {
    case 'published':
      return {
        label: 'Опубліковано',
        className:
          'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300',
      };

    case 'draft':
      return {
        label: 'Чернетка',
        className:
          'rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      };

    default:
      return {
        label: String(status),
        className:
          'rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300',
      };
  }
}

export function ServiceMobileCard({
  row,
  onEdit,
  onDelete,
}: ServiceMobileCardProps) {
  const badge = getServiceStatusBadge(row.status);
  const imageCount = Array.isArray(row.src) ? row.src.length : 0;

  return (
    <AdminTableCard
      title={row.title || 'Без назви'}
      subtitle={row.slug || '—'}
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
      <AdminCardField label="Назва" value={row.title || '—'} />
      <AdminCardField label="Slug" value={row.slug || '—'} />
      <AdminCardField
        label="Зображення"
        value={imageCount ? String(imageCount) : '—'}
      />
      <AdminCardField label="SEO title" value={row.seoTitle || '—'} />
    </AdminTableCard>
  );
}
