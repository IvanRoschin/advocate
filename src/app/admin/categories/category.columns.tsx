import { ColumnDef } from '@tanstack/react-table';

import { getCategoryIcon } from '@/app/helpers/getCategoryIcon';
import { iconLibrary } from '@/app/resources';
import { CategoryResponseDTO } from '@/app/types';
import { Btn } from '@/components';
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
    id: 'icon',
    header: () => <Center>Іконка</Center>,
    cell: ({ row }) => {
      const Icon = getCategoryIcon(row.original.icon);
      return (
        <Center>
          {Icon ? (
            <Icon className="text-muted-foreground h-5 w-5" />
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
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
