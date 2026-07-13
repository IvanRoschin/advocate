'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { useAuthFeedback } from '@/app/(auth)/_components/AuthFeedbackProvider';
import { resetPassword } from '@/app/actions/auth.actions';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      const res: RestorePasswordResponse = await resetPassword({
        token,
        newPassword: values.password,
      });

      if (res.ok) {
        resetForm();
      }

      openAuthNotification({
        title: res.ok ? 'Успіх' : 'Помилка',
        message: res.message,
        redirectTo: res.ok ? routes.public.auth.signIn : undefined,
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
            <div className="relative">
              <Input
                label="Новий пароль"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                autoComplete=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-gray-500"
                aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Повторіть пароль"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete=""
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-gray-500"
                aria-label={
                  showConfirmPassword ? 'Сховати пароль' : 'Показати пароль'
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>

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
