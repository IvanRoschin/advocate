import { Switcher } from '@/app/components';
import { formatDate } from '@/app/helpers';
import { SubscriberResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { STATUS_STYLES } from '../../_components/ui/statusMaps';

type Props = {
  row: SubscriberResponseDTO;
  onEdit: (subscriber: SubscriberResponseDTO) => void;
  onDelete: (subscriber: SubscriberResponseDTO) => void;
  onToggleActive: (subscriber: SubscriberResponseDTO, checked: boolean) => void;
};

export function SubscriberMobileCard({
  row,
  onDelete,
  onEdit,
  onToggleActive,
}: Props) {
  return (
    <AdminTableCard
      title={row.email}
      subtitle={row.createdAt ? formatDate(row.createdAt) : '—'}
      badge={
        <StatusBadge
          config={
            row.subscribed
              ? { label: 'Активний', className: STATUS_STYLES.success }
              : { label: 'Неактивний', className: STATUS_STYLES.neutral }
          }
        />
      }
      footer={
        <div className="flex flex-wrap gap-2">
          <CardActions row={row} onDelete={onDelete} onEdit={onEdit} />
          <Switcher
            id={`sub-mobile-active-${row._id}`}
            checked={row.subscribed}
            labels={['Вимк.', 'Увімк.']}
            onChange={checked => onToggleActive(row, checked)}
          />
        </div>
      }
    >
      <AdminCardField label="Email" value={row.email} />
      <AdminCardField
        label="Дата підписки"
        value={row.createdAt ? formatDate(row.createdAt) : '—'}
      />
    </AdminTableCard>
  );
}
