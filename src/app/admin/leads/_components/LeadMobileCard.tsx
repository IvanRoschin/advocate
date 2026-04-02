import { AppLink } from '@/components';

import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

import type { LeadResponseDTO } from '@/app/types';
export function LeadMobileCard(row: LeadResponseDTO) {
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
        <div className="flex flex-wrap gap-2">
          <AppLink
            href={`/admin/leads/${row.id}`}
            className="bg-foreground text-background inline-flex rounded-xl px-3 py-2 text-sm font-medium"
          >
            Відкрити
          </AppLink>
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
