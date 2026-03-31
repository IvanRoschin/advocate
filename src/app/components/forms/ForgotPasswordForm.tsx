'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import router from 'next/router';
import { useState } from 'react';

import { routes } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { Btn, Input, Modal, ModalNotification } from '@/components';

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
  const [message, setMessage] = useState('');

  const notificationModal = useModal('notificationModal');

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
      setMessage('');

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

      setMessage(data.message);
      notificationModal.open();

      if (data.ok) {
        resetForm();
      }
    } catch (error) {
      console.error('[FORGOT_PASSWORD_FORM_ERROR]', error);

      setMessage('Сталася помилка. Спробуйте ще раз пізніше.');
      notificationModal.open();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:max-w-lg md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="subtitle mb-6">Відновлення паролю</h2>

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
                      label={
                        isLoading ? 'Завантаження...' : 'Надіслати посилання'
                      }
                      disabled={isLoading}
                      className="min-w-30 px-5 py-2 text-base md:min-w-37.5"
                    />
                  </motion.div>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>

      <Modal
        isOpen={notificationModal.isOpen}
        onClose={notificationModal.close}
        body={
          <ModalNotification
            title="Повідомлення"
            message={message}
            onConfirm={() => {
              notificationModal.close();

              if (message === 'Пароль успішно змінено.') {
                router.replace(routes.public.auth.signIn);
              }
            }}
          />
        }
      />
    </div>
  );
};

export default ForgotPasswordForm;
