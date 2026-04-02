/** @react-compiler-disable */
'use client';

import { ReactNode, useState } from 'react';

import { Loader } from '@/components';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { AdminTableProps } from './types';

type AdminTableViewProps<TData> = {
  table: ReturnType<typeof useReactTable<TData>>;
  emptyMessage: string;
  mobileRender?: (row: TData) => ReactNode;
};

function AdminTableDesktop<TData>({
  table,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
}) {
  const rows = table.getRowModel().rows;

  return (
    <div className="hidden lg:block">
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 border-border border-b">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-foreground px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {rows.map(row => (
                <tr
                  key={row.id}
                  className="border-border hover:bg-muted/30 border-b last:border-b-0"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="text-foreground px-4 py-3 align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DefaultMobileCard<TData>({ row }: { row: Row<TData> }) {
  const visibleCells = row.getVisibleCells();

  return (
    <article className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className="space-y-3">
        {visibleCells.map(cell => {
          const header = cell.column.columnDef.header;

          return (
            <div
              key={cell.id}
              className="flex items-start justify-between gap-3 border-b border-black/5 pb-3 last:border-b-0 last:pb-0 dark:border-white/10"
            >
              <div className="text-muted-foreground min-w-27.5 text-xs font-medium">
                {typeof header === 'string' ? header : cell.column.id}
              </div>

              <div className="text-foreground min-w-0 flex-1 text-right text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function AdminTableMobile<TData>({
  table,
  mobileRender,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  mobileRender?: (row: TData) => ReactNode;
}) {
  const rows = table.getRowModel().rows;

  return (
    <div className="grid grid-cols-1 gap-4 lg:hidden">
      {rows.map(row => (
        <div key={row.id}>
          {mobileRender ? (
            mobileRender(row.original)
          ) : (
            <DefaultMobileCard row={row} />
          )}
        </div>
      ))}
    </div>
  );
}

function AdminTableView<TData>({
  table,
  emptyMessage,
  mobileRender,
}: AdminTableViewProps<TData>) {
  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-2xl border px-4 py-10 text-center text-sm shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <AdminTableMobile table={table} mobileRender={mobileRender} />
      <AdminTableDesktop table={table} />
    </>
  );
}

export function AdminTable<TData>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'Дані відсутні',
  mobileRender,
}: AdminTableProps<TData> & {
  mobileRender?: (row: TData) => ReactNode;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="border-border bg-card rounded-2xl border px-4 py-10 shadow-sm">
        <Loader />
      </div>
    );
  }

  return (
    <AdminTableView
      table={table}
      emptyMessage={emptyMessage}
      mobileRender={mobileRender}
    />
  );
}

export const Center = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-18 w-full items-center justify-center text-center">
    {children}
  </div>
);
