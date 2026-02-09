import { ColumnDef } from '@tanstack/react-table';

export interface AdminTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  isLoading?: boolean;
  emptyMessage?: string;
}
