type AdminTableToolbarProps = {
  children: React.ReactNode;
};

export function AdminTableToolbar({ children }: AdminTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}
