import type { ColumnDef } from '@tanstack/react-table';

import { Switcher } from '@/app/components';
import type { SlideResponseDTO } from '@/app/types';

import { SortableHeader } from '../_components/table/SortableHeader';

type Params = {
  onEdit: (slide: SlideResponseDTO) => void;
  onDelete: (slide: SlideResponseDTO) => void;
  onToggleActive: (slide: SlideResponseDTO, checked: boolean) => void;
  isSlideToggling: (slideId: string) => boolean;
};

export function slidesColumns({
  onEdit,
  onDelete,
  onToggleActive,
  isSlideToggling,
}: Params): ColumnDef<SlideResponseDTO>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => <SortableHeader title="Назва" column={column} />,
    },
    {
      accessorKey: 'desc',
      header: 'Опис',
      cell: ({ row }) => {
        const value = row.original.desc;
        return value.length > 80 ? `${value.slice(0, 80)}…` : value;
      },
    },
    {
      accessorKey: 'src',
      header: 'Зображення',
      cell: ({ row }) => row.original.src.length,
    },
    {
      accessorKey: 'isActive',
      header: 'Активний',
      cell: ({ row }) => {
        const slide = row.original;

        return (
          <Switcher
            id={`slide-active-${slide._id}`}
            checked={slide.isActive}
            labels={['Вимк.', 'Увімк.']}
            loading={isSlideToggling(slide._id)}
            onChange={checked => onToggleActive(slide, checked)}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Дії',
      cell: ({ row }) => {
        const slide = row.original;

        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit(slide)}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              Редагувати
            </button>

            <button
              type="button"
              onClick={() => onDelete(slide)}
              className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-600"
            >
              Видалити
            </button>
          </div>
        );
      },
    },
  ];
}
