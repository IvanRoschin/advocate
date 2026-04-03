import type { ColumnDef } from '@tanstack/react-table';

import { iconLibrary } from '@/app/resources';
import { Btn } from '@/components';
import { Badge } from '@/components/ui/badge';

import { Center, SortableHeader } from '../_components/table';

import type {
  ReviewResponseDTO,
  ReviewStatus,
  ReviewTargetType,
} from '@/app/types';
type ColumnActions = {
  onEdit: (review: ReviewResponseDTO) => void;
  onDelete: (review: ReviewResponseDTO) => void;
};

const statusMeta = (status: ReviewStatus) => {
  switch (status) {
    case 'approved':
      return { label: 'Погоджено', variant: 'default' as const };
    case 'pending':
      return { label: 'Очікує', variant: 'outline' as const };
    case 'rejected':
      return { label: 'Відхилено', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'outline' as const };
  }
};

const targetTypeLabel = (type: ReviewTargetType) => {
  switch (type) {
    case 'service':
      return 'Послуга';
    case 'article':
      return 'Стаття';
    case 'page':
      return 'Сторінка';
    default:
      return type;
  }
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('uk-UA') : '—';

export const reviewsColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<ReviewResponseDTO>[] => [
  {
    accessorKey: 'authorName',
    header: ({ column }) => (
      <SortableHeader<ReviewResponseDTO> title="Автор" column={column} />
    ),
    cell: ({ row }) => row.original.authorName,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader<ReviewResponseDTO> title="Статус" column={column} />
    ),
    cell: ({ row }) => {
      const meta = statusMeta(row.original.status);

      return (
        <Center>
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </Center>
      );
    },
  },
  {
    accessorKey: 'targetType',
    header: ({ column }) => (
      <SortableHeader<ReviewResponseDTO> title="Тип" column={column} />
    ),
    cell: ({ row }) => (
      <Center>{targetTypeLabel(row.original.targetType)}</Center>
    ),
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <SortableHeader<ReviewResponseDTO> title="Рейтинг" column={column} />
    ),
    cell: ({ row }) => <Center>{row.original.rating ?? '—'}</Center>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<ReviewResponseDTO> title="Створено" column={column} />
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
