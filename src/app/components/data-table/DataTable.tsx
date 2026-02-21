/* @react-compiler-disable */
'use client';

import * as React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { DataTableView } from './DataTableView';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  loading?: boolean;

  /** optional: какой column.id использовать для поиска */
  searchColumnId?: string;
  searchPlaceholder?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = 'Дані відсутні',
  loading = false,
  searchColumnId,
  searchPlaceholder = 'Пошук…',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    enableRowSelection: true,
  });

  const resolvedSearchColumnId = React.useMemo(() => {
    return searchColumnId ?? table.getAllLeafColumns()[0]?.id ?? 'id';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchColumnId, columns]); // не зависим от table-объекта

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const allHideableColumns = table.getAllColumns().filter(c => c.getCanHide());
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const searchValue =
    (table.getColumn(resolvedSearchColumnId)?.getFilterValue() as string) ?? '';

  const setSearchValue = React.useCallback(
    (v: string) => {
      table.getColumn(resolvedSearchColumnId)?.setFilterValue(v);
    },
    [table, resolvedSearchColumnId]
  );

  const toggleAllPageSelected = React.useCallback(
    (v: boolean) => table.toggleAllPageRowsSelected(v),
    [table]
  );

  const prevPage = React.useCallback(() => table.previousPage(), [table]);
  const nextPage = React.useCallback(() => table.nextPage(), [table]);

  const toggleColumnVisibility = React.useCallback(
    (id: string, v: boolean) => table.getColumn(id)?.toggleVisibility(v),
    [table]
  );

  const isColumnVisible = React.useCallback(
    (id: string) => table.getColumn(id)?.getIsVisible() ?? true,
    [table]
  );

  return (
    <DataTableView
      loading={loading}
      emptyMessage={emptyMessage}
      searchPlaceholder={searchPlaceholder}
      viewModel={{
        headerGroups,
        rows,
        allHideableColumns,
        selectedCount,

        isAllPageSelected: table.getIsAllPageRowsSelected(),
        toggleAllPageSelected,

        canPrev: table.getCanPreviousPage(),
        canNext: table.getCanNextPage(),
        prevPage,
        nextPage,

        isColumnVisible,
        toggleColumnVisibility,

        searchValue,
        setSearchValue,
      }}
    />
  );
}
