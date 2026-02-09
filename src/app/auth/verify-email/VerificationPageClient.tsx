'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { routes } from '@/app/config/routes';

export default function VerificationPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Перевріка валідації...');
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => {
        setMessage('Токен не знайдений.');
        setSuccess(false);
      });
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const result: { message: string; success: boolean } = await res.json();

        setMessage(result.message);
        setSuccess(result.success);

        if (result.success) {
          setTimeout(() => router.push(routes.public.auth.signIn), 3000);
        }
      } catch {
        setMessage('Помилка перевірки токена.');
        setSuccess(false);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2
        className={`mt-4 text-xl ${success ? 'text-green-600' : 'text-red-600'}`}
      >
        {message}
      </h2>
      {success && (
        <p className="mt-2 text-gray-500">
          Ви будете перенаправлені на сторінку входу...
        </p>
      )}
    </div>
  );
}
