'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Btn } from '@/app/components';
import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

export default function ResendVerificationButton() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('Email не знайдено');
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch<{ message: string }>(
        apiUrl(routes.api.v1.auth.resendVerification),
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );

      toast.success(res.message || 'Лист надіслано');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Помилка відправки листа'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Btn
      type="button"
      onClick={handleResend}
      disabled={loading}
      className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-5 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? 'Надсилання...' : 'Надіслати повторно'}
    </Btn>
  );
}
