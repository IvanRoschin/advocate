'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useAuthFeedback } from '@/app/(auth)/_components/AuthFeedbackProvider';
import { routes } from '@/app/config/routes';
import { Btn, Input } from '@/components';

interface InitialStateType {
  email: string;
}

type ForgotPasswordResponse = {
  ok: boolean;
  code?:
    | 'EMAIL_SENT'
    | 'USER_NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'EMAIL_SEND_ERROR';
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

      const res = await fetch(routes.api.v1.auth.restorePassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email.trim().toLowerCase(),
        }),
      });

      const data: ForgotPasswordResponse = await res.json();

      if (data.ok) {
        resetForm();
      }

      openAuthNotification({
        title: 'Повідомлення',
        message: data.message,
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
