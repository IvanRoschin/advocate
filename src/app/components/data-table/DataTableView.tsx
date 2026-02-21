/* @react-compiler-disable */
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender, HeaderGroup, Row } from '@tanstack/react-table';

type ViewModel<TData> = {
  headerGroups: HeaderGroup<TData>[];
  rows: Row<TData>[];
  allHideableColumns: { id: string; getIsVisible: () => boolean }[];
  selectedCount: number;

  isAllPageSelected: boolean;
  toggleAllPageSelected: (v: boolean) => void;

  canPrev: boolean;
  canNext: boolean;
  prevPage: () => void;
  nextPage: () => void;

  isColumnVisible: (id: string) => boolean;
  toggleColumnVisibility: (id: string, v: boolean) => void;

  searchValue: string;
  setSearchValue: (v: string) => void;
};

type Props<TData> = {
  loading: boolean;
  emptyMessage: string;
  searchPlaceholder: string;
  viewModel: ViewModel<TData>;
};

export function DataTableView<TData>({
  loading,
  emptyMessage,
  searchPlaceholder,
  viewModel,
}: Props<TData>) {
  const {
    headerGroups,
    rows,
    allHideableColumns,
    selectedCount,
    isAllPageSelected,
    toggleAllPageSelected,
    canPrev,
    canNext,
    prevPage,
    nextPage,
    isColumnVisible,
    toggleColumnVisibility,
    searchValue,
    setSearchValue,
  } = viewModel;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="max-w-xs"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Колонки
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {allHideableColumns.map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={isColumnVisible(column.id)}
                onCheckedChange={value =>
                  toggleColumnVisibility(column.id, !!value)
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map(hg => (
              <TableRow key={hg.id}>
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllPageSelected}
                    onCheckedChange={v => toggleAllPageSelected(!!v)}
                    aria-label="Select all"
                  />
                </TableHead>

                {hg.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={headerGroups?.[0]?.headers?.length ?? 1}
                  className="text-muted-foreground h-24 text-center text-sm"
                >
                  Завантаження…
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  <TableCell className="w-10">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={v => row.toggleSelected(!!v)}
                      aria-label="Select row"
                    />
                  </TableCell>

                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={(headerGroups?.[0]?.headers?.length ?? 0) + 1}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Вибрано: {selectedCount}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!canPrev}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!canNext}
          >
            Вперед
          </Button>
        </div>
      </div>
    </div>
  );
}
