'use client';

import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { apiUrl } from '@/app/config/routes';
import subscriberSchema from '@/app/helpers/validationSchemas/subscriber.schema';
import { useThemeStore } from '@/app/store/theme.store';
import { Input } from '@/components';
import { Turnstile } from '@marsidev/react-turnstile';

import type { TurnstileInstance } from '@marsidev/react-turnstile';

type Props = {
  variant?: 'default' | 'aside';
};

const SubscribeForm = ({ variant = 'default' }: Props) => {
  const isAside = variant === 'aside';

  const theme = useThemeStore(state => state.theme);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isCaptchaConfigured = Boolean(siteKey);

  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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
          const res = await fetch(apiUrl('subscribe'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...values,
              email: values.email.trim(),
              turnstileToken,
            }),
          });

          const json = await res.json();

          if (!res.ok) {
            toast.error(`Помилка: ${json?.error?.message || res.statusText}`);

            setTurnstileToken(null);
            turnstileRef.current?.reset();
            return;
          }

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
      {({ isValid, isSubmitting }) => {
        const isSubmitDisabled =
          !isValid || isSubmitting || !isCaptchaConfigured || !turnstileToken;

        return (
          <Form
            className={
              isAside
                ? 'mt-3 grid w-full gap-3 text-xs'
                : 'mt-4 flex w-full max-w-md flex-col items-stretch gap-4 text-xs'
            }
          >
            <div className={isAside ? 'w-full' : 'w-full'}>
              <Input
                name="email"
                label="Email"
                type="email"
                required
                className={isAside ? 'text-sm' : undefined}
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="hidden"
            />

            {/* Cloudflare Turnstile */}
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
                  onSuccess={token => {
                    setTurnstileToken(token);
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                  }}
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

            <div className={isAside ? 'w-full' : 'w-full'}>
              <Btn
                radius={12}
                type="submit"
                label="Підписатися"
                disabled={isSubmitDisabled}
                className={
                  isAside
                    ? 'min-h-11 w-full px-4 py-2 text-sm'
                    : 'min-h-[3.7rem] w-full px-6 py-3'
                }
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SubscribeForm;
