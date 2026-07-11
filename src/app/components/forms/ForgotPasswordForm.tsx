'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useAuthFeedback } from '@/app/(auth)/_components/AuthFeedbackProvider';
import { requestPasswordReset } from '@/app/actions/auth.actions';
import { Btn, Input } from '@/components';

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

  const initialValues: InitialStateType = {
    email: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res: ForgotPasswordResponse = await requestPasswordReset({
        email: values.email,
      });

      if (res.ok) {
        resetForm();
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
        {() => (
          <Form className="flex flex-col gap-5">
            <Input label="Email" type="email" name="email" required />

            <div className="flex justify-center">
              <motion.div
                className="inline-block"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Btn
                  type="submit"
                  label={isLoading ? 'Завантаження...' : 'Надіслати посилання'}
                  disabled={isLoading}
                  className="min-w-30 px-5 py-2 text-base md:min-w-37.5"
                />
              </motion.div>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ForgotPasswordForm;
