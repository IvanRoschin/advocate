import Link from 'next/link';

export default function PageSettingsPage() {
  return (
    <div className="container space-y-6 py-6">
      <div>
        <h1 className="text-accent text-2xl font-semibold">
          Налаштування сторінок
        </h1>
        <p className="text-muted-foreground text-sm">
          Оберіть тип сторінки для налаштування layout.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/page-settings/article"
          className="rounded-2xl border p-5"
        >
          Article
        </Link>
        <Link
          href="/admin/page-settings/service"
          className="rounded-2xl border p-5"
        >
          Service
        </Link>
        <Link
          href="/admin/page-settings/home"
          className="rounded-2xl border p-5"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
