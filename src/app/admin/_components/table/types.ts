import { ReactNode } from 'react';

import { ColumnDef } from '@tanstack/react-table';

export type AdminTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  isLoading?: boolean;
  emptyMessage?: string;
  mobileRender?: (row: TData) => ReactNode;
};
