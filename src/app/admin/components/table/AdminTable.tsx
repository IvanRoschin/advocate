/** @react-compiler-disable */

'use client';

import { useState } from 'react';

import { Loader } from '@/components';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { AdminTableProps } from './types';

export function AdminTable<TData>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'Дані відсутні',
}: AdminTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border">
      <table className="w-full text-sm">
        <thead className="bg-slate-200">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isSortable = header.column.getCanSort();
                const sortState = header.column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    className="p-2 text-left font-medium"
                    onClick={
                      isSortable
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        isSortable ? 'cursor-pointer select-none' : ''
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {sortState === 'asc' && '↑'}
                      {sortState === 'desc' && '↓'}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
