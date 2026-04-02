import { Switcher } from '@/app/components';
import { SlideResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { STATUS_STYLES } from '../../_components/ui/statusMaps';

type Props = {
  row: SlideResponseDTO;
  onEdit: (slide: SlideResponseDTO) => void;
  onDelete: (slide: SlideResponseDTO) => void;
  onToggleActive: (slide: SlideResponseDTO, checked: boolean) => void;
  isToggling: boolean;
};

export function SlideMobileCard({
  row,
  onEdit,
  onDelete,
  onToggleActive,
  isToggling,
}: Props) {
  return (
    <AdminTableCard
      title={row.title}
      subtitle={row.desc.length > 60 ? `${row.desc.slice(0, 60)}…` : row.desc}
      badge={
        <StatusBadge
          config={
            row.isActive
              ? { label: 'Активний', className: STATUS_STYLES.success }
              : { label: 'Неактивний', className: STATUS_STYLES.neutral }
          }
        />
      }
      footer={
        <div className="flex flex-wrap gap-2">
          <CardActions row={row} onEdit={onEdit} onDelete={onDelete} />
          <Switcher
            id={`slide-mobile-active-${row._id}`}
            checked={row.isActive}
            labels={['Вимк.', 'Увімк.']}
            loading={isToggling}
            onChange={checked => onToggleActive(row, checked)}
          />
        </div>
      }
    >
      <AdminCardField label="Назва" value={row.title} />
      <AdminCardField label="Опис" value={row.desc} />
      <AdminCardField label="Зображення" value={String(row.src.length)} />
    </AdminTableCard>
  );
}
