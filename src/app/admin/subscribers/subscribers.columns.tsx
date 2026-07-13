import type { ColumnDef } from '@tanstack/react-table';

import { Switcher } from '@/app/components';
import { formatDate } from '@/app/helpers';

import { Center } from '../_components/table';
import { SortableHeader } from '../_components/table/SortableHeader';

import type { SubscriberResponseDTO } from '@/app/types';
type Params = {
  onEdit: (subscriber: SubscriberResponseDTO) => void;
  onDelete: (subscriber: SubscriberResponseDTO) => void;
  onToggleActive: (subscriber: SubscriberResponseDTO, checked: boolean) => void;
};

export function subscribersColumns({
  onEdit,
  onDelete,
  onToggleActive,
}: Params): ColumnDef<SubscriberResponseDTO>[] {
  return [
    {
      accessorKey: 'email',
      header: ({ column }) => <SortableHeader title="Email" column={column} />,
    },
    {
      accessorKey: 'subscribed',
      header: 'Статус',
      cell: ({ row }) => {
        const isSubscribed = row.original.subscribed;
        return isSubscribed ? 'Активний' : 'Неактивний';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата підписки',
      cell: ({ row }) => (
        <Center>
          {row.original.createdAt ? formatDate(row.original.createdAt) : '—'}
        </Center>
      ),
    },
    {
      id: 'isActive',
      header: 'Активний',
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <Switcher
            id={`sub-active-${sub._id}`}
            checked={sub.subscribed}
            labels={['Вимк.', 'Увімк.']}
            onChange={checked => onToggleActive(sub, checked)}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Дії',
      cell: ({ row }) => {
        const sub = row.original;

        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit(sub)}
              className="hover:bg-accent rounded-lg border px-3 py-1 text-sm transition-colors hover:text-white"
            >
              Редагувати
            </button>

            <button
              type="button"
              onClick={() => onDelete(sub)}
              className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              Видалити
            </button>
          </div>
        );
      },
    },
  ];
}
