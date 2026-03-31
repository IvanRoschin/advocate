'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { routes } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { Btn, Input, Modal, ModalNotification } from '@/components';

interface InitialStateType {
  newPassword: string;
  confirmNewPassword: string;
  token: string;
}

type ResetPasswordResponse = {
  ok: boolean;
  code?: 'INVALID_TOKEN' | 'VALIDATION_ERROR' | 'INTERNAL_SERVER_ERROR';
  message?: string;
};

const RestorePasswordForm = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const notificationModal = useModal('notificationModal');

  const initialValues: InitialStateType = {
    newPassword: '',
    confirmNewPassword: '',
    token,
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (isLoading) return;

    if (!values.token.trim()) {
      setMessage('Відсутній або некоректний токен відновлення пароля.');
      notificationModal.open();
      return;
    }

    if (!values.newPassword.trim() || !values.confirmNewPassword.trim()) {
      setMessage('Новий пароль та підтвердження пароля є обовʼязковими.');
      notificationModal.open();
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      setMessage('Паролі не збігаються.');
      notificationModal.open();
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

      const res = await fetch(routes.api.v1.auth.resetPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: values.token.trim(),
          password: values.newPassword,
        }),
      });

      const data: ResetPasswordResponse = await res.json();

      if (!res.ok || !data.ok) {
        setMessage(
          data.message || 'Не вдалося змінити пароль. Спробуйте пізніше.'
        );
        notificationModal.open();
        return;
      }

      setMessage('Пароль успішно змінено.');
      notificationModal.open();
      resetForm({
        values: {
          newPassword: '',
          confirmNewPassword: '',
          token: values.token,
        },
      });
    } catch (error) {
      console.error('[RESTORE_PASSWORD_FORM_ERROR]', error);
      setMessage('Сталася помилка. Спробуйте ще раз пізніше.');
      notificationModal.open();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="subtitle mb-6">Сторінка зміни паролю</h2>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {() => (
              <Form className="flex flex-col gap-5">
                <div className="relative">
                  <Input
                    name="newPassword"
                    label="Новий пароль"
                    type={showPassword1 ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword1(prev => !prev)}
                    className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-gray-500"
                    aria-label={
                      showPassword1 ? 'Сховати пароль' : 'Показати пароль'
                    }
                    tabIndex={-1}
                  >
                    {showPassword1 ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    name="confirmNewPassword"
                    label="Повторіть пароль"
                    type={showPassword2 ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(prev => !prev)}
                    className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-gray-500"
                    aria-label={
                      showPassword2 ? 'Сховати пароль' : 'Показати пароль'
                    }
                    tabIndex={-1}
                  >
                    {showPassword2 ? (
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
      </div>

      <Modal
        body={
          <ModalNotification
            title="Повідомлення"
            message={message}
            onConfirm={notificationModal.close}
          />
        }
        isOpen={notificationModal.isOpen}
        onClose={notificationModal.close}
      />
    </div>
  );
};

export default RestorePasswordForm;
