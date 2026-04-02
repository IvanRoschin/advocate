import type { ColumnDef } from '@tanstack/react-table';

import { iconLibrary } from '@/app/resources';
import { Btn } from '@/components';
import { Badge } from '@/components/ui/badge';

import { Center } from '../_components/table/Center';
import { SortableHeader } from '../_components/table/SortableHeader';

import type { ArticleResponseDTO, ArticleStatus } from '@/app/types';
type ColumnActions = {
  onEdit: (article: ArticleResponseDTO) => void;
  onDelete: (article: ArticleResponseDTO) => void;

  // ✅ мапы для отображения вместо ID
  authorNameById: Map<string, string>;
  categoryTitleById: Map<string, string>;
};

const statusMeta = (s: ArticleStatus) => {
  switch (s) {
    case 'published':
      return { label: 'Опубліковано', variant: 'default' as const };
    case 'draft':
      return { label: 'Чернетка', variant: 'outline' as const };
    default:
      return { label: s, variant: 'outline' as const };
  }
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('uk-UA') : '—';

export const articlesColumns = ({
  onEdit,
  onDelete,
  authorNameById,
  categoryTitleById,
}: ColumnActions): ColumnDef<ArticleResponseDTO>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <SortableHeader<ArticleResponseDTO> title="Заголовок" column={column} />
    ),
    cell: ({ row }) => row.original.title,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader<ArticleResponseDTO> title="Статус" column={column} />
    ),
    cell: ({ row }) => {
      const meta = statusMeta(row.original.status);
      return (
        <Center>
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </Center>
      );
    },
    meta: { filterVariant: 'select' },
  },

  // ✅ Автор: показываем имя по мапе, fallback на populated author?.name, fallback на id
  {
    id: 'author',
    header: () => <Center>Автор</Center>,
    cell: ({ row }) => {
      const a = row.original;
      const label =
        (a.author?.name && a.author.name) ||
        authorNameById.get(a.authorId) ||
        a.authorId ||
        '—';

      return <Center>{label}</Center>;
    },
    enableSorting: false,
  },

  // ✅ Категория: показываем title по мапе, fallback на populated category?.title, fallback на id
  {
    id: 'category',
    header: () => <Center>Категорія</Center>,
    cell: ({ row }) => {
      const a = row.original;
      const label =
        (a.category?.title && a.category.title) ||
        categoryTitleById.get(a.categoryId) ||
        a.categoryId ||
        '—';

      return <Center>{label}</Center>;
    },
    enableSorting: false,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<ArticleResponseDTO> title="Створено" column={column} />
    ),
    cell: ({ row }) => <Center>{formatDate(row.original.createdAt)}</Center>,
  },

  {
    id: 'edit',
    header: () => <Center>Редагувати</Center>,
    cell: ({ row }) => (
      <Center>
        <Btn icon={iconLibrary.pen} onClick={() => onEdit(row.original)} />
      </Center>
    ),
    enableSorting: false,
  },

  {
    id: 'delete',
    header: () => <Center>Видалити</Center>,
    cell: ({ row }) => (
      <Center>
        <Btn icon={iconLibrary.trash} onClick={() => onDelete(row.original)} />
      </Center>
    ),
    enableSorting: false,
  },
];
