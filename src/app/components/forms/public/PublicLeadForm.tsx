'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { fieldMotion } from '@/app/components/forms/shared/formMotion';
import { HoneypotField } from '@/app/components/forms/shared/HoneypotField';
import { usePublicCaptcha } from '@/app/components/forms/shared/usePublicCaptcha';
import Btn from '@/app/components/ui/button/Btn';
import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store';
import { publicLeadContactsSchema, publicLeadHomeSchema } from '@/app/types';
import { Checkbox, Input, Textarea } from '@/components';

import type { ApiResponse } from '@/app/lib/server/ApiError';
import type { LeadResponseDTO, PublicLeadFormValues } from '@/app/types';

type Props = {
  publicVariant?: 'home' | 'contacts';
  source: 'home' | 'contacts';
};

const defaultValues: PublicLeadFormValues = {
  name: '',
  email: '',
  phone: '+380',
  source: 'home',
  consent: false,
  website: '',
  message: '',
};

export default function PublicLeadForm({
  publicVariant = 'home',
  source,
}: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const captcha = usePublicCaptcha();

  const shouldShowMessage = publicVariant === 'contacts';
  const validationSchema =
    publicVariant === 'contacts'
      ? publicLeadContactsSchema
      : publicLeadHomeSchema;

  return (
    <Formik<PublicLeadFormValues>
      initialValues={{ ...defaultValues, source }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        start();

        if (!captcha.isConfigured) {
          toast.error('Cloudflare Turnstile не налаштований');
          done();
          return;
        }

        if (!captcha.token) {
          toast.error('Будь ласка, підтвердіть, що ви не робот');
          done();
          return;
        }

        try {
          const normalizedMessage = values.message?.trim();

          await apiFetch<ApiResponse<LeadResponseDTO>>(
            apiUrl(routes.api.v1.leads),
            {
              method: 'POST',
              body: JSON.stringify({
                ...values,
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                turnstileToken: captcha.token,
                ...(normalizedMessage ? { message: normalizedMessage } : {}),
              }),
            }
          );

          toast.success('Ваша заявка успішно надіслана!');
          resetForm();
          captcha.reset();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Помилка створення');
          captcha.reset();
        } finally {
          done();
        }
      }}
    >
      {({ isSubmitting, dirty }) => (
        <Form className="flex w-full flex-col space-y-5">
          <motion.div
            {...fieldMotion(0.05)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <Input name="name" label="Імʼя" required />
            <Input name="email" label="Email" type="email" required />
            <Input name="phone" label="Телефон" type="tel" required />
          </motion.div>

          {shouldShowMessage && (
            <motion.div {...fieldMotion(0.1)}>
              <Textarea name="message" label="Повідомлення" rows={3} />
            </motion.div>
          )}

          <motion.div
            {...fieldMotion(0.15)}
            className="border-border border-t pt-4"
          >
            <Checkbox name="consent">
              Даю згоду на обробку персональних даних
            </Checkbox>
          </motion.div>

          <HoneypotField />

          {captcha.isConfigured && (
            <motion.div {...fieldMotion(0.2)} className="flex justify-center">
              {captcha.widget}
            </motion.div>
          )}

          <Btn
            uiVariant="accent"
            radius={12}
            type="submit"
            label={isSubmitting ? 'Надсилання...' : 'Надіслати'}
            disabled={isSubmitting || !dirty || !captcha.token}
            className="w-full"
          />
        </Form>
      )}
    </Formik>
  );
}
