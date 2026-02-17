import { Column } from '@tanstack/react-table';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

interface SortableHeaderProps<T> {
  title: string;
  column: Column<T, unknown>;
}

export function SortableHeader<T>({ title, column }: SortableHeaderProps<T>) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="flex items-center gap-2 select-none"
    >
      <span>{title}</span>

      {sorted === 'asc' && <FaSortUp />}
      {sorted === 'desc' && <FaSortDown />}
      {!sorted && <FaSort className="opacity-40" />}
    </button>
  );
}
