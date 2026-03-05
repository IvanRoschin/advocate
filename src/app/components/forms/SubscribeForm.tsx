'use client';

import { Form, Formik } from 'formik';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { apiUrl } from '@/app/config/routes';
import subscriberSchema from '@/app/helpers/validationSchemas/subscriber.schema';
import { Input } from '@/components/index';

type Props = {
  variant?: 'default' | 'aside';
};

const SubscribeForm = ({ variant = 'default' }: Props) => {
  const isAside = variant === 'aside';

  return (
    <Formik
      initialValues={{ email: '', consent: false, website: '' }}
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
        <Form
          className={
            isAside
              ? 'mt-3 grid w-full gap-2 text-xs'
              : 'mt-4 flex w-full max-w-md items-start justify-center gap-4 text-xs'
          }
        >
          <div className={isAside ? 'w-full' : 'flex-1'}>
            <Input
              name="email"
              label="Email"
              type="email"
              required
              // если Input поддерживает className — уменьшим размеры
              className={isAside ? 'text-sm' : undefined}
            />
          </div>

          {/* Honeypot */}
          <input type="text" name="website" style={{ display: 'none' }} />

          <div className={isAside ? 'w-full' : 'flex items-end'}>
            <Btn
              radius={12}
              type="submit"
              label="Підписатися"
              disabled={!isValid || isSubmitting}
              className={
                isAside
                  ? 'min-h-11 w-full px-4 py-2 text-sm'
                  : 'min-h-[3.7rem] px-6 py-3'
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SubscribeForm;
