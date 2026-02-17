import { FaPen, FaTrash } from 'react-icons/fa';

import { UserResponseDTO } from '@/app/types';
import { Btn } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { Center, SortableHeader } from '../components/table';

interface ColumnActions {
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
}

export const userColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<UserResponseDTO>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Імʼя" column={column} />
    ),
  },

  {
    accessorKey: 'email',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Email" column={column} />
    ),
  },

  {
    accessorKey: 'role',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Роль" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium">
          {row.original.role}
        </span>
      </Center>
    ),
    meta: {
      filterVariant: 'select', // 👈 для фильтра по роли
    },
  },

  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Статус" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${
            row.original.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.original.isActive ? 'Активний' : 'Неактивний'}
        </span>
      </Center>
    ),
    meta: {
      filterVariant: 'boolean', // 👈 фильтр по isActive
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Створено" column={column} />
    ),
    cell: ({ row }) => (
      <Center>{new Date(row.original.createdAt).toLocaleDateString()}</Center>
    ),
  },

  {
    id: 'edit',
    header: () => <Center>Редагувати</Center>,
    cell: ({ row }) => (
      <Center>
        <Btn icon={FaPen} onClick={() => onEdit(row.original)} />
      </Center>
    ),
    enableSorting: false,
  },

  {
    id: 'delete',
    header: () => <Center>Видалити</Center>,
    cell: ({ row }) => (
      <Center>
        <Btn icon={FaTrash} onClick={() => onDelete(row.original)} />
      </Center>
    ),
    enableSorting: false,
  },
];
