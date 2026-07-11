'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { registerAccount } from '@/app/actions/register.actions';
import { normalizePhoneUA } from '@/app/lib/utils/normalizePhone';
import { Btn, Input } from '@/components';

interface InitialStateType {
  name: string;
  phone: string;
  email: string;
}

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const initialValues: InitialStateType = {
    name: '',
    phone: '+380',
    email: searchParams.get('email') ?? '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const result = await registerAccount({
        name: values.name.trim(),
        phone: normalizePhoneUA(values.phone),
        email: values.email.trim(),
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setIsSent(true);
      resetForm();
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не вдалося надіслати заявку'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <p className="text-muted-foreground text-center text-sm leading-relaxed sm:text-base">
        Дякуємо! Ми перевіримо заявку та надішлемо на вашу email-адресу
        посилання для встановлення пароля та активації кабінету.
      </p>
    );
  }

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
            <Input name="name" label="Ім'я" type="text" required />
            <Input
              name="phone"
              label="Телефон"
              type="tel"
              required
              placeholder="+380961983729"
            />
            <Input
              name="email"
              label="Електронна адреса"
              type="mail"
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
                  label={isLoading ? 'Надсилання...' : 'Надіслати заявку'}
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

export default RegisterForm;
