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

const publicReviewSchema = Yup.object({
  authorName: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(120, 'Максимум 120 символів')
    .required('Вкажіть ім’я'),

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

const ServiceReviewForm = ({ serviceId }: Props) => {
  const handleSubmit = async (
    values: ServiceReviewFormValues,
    { resetForm }: FormikHelpers<ServiceReviewFormValues>
  ) => {
    try {
      const response = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorName: values.authorName.trim(),
          text: values.text.trim(),
          rating: values.rating,
          status: 'pending',
          targetType: 'service',
          targetId: serviceId,
        }),
      });

      if (!response.ok) {
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
          //
        }

        throw new Error(message);
      }

      resetForm();

      toast.success('Відгук успішно надіслано в обробку.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Помилка надсилання відгуку'
      );
    }
  };

  return (
    <Formik<ServiceReviewFormValues>
      initialValues={{
        authorName: '',
        text: '',
        rating: 5,
      }}
      validationSchema={publicReviewSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="grid gap-4">
          <Input name="authorName" label="Ваше ім’я" required />
          <Textarea name="text" label="Ваш відгук" rows={5} required />
          <StarRatingField name="rating" label="Оцініть послугу" step={0.5} />
          <Btn
            type="submit"
            label="Надіслати відгук"
            uiVariant="accent"
            disabled={!isValid || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default ServiceReviewForm;
