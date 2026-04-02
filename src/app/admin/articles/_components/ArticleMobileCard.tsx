import type { ArticleResponseDTO } from '@/app/types';
import { AdminCardField } from '../../_components/table/AdminCardField';
import AdminTableCard from '../../_components/table/AdminTableCard';

type ArticleMobileCardProps = {
  row: ArticleResponseDTO;
  onEdit: (article: ArticleResponseDTO) => void;
  onDelete: (article: ArticleResponseDTO) => void;
  authorName: string;
  categoryTitle: string;
};

function getArticleStatusBadge(status: ArticleResponseDTO['status']) {
  switch (status) {
    case 'published':
      return {
        label: 'Опубліковано',
        className:
          'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300',
      };

    case 'draft':
      return {
        label: 'Чернетка',
        className:
          'rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      };

    default:
      return {
        label: String(status),
        className:
          'rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300',
      };
  }
}

export function ArticleMobileCard({
  row,
  onEdit,
  onDelete,
  authorName,
  categoryTitle,
}: ArticleMobileCardProps) {
  const badge = getArticleStatusBadge(row.status);

  return (
    <AdminTableCard
      title={row.title || 'Без назви'}
      subtitle={row.slug || '—'}
      badge={<span className={badge.className}>{badge.label}</span>}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
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
      <AdminCardField label="Автор" value={authorName} />
      <AdminCardField label="Категорія" value={categoryTitle} />
      <AdminCardField label="Slug" value={row.slug || '—'} />
    </AdminTableCard>
  );
}
