'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { clientEnv } from '@/app/lib/client/env/clientEnv';
import { useThemeStore } from '@/app/store/theme.store';
import { Turnstile } from '@marsidev/react-turnstile';

import type { TurnstileInstance } from '@marsidev/react-turnstile';

type CaptchaSize = 'normal' | 'flexible' | 'compact';

// Скільки часу чекати на токен від Turnstile, перш ніж вважати,
// що віджет не завантажився (заблокований adblock'ом, немає мережі тощо),
// і показати користувачу зрозуміле пояснення замість "вічного" стану очікування.
const LOAD_TIMEOUT_MS = 12000;

export function usePublicCaptcha(size: CaptchaSize = 'normal') {
  const theme = useThemeStore(state => state.theme);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const siteKey = clientEnv.cloudflare.turnstileSiteKey;
  const isConfigured = Boolean(siteKey);

  useEffect(() => {
    // loadFailed скидається явно в reset()/onSuccess (звичайні колбеки, а
    // не тіло ефекту) — тут лише плануємо таймаут очікування токена.
    if (!isConfigured || token) return;

    const timer = window.setTimeout(() => {
      setLoadFailed(true);
    }, LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isConfigured, token]);

  const reset = () => {
    setToken(null);
    setLoadFailed(false);
    turnstileRef.current?.reset();
  };

  const widget = isConfigured ? (
    <div className="flex flex-col items-center gap-2">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey as string}
        options={{
          theme: theme === 'dark' ? 'dark' : 'light',
          size,
          language: 'uk',
        }}
        onSuccess={value => {
          setToken(value);
          setLoadFailed(false);
        }}
        onExpire={() => setToken(null)}
        onError={() => {
          setToken(null);
          setLoadFailed(true);
          toast.error('Помилка перевірки Cloudflare Turnstile');
        }}
      />

      {!token && (
        <p className="text-secondary text-center text-xs">
          {loadFailed
            ? 'Перевірка безпеки не завантажилась. Оновіть сторінку і спробуйте ще раз.'
            : 'Підтвердіть, що ви не робот.'}
        </p>
      )}
    </div>
  ) : null;

  return { token, isConfigured, loadFailed, widget, reset };
}
