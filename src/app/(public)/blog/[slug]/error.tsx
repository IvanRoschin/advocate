'use client';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="p-10">
      <h2>Что-то пошло не так</h2>
      <p>{error.message}</p>
    </div>
  );
}
