import { ColumnDef } from '@tanstack/react-table';

import { Btn } from '@/components';
import { Badge } from '@/components/ui/badge';
import { iconLibrary } from '@/app/resources'; // ✅ как в категориях
import type { UserResponseDTO } from '@/app/types';
import { Center } from '../components/table/Center';
import { SortableHeader } from '../components/table/SortableHeader';
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
    accessorKey: 'phone',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Телефон" column={column} />
    ),
    cell: ({ row }) => row.original.phone ?? '—',
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Роль" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        <Badge variant="outline">{row.original.role}</Badge>
      </Center>
    ),
    meta: { filterVariant: 'select' },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Статус" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        {row.original.isActive ? (
          <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">
            Активний
          </Badge>
        ) : (
          <Badge variant="destructive">Неактивний</Badge>
        )}
      </Center>
    ),
    meta: { filterVariant: 'boolean' },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader<UserResponseDTO> title="Створено" column={column} />
    ),
    cell: ({ row }) => (
      <Center>
        {new Date(row.original.createdAt).toLocaleDateString('uk-UA')}
      </Center>
    ),
  },

  // ✅ как в categoryColumns: отдельные колонки edit/delete + Center + Btn(icon)
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
