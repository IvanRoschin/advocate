'use client';

import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import leadSchema from '@/app/helpers/validation-schemas/lead-schema';
import { ApiClientError } from '@/app/lib/client/api-client';
import Btn from '@/app/ui/button/Btn';
import { Checkbox, Input } from '@/components/index';

declare global {
  interface Window {
    onCaptchaSuccess: (token: string) => void;
    grecaptcha: { reset: () => void };
  }
}

const LeadForm = () => {
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  // Загружаем reCAPTCHA только на клиенте
  useEffect(() => {
    setCaptchaLoaded(true);

    window.onCaptchaSuccess = (token: string) => {
      setCaptchaToken(token);
    };
  }, []);

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '+380',
        consent: false,
        website: '',
      }}
      validationSchema={leadSchema}
      onSubmit={async (values, { resetForm }) => {
        if (!captchaToken) {
          toast.error('Будь ласка, підтвердіть, що ви не робот');
          return;
        }

        try {
          const res = await fetch(apiUrl('leads'), {
            method: 'POST',
            body: JSON.stringify({ ...values, recaptchaToken: captchaToken }),
          });

          if (!res.ok) {
            const json = await res.json();
            toast.error(`Помилка: ${json?.error?.message || res.statusText}`);
            return;
          }

          toast.success('Ваша заявка успішно надіслана!');
        } catch (e: unknown) {
          const message =
            e instanceof ApiClientError
              ? e.message
              : e instanceof Error
                ? e.message
                : 'Сталася невідома помилка';
          toast.error(message);
        } finally {
          resetForm();
          setCaptchaToken('');
          window.grecaptcha?.reset();
        }
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="space-y-4">
          <Input name="name" label="Імʼя" required />
          <Input name="email" label="Email" type="email" required />
          <Input name="phone" label="Телефон" type="tel" required />
          <Checkbox name="consent">
            Даю згоду на обробку персональних даних
          </Checkbox>

          {/* Honeypot поле */}
          <input type="text" name="website" style={{ display: 'none' }} />

          {/* Только рендерим reCAPTCHA на клиенте */}
          {captchaLoaded && (
            <div
              className="g-recaptcha mt-2 flex items-center justify-center"
              data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              data-callback="onCaptchaSuccess"
            />
          )}
          <div className="flex items-center justify-center">
            <Btn
              type="submit"
              title="Надіслати"
              disabled={!isValid || isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LeadForm;
