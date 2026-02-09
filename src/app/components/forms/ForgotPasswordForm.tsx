'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useModal } from '@/app/hooks/useModal';
// import { sendPasswordResetEmailAction } from '@/app/actions/auth';
// import { forgotPasswordFormSchema } from '@/app/helpers/validationSchemas';
// import { useNotificationModal } from '@/app/hooks';
import { Btn, Input, Modal, ModalNotification } from '@/components';

interface InitialStateType {
  email: string;
}

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
    setIsLoading(true);
    setMessage('');

    // const res = await sendPasswordResetEmailAction(values.email);

    // setMessage(res.message);
    notificationModal.open(); // ← открыть модалку

    setIsLoading(false);
    resetForm(); // ← вызвать resetForm
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
            // validationSchema={forgotPasswordFormSchema}
            enableReinitialize
          >
            {() => (
              <Form className="flex flex-col gap-5">
                <Input label="Email" type="text" name="email" required />

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0px 0px 12px rgba(59,130,246,0.5)',
                  }}
                  whileTap={{ scale: 0.97 }}
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

export default ForgotPasswordForm;
