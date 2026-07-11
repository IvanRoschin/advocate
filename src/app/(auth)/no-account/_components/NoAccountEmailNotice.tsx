'use client';

import { useSearchParams } from 'next/navigation';

export default function NoAccountEmailNotice() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  if (!email) return null;

  return (
    <p className="text-foreground mb-2 text-sm font-medium">
      За адресою <span className="font-semibold">{email}</span> кабінету в
      системі не існує.
    </p>
  );
}
