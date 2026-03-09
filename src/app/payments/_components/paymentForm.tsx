'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import Btn from '@/app/components/ui/button/Btn';
import { createPaymentInvoiceAction } from '@/app/payments/actions';
import {
  CreatePaymentRequestDTO,
  createPaymentSchema,
} from '@/app/types/payment';
import { Input } from '@/components/index';

const initialValues: CreatePaymentRequestDTO = {
  serviceName: '',
  amount: '',
  firstName: '',
  lastName: '',
  email: '',
};

const PaymentForm = () => {
  const [submitError, setSubmitError] = useState('');

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
        initialValues={initialValues}
        validationSchema={createPaymentSchema}
        onSubmit={async (values, helpers) => {
          setSubmitError('');

          const result = await createPaymentInvoiceAction(values);

          if (!result.ok) {
            setSubmitError(result.error || 'Не вдалося створити платіж.');
            helpers.setSubmitting(false);
            return;
          }

          if (result.invoiceUrl) {
            window.location.assign(result.invoiceUrl);
            return;
          }

          setSubmitError('WayForPay не повернув посилання на оплату.');
          helpers.setSubmitting(false);
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="mt-6 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Input name="serviceName" label="Назва послуги" required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
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

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                <Input name="firstName" label="Ім’я" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 }}
              >
                <Input name="lastName" label="Прізвище" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
            >
              <Input name="email" label="Email" type="email" />
            </motion.div>

            {submitError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            ) : null}

            <div className="flex justify-center">
              <Btn
                uiVariant="accent"
                radius={12}
                type="submit"
                label={isSubmitting ? 'Формуємо платіж…' : 'Перейти до оплати'}
                disabled={!isValid || isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentForm;
