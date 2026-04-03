import type { ServiceResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { serviceStatusMap } from '../../_components/ui/statusMaps';

type ServiceMobileCardProps = {
  row: ServiceResponseDTO;
  onEdit: (service: ServiceResponseDTO) => void;
  onDelete: (service: ServiceResponseDTO) => void;
};

export function ServiceMobileCard({
  row,
  onEdit,
  onDelete,
}: ServiceMobileCardProps) {
  const imageCount = Array.isArray(row.src) ? row.src.length : 0;

  return (
    <AdminTableCard
      title={row.title || 'Без назви'}
      subtitle={row.slug || '—'}
      badge={<StatusBadge status={row.status} map={serviceStatusMap} />}
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
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
