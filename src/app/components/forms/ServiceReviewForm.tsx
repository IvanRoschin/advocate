'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';

import Btn from '@/app/components/ui/button/Btn';
import { Input, StarRatingField, Textarea } from '@/components/index';

type Props = {
  serviceId: string;
};

type ServiceReviewFormValues = {
  authorName: string;
  text: string;
  rating: number;
};

type ServiceReviewSubmitStatus =
  | {
      type: 'success';
      message: string;
    }
  | {
      type: 'error';
      message: string;
    }
  | undefined;

const publicReviewSchema = Yup.object({
  authorName: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(120, 'Максимум 120 символів')
    .required("Вкажіть ім'я"),

  text: Yup.string()
    .trim()
    .min(5, 'Мінімум 5 символів')
    .max(5000, 'Максимум 5000 символів')
    .required('Вкажіть текст відгуку'),

  rating: Yup.number()
    .min(1, 'Мінімальний рейтинг 1')
    .max(5, 'Максимальний рейтинг 5')
    .required('Оцініть послугу'),
});

const initialValues: ServiceReviewFormValues = {
  authorName: '',
  text: '',
  rating: 5,
};

async function submitServiceReview(
  serviceId: string,
  values: ServiceReviewFormValues
): Promise<void> {
  const payload = {
    authorName: values.authorName.trim(),
    text: values.text.trim(),
    rating: values.rating,
    status: 'pending' as const,
    targetType: 'service' as const,
    targetId: serviceId,
  };

  const response = await fetch('/api/v1/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return;
  }

  let message = 'Не вдалося надіслати відгук';

  try {
    const data = (await response.json()) as {
      message?: string;
      error?: {
        code?: string;
        message?: string;
      };
    };

    message = data.error?.message ?? data.message ?? message;
  } catch {
    // ignore
  }

  throw new Error(message);
}

const ServiceReviewForm = ({ serviceId }: Props) => {
  const handleSubmit = async (
    values: ServiceReviewFormValues,
    helpers: FormikHelpers<ServiceReviewFormValues>
  ) => {
    const { resetForm, setStatus } = helpers;

    setStatus(undefined);

    try {
      await submitServiceReview(serviceId, values);

      resetForm({ values: initialValues });

      setStatus({
        type: 'success',
        message: 'Дякуємо! Відгук успішно надіслано та передано на модерацію.',
      } as ServiceReviewSubmitStatus);

      toast.success('Відгук успішно надіслано в обробку.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Помилка надсилання відгуку';

      setStatus({
        type: 'error',
        message,
      } as ServiceReviewSubmitStatus);

      toast.error(message);
    }
  };

  return (
    <Formik<ServiceReviewFormValues>
      initialValues={initialValues}
      validationSchema={publicReviewSchema}
      onSubmit={handleSubmit}
    >
      {formik => {
        const { isSubmitting, isValid, dirty } = formik;
        const status = formik.status as ServiceReviewSubmitStatus;

        return (
          <Form className="grid gap-4">
            <Input name="authorName" label="Ваше ім’я" required />
            <Textarea name="text" label="Ваш відгук" rows={5} required />
            <StarRatingField name="rating" label="Оцініть послугу" step={0.5} />

            {status ? (
              <div
                className={
                  status.type === 'success'
                    ? 'rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800'
                    : 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
                }
                role={status.type === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {status.message}
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <Btn
                className="min-w-42.5"
                type="submit"
                label={isSubmitting ? 'Надсилання...' : 'Надіслати відгук'}
                uiVariant="accent"
                disabled={isSubmitting || !dirty || !isValid}
              />

              {!isSubmitting ? (
                <p className="text-muted-foreground text-sm">
                  Відгук буде опубліковано після модерації.
                </p>
              ) : null}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ServiceReviewForm;
