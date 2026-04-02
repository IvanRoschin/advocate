import type { LeadResponseDTO } from '@/app/types';
import { AdminCardField } from './AdminCardField';
import AdminTableCard from './AdminTableCard';

type LeadMobileCardProps = {
  row: LeadResponseDTO;
  onEdit: (lead: LeadResponseDTO) => void;
  onDelete: (lead: LeadResponseDTO) => void;
};

export function LeadMobileCard({ row, onEdit, onDelete }: LeadMobileCardProps) {
  return (
    <AdminTableCard
      title={row.name || 'Без імені'}
      subtitle={row.email}
      badge={
        <span
          className={
            row.status === 'new'
              ? 'rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700'
              : 'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700'
          }
        >
          {row.status === 'new' ? 'Нова' : 'Оброблена'}
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
      <AdminCardField label="Телефон" value={row.phone || '—'} />
      <AdminCardField label="Джерело" value={row.source || '—'} />
      <AdminCardField
        label="Клієнт"
        value={row.convertedToClient ? 'Так' : 'Ні'}
      />
    </AdminTableCard>
  );
}
