'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAuthFeedback } from '@/app/(auth)/_components/AuthFeedbackProvider';
import { requestPasswordReset } from '@/app/actions/auth.actions';
import { serverEnv } from '@/app/lib/server/env/serverEnv';
import { useThemeStore } from '@/app/store/theme.store';
import { Btn, Input } from '@/components';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface InitialStateType {
  email: string;
}

export const AUTH_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_SENT: 'EMAIL_SENT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_SEND_ERROR: 'EMAIL_SEND_ERROR',
} as const;

export type AuthCode = (typeof AUTH_CODES)[keyof typeof AUTH_CODES];

type ForgotPasswordResponse = {
  ok: boolean;
  code?: AuthCode;
  message: string;
};

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { openAuthNotification } = useAuthFeedback();

  const theme = useThemeStore(state => state.theme);

  const siteKey = serverEnv.cloudflare.turnstileSiteKey;

  const isCaptchaConfigured = Boolean(siteKey);

  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const initialValues: InitialStateType = {
    email: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (!isCaptchaConfigured) {
      toast.error('Cloudflare Turnstile не налаштований');
      return;
    }

    if (!turnstileToken) {
      toast.error('Будь ласка, підтвердіть, що ви не робот');
      return;
    }
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res: ForgotPasswordResponse = await requestPasswordReset({
        email: values.email,
      });

      if (res.ok) {
        resetForm();
        setTurnstileToken(null);
        turnstileRef.current?.reset();
      }

      openAuthNotification({
        title: 'Повідомлення',
        message: res.message,
      });
    } catch (error) {
      console.error('[FORGOT_PASSWORD_FORM_ERROR]', error);

      openAuthNotification({
        title: 'Помилка',
        message: 'Сталася помилка. Спробуйте ще раз пізніше.',
      });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => {
          const isSubmitDisabled =
            isSubmitting || !isCaptchaConfigured || !turnstileToken;
          return (
            <Form className="flex flex-col gap-5">
              <Input label="Email" type="email" name="email" required />
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

              <div className="flex justify-center">
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Btn
                    type="submit"
                    label={
                      isLoading ? 'Завантаження...' : 'Надіслати посилання'
                    }
                    disabled={isSubmitDisabled}
                    className="min-w-30 px-5 py-2 text-base md:min-w-37.5"
                  />
                </motion.div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
};

export default ForgotPasswordForm;
