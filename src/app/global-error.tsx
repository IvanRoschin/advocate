'use client';

// Next.js only renders this boundary when the root layout itself throws,
// so — unlike every other error.tsx — it has to provide its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-white p-10 text-gray-900">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold">Щось пішло не так</h1>
            <p className="mt-3 text-sm text-gray-600">
              {error.message || 'Сталася непередбачена помилка застосунку.'}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-gray-900 px-5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
