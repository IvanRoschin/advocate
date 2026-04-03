import type { LeadResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { leadStatusMap } from '../../_components/ui/statusMaps';

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
      badge={<StatusBadge status={row.status} map={leadStatusMap} />}
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
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
