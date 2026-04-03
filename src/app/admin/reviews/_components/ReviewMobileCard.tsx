import type { ReviewResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { reviewStatusMap } from '../../_components/ui/statusMaps';

type ReviewMobileCardProps = {
  row: ReviewResponseDTO;
  onEdit: (review: ReviewResponseDTO) => void;
  onDelete: (review: ReviewResponseDTO) => void;
};

export function ReviewMobileCard({
  row,
  onEdit,
  onDelete,
}: ReviewMobileCardProps) {
  const shortText =
    row.text.length > 140 ? `${row.text.slice(0, 140)}…` : row.text;

  return (
    <AdminTableCard
      title={row.authorName || 'Без автора'}
      subtitle={`ID: ${row._id}`}
      badge={<StatusBadge status={row.status} map={reviewStatusMap} />}
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
    >
      <AdminCardField label="Автор" value={row.authorName} />

      <AdminCardField
        label="Рейтинг"
        value={row.rating ? '⭐'.repeat(row.rating) : '—'}
      />

      <AdminCardField label="Тип" value={row.targetType} />

      <AdminCardField label="Текст" value={shortText} />
    </AdminTableCard>
  );
}
