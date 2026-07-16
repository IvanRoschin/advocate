'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { clientEnv } from '@/app/lib/client/env/clientEnv';
import { useThemeStore } from '@/app/store/theme.store';
import { Turnstile } from '@marsidev/react-turnstile';

import type { TurnstileInstance } from '@marsidev/react-turnstile';

type CaptchaSize = 'normal' | 'flexible' | 'compact';

export function usePublicCaptcha(size: CaptchaSize = 'normal') {
  const theme = useThemeStore(state => state.theme);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const siteKey = clientEnv.cloudflare.turnstileSiteKey;
  const isConfigured = Boolean(siteKey);

  const reset = () => {
    setToken(null);
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
        onSuccess={setToken}
        onExpire={() => setToken(null)}
        onError={() => {
          setToken(null);
          toast.error('Помилка перевірки Cloudflare Turnstile');
        }}
      />

      {!token && (
        <p className="text-secondary text-center text-xs">
          Підтвердіть, що ви не робот.
        </p>
      )}
    </div>
  ) : null;

  return { token, isConfigured, widget, reset };
}
