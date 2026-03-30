'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { apiUrl } from '@/app/config/routes';
import { useRecaptchaWidget } from '@/app/hooks/useRecaptchaWidget';
import { ApiClientError } from '@/app/lib/client/apiFetch';
import { leadFormSchema } from '@/app/types';
import { Checkbox, Input, Textarea } from '@/components';

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string;
};

type ContactFormStatus =
  | {
      type: 'success';
      message: string;
    }
  | {
      type: 'error';
      message: string;
    }
  | undefined;

const initialValues = {
  name: '',
  email: '',
  phone: '+380',
  source: 'contacts' as const,
  consent: false,
  website: '',
  message: '',
};

async function submitContactForm(
  values: ContactFormValues,
  captchaToken: string
): Promise<void> {
  const response = await fetch(apiUrl('leads'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      source: 'contacts',
      recaptchaToken: captchaToken,
    }),
  });

  if (response.ok) {
    return;
  }

  try {
    const json = (await response.json()) as {
      error?: { message?: string };
      message?: string;
    };

    throw new Error(
      json?.error?.message ?? json?.message ?? 'Не вдалося надіслати звернення'
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Не вдалося надіслати звернення');
  }
}

const ContactForm = () => {
  const { containerRef, captchaToken, isRendered, resetCaptcha } =
    useRecaptchaWidget({
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    });

  const handleSubmit = async (
    values: ContactFormValues,
    helpers: FormikHelpers<ContactFormValues>
  ) => {
    const { resetForm, setStatus } = helpers;

    setStatus(undefined);

    if (!captchaToken) {
      const message = 'Будь ласка, підтвердіть, що ви не робот';

      setStatus({
        type: 'error',
        message,
      } as ContactFormStatus);

      toast.error(message);
      return;
    }

    try {
      await submitContactForm(values, captchaToken);

      resetForm({ values: initialValues });
      resetCaptcha();

      setStatus({
        type: 'success',
        message:
          'Дякуємо. Ваше звернення надіслано. Ми зв’яжемося з вами найближчим часом.',
      } as ContactFormStatus);

      toast.success('Звернення успішно надіслано');
    } catch (error: unknown) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Сталася невідома помилка';

      setStatus({
        type: 'error',
        message,
      } as ContactFormStatus);

      toast.error(message);
    }
  };

  return (
    <Formik<ContactFormValues>
      initialValues={initialValues}
      validationSchema={leadFormSchema}
      onSubmit={handleSubmit}
    >
      {formik => {
        const status = formik.status as ContactFormStatus;

        return (
          <Form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="name" label="Ваше ім’я" required />
              <Input name="phone" label="Телефон" type="tel" required />
            </div>

            <Input name="email" label="Email" type="email" required />

            <Textarea
              name="message"
              label="Коротко опишіть вашу ситуацію"
              rows={6}
              required
            />

            <Checkbox name="consent">
              Даю згоду на обробку персональних даних
            </Checkbox>

            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="hidden"
            />

            <div className="mt-2 flex items-center justify-center">
              <div ref={containerRef} />
            </div>

            {!isRendered ? (
              <p className="text-muted-foreground text-center text-sm">
                Завантаження перевірки безпеки...
              </p>
            ) : null}

            {status ? (
              <div
                className={
                  status.type === 'error'
                    ? 'bg-card text-foreground border-destructive/30 rounded-2xl border px-4 py-3 text-sm shadow-sm'
                    : 'bg-card text-foreground border-border rounded-2xl border px-4 py-3 text-sm shadow-sm'
                }
                role={status.type === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                <p
                  className={
                    status.type === 'error'
                      ? 'text-destructive leading-6 font-medium'
                      : 'text-foreground leading-6 font-medium'
                  }
                >
                  {status.message}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Btn
                type="submit"
                uiVariant="accent"
                className="min-w-45"
                label={
                  formik.isSubmitting ? 'Надсилання...' : 'Надіслати звернення'
                }
                disabled={
                  formik.isSubmitting ||
                  !formik.dirty ||
                  !formik.isValid ||
                  !isRendered
                }
              />

              <p className="text-muted-foreground text-sm leading-6">
                Натискаючи кнопку, ви погоджуєтесь на обробку контактних даних
                для зворотного зв’язку.
              </p>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ContactForm;
