'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { createPaymentInvoiceAction } from '@/app/actions/payment.actions';
import { fieldMotion } from '@/app/components/forms/shared/formMotion';
import { HoneypotField } from '@/app/components/forms/shared/HoneypotField';
import { usePublicCaptcha } from '@/app/components/forms/shared/usePublicCaptcha';
import Btn from '@/app/components/ui/button/Btn';
import { useLoadingStore } from '@/app/store/loading.store';
import {
  CreatePaymentRequestDTO,
  createPaymentSchema,
} from '@/app/types/payment';
import { Input } from '@/components';

const defaultValues: CreatePaymentRequestDTO = {
  serviceName: '',
  amount: '',
  firstName: '',
  lastName: '',
  email: '',
  website: '',
};

export default function PaymentForm() {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const captcha = usePublicCaptcha();

  return (
    <div className="border-accent rounded-2xl border p-6">
      <h2 className="text-accent text-xl font-semibold tracking-tight">
        Онлайн-оплата
      </h2>

      <p className="text-app mt-3 text-sm leading-6">
        Вкажіть суму та назву послуги. Після цього вас буде перенаправлено на
        захищену сторінку WayForPay для завершення оплати.
      </p>

      <Formik<CreatePaymentRequestDTO>
        initialValues={defaultValues}
        validationSchema={createPaymentSchema}
        onSubmit={async values => {
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
            const result = await createPaymentInvoiceAction({
              serviceName: values.serviceName.trim(),
              amount: values.amount.trim(),
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              email: values.email.trim(),
              website: values.website,
              turnstileToken: captcha.token,
            });

            if (!result.ok) {
              toast.error(result.error ?? 'Не вдалося створити платіж');
              captcha.reset();
              return;
            }

            if (!result.invoiceUrl) {
              toast.error('WayForPay не повернув посилання на оплату');
              captcha.reset();
              return;
            }

            toast.success('Перенаправлення до WayForPay...');
            window.location.assign(result.invoiceUrl);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : 'Помилка створення платежу'
            );
            captcha.reset();
          } finally {
            done();
          }
        }}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className="mt-6 flex flex-col gap-4">
            <motion.div {...fieldMotion(0)}>
              <Input name="serviceName" label="Назва послуги" required />
            </motion.div>

            <motion.div {...fieldMotion(0.05)}>
              <Input
                name="amount"
                label="Сума, грн"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                required
              />
            </motion.div>

            <motion.div
              {...fieldMotion(0.1)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Input name="firstName" label="Ім'я" />
              <Input name="lastName" label="Прізвище" />
            </motion.div>

            <motion.div {...fieldMotion(0.15)}>
              <Input name="email" label="Email" type="email" />
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
              label={isSubmitting ? 'Формуємо платіж...' : 'Перейти до оплати'}
              disabled={isSubmitting || !dirty || !isValid || !captcha.token}
              className="w-full"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
