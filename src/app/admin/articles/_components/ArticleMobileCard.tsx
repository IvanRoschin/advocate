import type { ArticleResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';
import { CardActions } from '../../_components/ui/CardActions';
import { StatusBadge } from '../../_components/ui/StatusBadge';
import { articleStatusMap } from '../../_components/ui/statusMaps';

type ArticleMobileCardProps = {
  row: ArticleResponseDTO;
  onEdit: (article: ArticleResponseDTO) => void;
  onDelete: (article: ArticleResponseDTO) => void;
  authorName: string;
  categoryTitle: string;
};

export function ArticleMobileCard({
  row,
  onEdit,
  onDelete,
  authorName,
  categoryTitle,
}: ArticleMobileCardProps) {
  return (
    <AdminTableCard
      title={row.title || 'Без назви'}
      subtitle={row.slug || '—'}
      badge={<StatusBadge status={row.status} map={articleStatusMap} />}
      footer={<CardActions row={row} onEdit={onEdit} onDelete={onDelete} />}
    >
      <AdminCardField label="Автор" value={authorName} />
      <AdminCardField label="Категорія" value={categoryTitle} />
      <AdminCardField label="Slug" value={row.slug || '—'} />
    </AdminTableCard>
  );
}
