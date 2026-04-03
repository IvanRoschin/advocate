import type { ColumnDef } from '@tanstack/react-table';

import { iconLibrary } from '@/app/resources';
import { Btn } from '@/components';
import { Badge } from '@/components/ui/badge';

import { Center } from '../_components/table/Center';
import { SortableHeader } from '../_components/table/SortableHeader';

import type { ServiceResponseDTO, ServiceStatus } from '@/app/types';
type ColumnActions = {
  onEdit: (service: ServiceResponseDTO) => void;
  onDelete: (service: ServiceResponseDTO) => void;
};

const statusMeta = (status: ServiceStatus) => {
  switch (status) {
    case 'published':
      return { label: 'Опубліковано', variant: 'default' as const };
    case 'draft':
      return { label: 'Чернетка', variant: 'outline' as const };
    default:
      return { label: status, variant: 'outline' as const };
  }
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('uk-UA') : '—';

export const servicesColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<ServiceResponseDTO>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <SortableHeader<ServiceResponseDTO> title="Назва" column={column} />
    ),
    cell: ({ row }) => row.original.title,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader<ServiceResponseDTO> title="Статус" column={column} />
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

  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <SortableHeader<ServiceResponseDTO> title="Slug" column={column} />
    ),
    cell: ({ row }) => <Center>{row.original.slug}</Center>,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<ServiceResponseDTO> title="Створено" column={column} />
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
