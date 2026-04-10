'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

type VerifyResponse = {
  message: string;
  success: boolean;
};

export default function VerificationPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [message, setMessage] = useState('Перевірка валідації...');
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const result = await apiFetch<VerifyResponse>(
          apiUrl(routes.api.v1.auth.verify),
          {
            method: 'POST',
            body: JSON.stringify({ token }),
          }
        );

        setMessage(result.message);
        setSuccess(result.success);

        if (result.success) {
          toast.success('Кабінет успішно активовано');

          setTimeout(() => {
            router.push(routes.public.auth.signIn);
          }, 3000);
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : 'Помилка перевірки токена.'
        );
        setSuccess(false);
      }
    };

    void verify();
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="mt-4 text-xl text-red-600">Токен не знайдено.</h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2
        className={`mt-4 text-xl ${
          success === null
            ? 'text-foreground'
            : success
              ? 'text-green-600'
              : 'text-red-600'
        }`}
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
