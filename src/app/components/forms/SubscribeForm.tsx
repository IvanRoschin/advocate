'use client';

import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { apiUrl, routes } from '@/app/config/routes';
import subscriberSchema from '@/app/helpers/validationSchemas/subscriber.schema';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { serverEnv } from '@/app/lib/server/env/serverEnv';
import { useThemeStore } from '@/app/store/theme.store';
import { Checkbox, Input } from '@/components';
import { Turnstile } from '@marsidev/react-turnstile';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
type Props = {
  variant?: 'default' | 'aside';
};

const SubscribeForm = ({ variant = 'default' }: Props) => {
  const isAside = variant === 'aside';
  const theme = useThemeStore(state => state.theme);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const siteKey = serverEnv.cloudflare.turnstileSiteKey;

  const isCaptchaConfigured = Boolean(siteKey);

  return (
    <Formik
      initialValues={{ email: '', consent: false, website: '' }}
      validationSchema={subscriberSchema}
      onSubmit={async (values, { resetForm }) => {
        if (!isCaptchaConfigured) {
          toast.error('Cloudflare Turnstile не налаштований');
          return;
        }

        if (!turnstileToken) {
          toast.error('Будь ласка, підтвердіть, що ви не робот');
          return;
        }

        try {
          await apiFetch(apiUrl(routes.api.v1.subscribe), {
            method: 'POST',
            body: JSON.stringify({
              email: values.email.trim(),
              consent: values.consent,
              website: values.website,
              turnstileToken,
            }),
          });

          toast.success('Ви успішно підписались на розсилку!');

          resetForm();
          setTurnstileToken(null);
          turnstileRef.current?.reset();
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : 'Сталася невідома помилка';

          toast.error(message);

          setTurnstileToken(null);
          turnstileRef.current?.reset();
        }
      }}
    >
      {() => (
        <Form
          className={
            isAside
              ? 'mt-3 grid w-full gap-3 text-xs'
              : 'mt-4 flex w-full max-w-md flex-col items-stretch gap-4 text-xs'
          }
        >
          <div className="w-full">
            <Input
              name="email"
              label="Email"
              type="email"
              required
              className={isAside ? 'text-sm' : undefined}
            />
          </div>

          <Checkbox name="consent">
            Я згоден(-на) на обробку персональних даних відповідно до{' '}
            <a href="/privacy-policy" target="_blank" className="underline">
              Політики конфіденційності
            </a>
          </Checkbox>

          {/* Honeypot */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />

          {siteKey && (
            <div className="flex flex-col items-center gap-2">
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                options={{
                  theme: theme === 'dark' ? 'dark' : 'light',
                  size: isAside ? 'flexible' : 'normal',
                  language: 'uk',
                }}
                onSuccess={token => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => {
                  setTurnstileToken(null);
                  toast.error('Помилка перевірки Cloudflare Turnstile');
                }}
              />

              {!turnstileToken && (
                <p className="text-secondary text-center text-xs">
                  Підтвердіть, що ви не робот.
                </p>
              )}
            </div>
          )}

          <div className="w-full">
            <Btn
              radius={12}
              type="submit"
              label="Підписатися"
              className={
                isAside
                  ? 'min-h-11 w-full px-4 py-2 text-sm'
                  : 'min-h-[3.7rem] w-full px-6 py-3'
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SubscribeForm;
