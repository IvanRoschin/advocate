'use client';

import { Form, Formik } from 'formik';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import leadSchema from '@/app/helpers/validation-schemas/lead-schema';
import { ApiClientError } from '@/app/lib/api-client';
import Btn from '@/app/ui/button/Btn';
import { Checkbox, Input } from '@/components/index';

const LeadForm = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '+380',
        consent: false,
        website: '', // Honeypot
        recaptchaToken: '', // reCAPTCHA v3
      }}
      validationSchema={leadSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          // 🔹 Получаем token reCAPTCHA
          const token = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action: 'submit' }
          );
          values.recaptchaToken = token;

          const res = await fetch(apiUrl('leads'), {
            method: 'POST',
            body: JSON.stringify(values),
          });

          if (res.status === 409) {
            toast.error('❌ Лід з таким email вже існує!');
            return;
          }

          if (!res.ok) {
            const json = await res.json();
            toast.error(
              `❌ Помилка: ${json?.error?.message || res.statusText}`
            );
            return;
          }

          toast.success('✅ Ваша заявка успішно надіслана!');
        } catch (e: unknown) {
          if (e instanceof ApiClientError) {
            if (e.status === 409) {
              toast.error('Лід з таким email вже існує!');
              return;
            }
            toast.error(`Помилка: ${e.message}`);
            return;
          }

          if (e instanceof Error) {
            toast.error(`Невідома помилка: ${e.message}`);
            return;
          }

          toast.error('Сталася невідома помилка');
        } finally {
          resetForm();
        }
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="space-y-4 text-left">
          <Input name="name" label="Імʼя" required />
          <Input name="email" label="Email" type="email" required />
          <Input name="phone" label="Телефон" type="tel" required />
          <Checkbox name="consent">
            Заповнюючи форму, я даю згоду на збір та обробку персональних даних
          </Checkbox>

          {/* Honeypot поле скрыто */}
          <input type="text" name="website" style={{ display: 'none' }} />

          <Btn
            type="submit"
            title="Надіслати"
            disabled={!isValid || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default LeadForm;
