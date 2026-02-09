import { ColumnDef } from '@tanstack/react-table';
import { FaPen, FaTrash } from 'react-icons/fa';

import { CategoryResponseDTO } from '@/app/types';
import { Btn, NextImage } from '@/components/index';

interface ColumnActions {
  onEdit: (category: CategoryResponseDTO) => void;
  onDelete: (category: CategoryResponseDTO) => void;
}

export const categoryColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<CategoryResponseDTO>[] => [
  {
    accessorKey: 'title',
    header: 'Назва',
  },
  {
    accessorKey: 'slug',
    header: 'Слаг',
  },
  {
    id: 'image',
    header: 'Зображення',
    cell: ({ row }) => {
      const src = row.original.src[0];
      return src ? (
        <NextImage src={src} alt={row.original.title} width={50} height={50} />
      ) : null;
    },
  },
  {
    id: 'edit',
    header: 'Редагувати',
    cell: ({ row }) => (
      <Btn icon={FaPen} onClick={() => onEdit(row.original)} />
    ),
  },
  {
    id: 'delete',
    header: 'Видалити',
    cell: ({ row }) => (
      <Btn icon={FaTrash} onClick={() => onDelete(row.original)} />
    ),
  },
];
