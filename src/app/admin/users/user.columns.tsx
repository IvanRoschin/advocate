'use client';

import { FaPen, FaTrash } from 'react-icons/fa';

import { Btn } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Column, ColumnDef } from '@tanstack/react-table';

import type { UserResponseDTO } from '@/app/types';
interface ColumnActions {
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
}

function SortableHeader<TData, TValue>({
  title,
  column,
}: {
  title: string;
  column: Column<TData, TValue>;
}) {
  const sorted = column.getIsSorted() as false | 'asc' | 'desc';
  const arrow = sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '';

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 px-3"
      onClick={column.getToggleSortingHandler()}
    >
      {title} <span className="text-muted-foreground ml-1">{arrow}</span>
    </Button>
  );
}

export const userColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<UserResponseDTO>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader title="Імʼя" column={column} />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader title="Email" column={column} />,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <SortableHeader title="Телефон" column={column} />,
    cell: ({ row }) => row.original.phone ?? '—',
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <SortableHeader title="Роль" column={column} />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline">{row.original.role}</Badge>
      </div>
    ),
    meta: { filterVariant: 'select' },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => <SortableHeader title="Статус" column={column} />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.isActive ? (
          <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">
            Активний
          </Badge>
        ) : (
          <Badge variant="destructive">Неактивний</Badge>
        )}
      </div>
    ),
    meta: { filterVariant: 'boolean' },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader title="Створено" column={column} />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {new Date(row.original.createdAt).toLocaleDateString('uk-UA')}
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Дії</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <Btn
          type="button"
          uiVariant="ghost"
          radius={10}
          icon={FaPen}
          className="h-9 w-9 min-w-0 bg-white/0 p-0 hover:bg-black/5"
          onClick={() => onEdit(row.original)}
          aria-label="Редагувати"
          title="Редагувати"
        />
        <Btn
          type="button"
          uiVariant="ghost"
          radius={10}
          icon={FaTrash}
          className="h-9 w-9 min-w-0 bg-white/0 p-0 hover:bg-red-600/10 hover:text-red-600"
          onClick={() => onDelete(row.original)}
          aria-label="Видалити"
          title="Видалити"
        />
      </div>
    ),
    enableSorting: false,
  },
];
