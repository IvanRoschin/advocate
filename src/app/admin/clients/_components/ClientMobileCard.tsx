import type { ClientResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { clientStatusMap } from '../../_components/ui/statusMaps';

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
      badge={<StatusBadge config={clientStatusMap(isActive)} />}
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
    >
      <AdminCardField label="Тип" value={row.type || '—'} />
      <AdminCardField label="Телефон" value={row.phone || '—'} />
      <AdminCardField label="Компанія" value={row.companyName || '—'} />
    </AdminTableCard>
  );
}
