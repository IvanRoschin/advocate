import type { ColumnDef } from '@tanstack/react-table';

import { formatDate } from '@/app/helpers';
import { iconLibrary } from '@/app/resources';
import type { ClientResponseDTO } from '@/app/types';
import { Btn } from '@/components';
import { Center } from '../_components/table/Center';
import { SortableHeader } from '../_components/table/SortableHeader';
type ColumnActions = {
  onEdit: (client: ClientResponseDTO) => void;
  onDelete: (client: ClientResponseDTO) => void;
};

export const clientsColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<ClientResponseDTO>[] => [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <SortableHeader<ClientResponseDTO> title="Імʼя / Назва" column={column} />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <SortableHeader<ClientResponseDTO> title="Тип" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        {row.original.type === 'individual' ? 'Фіз. особа' : 'Компанія'}
      </Center>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader<ClientResponseDTO> title="Статус" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        {row.original.status === 'active' ? 'Активний' : 'Неактивний'}
      </Center>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <SortableHeader<ClientResponseDTO> title="Email" column={column} />
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <SortableHeader<ClientResponseDTO> title="Телефон" column={column} />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<ClientResponseDTO> title="Дата" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        <Center>{formatDate(row.original.createdAt)}</Center>
      </Center>
    ),
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
