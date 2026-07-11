'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheck, FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';

import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

type VerifyResponse = {
  message: string;
  success: boolean;
};

type Status = 'pending' | 'success' | 'error';

const STATUS_STYLES: Record<
  Status,
  { icon: React.ReactNode; circleClass: string }
> = {
  pending: {
    icon: <FiLoader className="animate-spin" size={22} />,
    circleClass: 'bg-foreground/8 text-foreground/70',
  },
  success: {
    icon: <FiCheck size={24} />,
    circleClass: 'bg-green-500/10 text-green-600',
  },
  error: {
    icon: <FiAlertCircle size={22} />,
    circleClass: 'bg-amber-500/10 text-amber-600',
  },
};

export default function VerificationPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>(token ? 'pending' : 'error');
  const [message, setMessage] = useState(
    token ? 'Перевіряємо посилання...' : 'Токен не знайдено.'
  );

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
        setStatus(result.success ? 'success' : 'error');

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
        setStatus('error');
      }
    };

    void verify();
  }, [token, router]);

  const { icon, circleClass } = STATUS_STYLES[status];

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-4 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`flex h-14 w-14 items-center justify-center rounded-full ${circleClass}`}
        >
          {icon}
        </motion.div>
      </AnimatePresence>

      <div>
        <h2 className="text-foreground text-lg font-medium">{message}</h2>

        {status === 'success' && (
          <p className="text-muted-foreground mt-1 text-sm">
            Перенаправляємо на сторінку входу...
          </p>
        )}
      </div>
    </div>
  );
}
