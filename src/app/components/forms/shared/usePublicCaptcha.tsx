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

// Коди сімейств 300*** / 600*** — це "challenge failed" (Turnstile вважає
// відвідувача підозрілим: розширення, VPN, DevTools тощо). Cloudflare
// рекомендує просто повторити спробу, тож перші кілька разів робимо reset()
// мовчки, без toast і без шуму в консолі.
const MAX_SILENT_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

export function isRetryableTurnstileError(code: string | undefined) {
  return typeof code === 'string' && /^(300|600)\d{3}$/.test(code);
}

export function usePublicCaptcha(size: CaptchaSize = 'normal') {
  const theme = useThemeStore(state => state.theme);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  // Поки користувач проходить інтерактивну перевірку (клік по чекбоксу),
  // таймаут "не завантажилась" не повинен спрацьовувати.
  const [interactive, setInteractive] = useState(false);
  const retriesRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);

  const siteKey = clientEnv.cloudflare.turnstileSiteKey;
  const isConfigured = Boolean(siteKey);

  useEffect(() => {
    // loadFailed скидається явно в reset()/onSuccess (звичайні колбеки, а
    // не тіло ефекту) — тут лише плануємо таймаут очікування токена.
    if (!isConfigured || token || interactive) return;

    const timer = window.setTimeout(() => {
      setLoadFailed(true);
    }, LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isConfigured, token, interactive]);

  useEffect(
    () => () => {
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
    },
    []
  );

  const reset = () => {
    retriesRef.current = 0;
    setToken(null);
    setLoadFailed(false);
    setInteractive(false);
    turnstileRef.current?.reset();
  };

  const handleError = (code: string) => {
    setToken(null);

    if (
      isRetryableTurnstileError(code) &&
      retriesRef.current < MAX_SILENT_RETRIES
    ) {
      retriesRef.current += 1;
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = window.setTimeout(() => {
        turnstileRef.current?.reset();
      }, RETRY_DELAY_MS);
      // true = помилку оброблено: Turnstile не дублює її warning'ом у консоль
      return true;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Turnstile error code:', code);
    }
    setLoadFailed(true);
    toast.error(
      'Перевірка безпеки не пройшла. Оновіть сторінку і спробуйте ще раз.',
      {
        id: 'turnstile-error',
      }
    );
    return true;
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
          retriesRef.current = 0;
          setToken(value);
          setLoadFailed(false);
          setInteractive(false);
        }}
        onExpire={() => setToken(null)}
        onBeforeInteractive={() => setInteractive(true)}
        onAfterInteractive={() => setInteractive(false)}
        onTimeout={() => {
          // інтерактивна перевірка не пройдена вчасно — показуємо новий челендж
          setInteractive(false);
          turnstileRef.current?.reset();
        }}
        onError={handleError}
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
