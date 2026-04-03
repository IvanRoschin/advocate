type Props<T> = {
  row: T;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

export function CardActions<T>({ row, onEdit, onDelete }: Props<T>) {
  return (
    <div className="flex flex-wrap justify-between">
      <button
        type="button"
        onClick={() => onEdit(row)}
        className="bg-foreground text-background inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-90"
      >
        Відкрити
      </button>

      <button
        type="button"
        onClick={() => onDelete(row)}
        className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
      >
        Видалити
      </button>
    </div>
  );
}
