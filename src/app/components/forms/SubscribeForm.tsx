'use client';

import { Form, Formik } from 'formik';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import subscriberSchema from '@/app/helpers/validation-schemas/subscriber-schema';
import Btn from '@/app/ui/button/Btn';
import { Input } from '@/components/index';

declare global {
  interface Window {
    onCaptchaSuccess: (token: string) => void;
    grecaptcha: { reset: () => void };
  }
}

const SubscribeForm = () => {
  return (
    <Formik
      initialValues={{
        email: '',
        consent: false,
        website: '', // honeypot
      }}
      validationSchema={subscriberSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const res = await fetch(apiUrl('subscribe'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          const json = await res.json();

          if (!res.ok) {
            toast.error(`Помилка: ${json?.error?.message || res.statusText}`);
            return;
          }

          toast.success('Ви успішно підписались на розсилку!');
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : 'Сталася невідома помилка';
          toast.error(message);
        } finally {
          resetForm();
        }
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="mt-4 flex w-full max-w-md items-start justify-center gap-4">
          <div className="flex-1">
            <Input name="email" label="Email" type="email" required />
          </div>
          {/* Honeypot поле */}
          <input type="text" name="website" style={{ display: 'none' }} />
          <div className="flex items-end">
            <Btn
              radius="12"
              type="submit"
              title="Підписатися"
              disabled={!isValid || isSubmitting}
              sx={{
                paddingY: '0.75rem',
                minHeight: '3.7rem',
              }}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SubscribeForm;
