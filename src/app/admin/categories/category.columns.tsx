import { iconLibrary } from '@/app/resources';
import { CategoryResponseDTO } from '@/app/types';
import { Btn, NextImage } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { Center } from '../_components/table/Center';
import { SortableHeader } from '../_components/table/SortableHeader';

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
    header: ({ column }) => (
      <SortableHeader<CategoryResponseDTO> title="Назва" column={column} />
    ),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <SortableHeader<CategoryResponseDTO> title="Слаг" column={column} />
    ),
  },
  {
    id: 'image',
    header: () => <Center>Зображення</Center>,
    cell: ({ row }) => {
      const src = row.original.src?.[0];

      return (
        <Center>
          {src && (
            <NextImage
              src={src}
              alt={row.original.title}
              width={50}
              height={50}
              className="object-contain"
            />
          )}
        </Center>
      );
    },
    enableSorting: false,
  },
  {
    id: 'edit',
    header: () => <Center>Редагувати</Center>,
    cell: ({ row }) => (
      <Center>
        <Btn icon={iconLibrary.pen} onClick={() => onEdit(row.original)} />
      </Center>
    ),
  },
  {
    id: 'delete',
    header: () => <Center>Видалити</Center>,
    cell: ({ row }) => (
      <Center>
        <Btn icon={iconLibrary.trash} onClick={() => onDelete(row.original)} />
      </Center>
    ),
  },
];
