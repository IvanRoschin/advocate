import { iconLibrary } from '@/app/resources';
import { LeadResponseDTO } from '@/app/types';
import { Btn } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { Center } from '../_components/table/Center';
import { SortableHeader } from '../_components/table/SortableHeader';

interface ColumnActions {
  onEdit: (lead: LeadResponseDTO) => void;
  onDelete: (lead: LeadResponseDTO) => void;
}

export const leadColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<LeadResponseDTO>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Імʼя" column={column} />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Email" column={column} />
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Телефон" column={column} />
    ),
  },
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Джерело" column={column} />
    ),
    cell: ({ row }) => (
      <Center>{row.original.source === 'home' ? 'Головна' : 'Контакти'}</Center>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Статус" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        {row.original.status === 'new' ? 'Новий' : 'Опрацьований'}
      </Center>
    ),
  },
  {
    accessorKey: 'convertedToClient',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Клієнт" column={column} />
    ),
    cell: ({ row }) => (
      <Center>{row.original.convertedToClient ? 'Так' : 'Ні'}</Center>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<LeadResponseDTO> title="Дата" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        {new Date(row.original.createdAt).toLocaleDateString('uk-UA')}
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
