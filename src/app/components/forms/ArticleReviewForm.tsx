'use client';

import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { useThemeStore } from '@/app/store/theme.store';
import { Input, Textarea } from '@/components';
import { Turnstile } from '@marsidev/react-turnstile';

import type { TurnstileInstance } from '@marsidev/react-turnstile';

type Props = {
  articleId: string;
  onSubmit: (values: {
    authorName: string;
    text: string;
    rating?: number;
    targetType: 'article';
    targetId: string;
    turnstileToken: string;
  }) => Promise<void>;
};

const ArticleReviewForm = ({ articleId, onSubmit }: Props) => {
  const theme = useThemeStore(state => state.theme);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isCaptchaConfigured = Boolean(siteKey);

  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  return (
    <Formik
      initialValues={{
        authorName: '',
        text: '',
        rating: 5,
        website: '',
      }}
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
          await onSubmit({
            authorName: values.authorName.trim(),
            text: values.text.trim(),
            rating: values.rating,
            targetType: 'article',
            targetId: articleId,
            turnstileToken,
          });

          toast.success('Відгук успішно надіслано!');

          resetForm();
          setTurnstileToken(null);
          turnstileRef.current?.reset();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Помилка надсилання відгуку';

          toast.error(message);

          setTurnstileToken(null);
          turnstileRef.current?.reset();
        }
      }}
    >
      {({ isSubmitting }) => {
        const isSubmitDisabled =
          isSubmitting || !isCaptchaConfigured || !turnstileToken;

        return (
          <Form className="grid gap-4">
            <Input name="authorName" label="Ваше ім’я" required />

            <Textarea name="text" label="Ваш відгук" rows={5} required />

            <Input name="rating" label="Оцінка 1–5" type="number" />

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
                    size: 'normal',
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

            <Btn
              type="submit"
              label="Надіслати відгук"
              uiVariant="accent"
              disabled={isSubmitDisabled}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default ArticleReviewForm;
