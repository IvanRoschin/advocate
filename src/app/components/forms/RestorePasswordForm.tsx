'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useAuthFeedback } from '@/app/(auth)/_components/AuthFeedbackProvider';
import { routes } from '@/app/config/routes';
import { Btn, Input } from '@/components';

interface InitialStateType {
  password: string;
  confirmPassword: string;
}

type RestorePasswordResponse = {
  ok: boolean;
  message: string;
};

type Props = {
  token: string;
};

const RestorePasswordForm = ({ token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openAuthNotification } = useAuthFeedback();

  const initialValues: InitialStateType = {
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (isLoading) return;

    if (values.password !== values.confirmPassword) {
      openAuthNotification({
        title: 'Помилка',
        message: 'Паролі не співпадають.',
      });
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(routes.api.v1.auth.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data: RestorePasswordResponse = await res.json();

      if (data.ok) {
        resetForm();
      }

      openAuthNotification({
        title: data.ok ? 'Успіх' : 'Помилка',
        message: data.message,
        redirectTo: data.ok ? routes.public.auth.signIn : undefined,
      });
    } catch (error) {
      console.error('[RESTORE_PASSWORD_FORM_ERROR]', error);

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
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form className="flex flex-col gap-5">
            <Input
              label="Новий пароль"
              type="password"
              name="password"
              required
            />
            <Input
              label="Повторіть пароль"
              type="password"
              name="confirmPassword"
              required
            />

            <div className="flex justify-center">
              <motion.div
                className="inline-block"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Btn
                  type="submit"
                  label={isLoading ? 'Завантаження...' : 'Змінити пароль'}
                  disabled={isLoading}
                />
              </motion.div>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default RestorePasswordForm;
