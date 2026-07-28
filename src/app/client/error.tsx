'use client';

import Link from 'next/link';

export default function ClientPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-[60vh] items-center justify-center p-10">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Щось пішло не так</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          {error.message ||
            'Сталася помилка під час завантаження цієї сторінки кабінету.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-accent text-accent-foreground inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-medium transition hover:opacity-90"
          >
            Спробувати ще раз
          </button>
          <Link
            href="/client"
            className="border-border bg-card text-foreground hover:bg-muted inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition"
          >
            До кабінету
          </Link>
        </div>
      </div>
    </div>
  );
}
