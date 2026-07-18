'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { registerAccount } from '@/app/actions/register.actions';
import { HoneypotField } from '@/app/components/forms/shared/HoneypotField';
import { usePublicCaptcha } from '@/app/components/forms/shared/usePublicCaptcha';
import { normalizePhoneUA } from '@/app/lib/utils/normalizePhone';
import { Btn, Input } from '@/components';

interface InitialStateType {
  name: string;
  phone: string;
  email: string;
  website: string;
}

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const [isSent, setIsSent] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const captcha = usePublicCaptcha();

  const initialValues: InitialStateType = {
    name: '',
    phone: '+380',
    email: searchParams.get('email') ?? '',
    website: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    if (!captcha.isConfigured) {
      toast.error('Cloudflare Turnstile не налаштований');
      return;
    }

    if (!captcha.token) {
      toast.error('Будь ласка, підтвердіть, що ви не робот');
      return;
    }

    try {
      const result = await registerAccount({
        name: values.name.trim(),
        phone: normalizePhoneUA(values.phone),
        email: values.email.trim(),
        website: values.website,
        turnstileToken: captcha.token,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setIsSent(true);
      resetForm();
      captcha.reset();
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не вдалося надіслати заявку'
      );
      captcha.reset();
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
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
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

            <HoneypotField />

            {captcha.isConfigured && (
              <div className="flex justify-center">{captcha.widget}</div>
            )}

            <div className="flex justify-center">
              <Btn
                type="submit"
                label={isSubmitting ? 'Надсилання...' : 'Надіслати заявку'}
                disabled={isSubmitting || !captcha.token}
              />
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default RegisterForm;
