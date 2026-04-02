import type { ClientResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

type ClientMobileCardProps = {
  row: ClientResponseDTO;
  onEdit: (client: ClientResponseDTO) => void;
  onDelete: (client: ClientResponseDTO) => void;
};

export function ClientMobileCard({
  row,
  onEdit,
  onDelete,
}: ClientMobileCardProps) {
  const isActive = row.status === 'active';

  return (
    <AdminTableCard
      title={row.fullName || 'Без імені'}
      subtitle={row.email || row.phone || '—'}
      badge={
        <span
          className={
            isActive
              ? 'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300'
              : 'rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300'
          }
        >
          {row.status || '—'}
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
      <AdminCardField label="Тип" value={row.type || '—'} />
      <AdminCardField label="Телефон" value={row.phone || '—'} />
      <AdminCardField label="Компанія" value={row.companyName || '—'} />
    </AdminTableCard>
  );
}
