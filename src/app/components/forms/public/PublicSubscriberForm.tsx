'use client';

import { Form, Formik } from 'formik';
import { toast } from 'sonner';

import { HoneypotField } from '@/app/components/forms/shared/HoneypotField';
import { usePublicCaptcha } from '@/app/components/forms/shared/usePublicCaptcha';
import Btn from '@/app/components/ui/button/Btn';
import { apiUrl, routes } from '@/app/config/routes';
import subscriberSchema from '@/app/helpers/validationSchemas/subscriber.schema';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { Checkbox, Input } from '@/components';

type Props = {
  variant?: 'default' | 'aside';
};

const PublicSubscribeForm = ({ variant = 'default' }: Props) => {
  const isAside = variant === 'aside';
  const captcha = usePublicCaptcha(isAside ? 'flexible' : 'normal');

  return (
    <Formik
      initialValues={{ email: '', consent: false, website: '' }}
      validationSchema={subscriberSchema}
      onSubmit={async (values, { resetForm }) => {
        if (!captcha.isConfigured) {
          toast.error('Cloudflare Turnstile не налаштований');
          return;
        }

        if (!captcha.token) {
          toast.error('Будь ласка, підтвердіть, що ви не робот');
          return;
        }

        try {
          await apiFetch(apiUrl(routes.api.v1.subscribe), {
            method: 'POST',
            body: JSON.stringify({
              email: values.email.trim(),
              consent: values.consent,
              website: values.website,
              turnstileToken: captcha.token,
            }),
          });

          toast.success('Ви успішно підписались на розсилку!');
          resetForm();
          captcha.reset();
        } catch (e: unknown) {
          toast.error(
            e instanceof Error ? e.message : 'Сталася невідома помилка'
          );
          captcha.reset();
        }
      }}
    >
      {({ isSubmitting, dirty }) => (
        <Form
          className={
            isAside
              ? 'mt-3 grid w-full gap-3 text-xs'
              : 'mt-4 flex w-full max-w-md flex-col items-stretch gap-4 text-xs'
          }
        >
          <Input
            name="email"
            label="Email"
            type="email"
            required
            className={isAside ? 'text-sm' : undefined}
          />

          <Checkbox name="consent">
            Я згоден(-на) на обробку персональних даних відповідно до{' '}
            <a href="/privacy-policy" target="_blank" className="underline">
              Політики конфіденційності
            </a>
          </Checkbox>

          <HoneypotField />

          {captcha.widget}

          <Btn
            radius={12}
            type="submit"
            label="Підписатися"
            disabled={isSubmitting || !dirty || !captcha.token}
            className={
              isAside
                ? 'min-h-11 w-full px-4 py-2 text-sm'
                : 'min-h-[3.7rem] w-full px-6 py-3'
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default PublicSubscribeForm;
