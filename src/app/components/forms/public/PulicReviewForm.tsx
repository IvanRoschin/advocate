'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { fieldMotion } from '@/app/components/forms/shared/formMotion';
import { HoneypotField } from '@/app/components/forms/shared/HoneypotField';
import { usePublicCaptcha } from '@/app/components/forms/shared/usePublicCaptcha';
import Btn from '@/app/components/ui/button/Btn';
import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { Checkbox, Input, StarRatingField, Textarea } from '@/components';

type Props = {
  targetType: 'service' | 'article';
  targetId: string;
};

type PublicReviewFormValues = {
  authorName: string;
  text: string;
  rating: number;
  consent: boolean;
  website: string;
};

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
  consent: Yup.boolean().oneOf([true], 'Потрібна згода на обробку даних'),
  website: Yup.string().max(0),
});

const initialValues: PublicReviewFormValues = {
  authorName: '',
  text: '',
  rating: 5,
  consent: false,
  website: '',
};

const PublicReviewForm = ({ targetType, targetId }: Props) => {
  const captcha = usePublicCaptcha();

  const handleSubmit = async (
    values: PublicReviewFormValues,
    helpers: FormikHelpers<PublicReviewFormValues>
  ) => {
    const { resetForm } = helpers;

    if (captcha.isConfigured && !captcha.token) {
      toast.error('Будь ласка, підтвердіть, що ви не робот');
      return;
    }

    try {
      await apiFetch(apiUrl(routes.api.v1.reviews), {
        method: 'POST',
        body: JSON.stringify({
          authorName: values.authorName.trim(),
          text: values.text.trim(),
          rating: values.rating,
          targetType,
          targetId,
          website: values.website,
          turnstileToken: captcha.token,
        }),
      });

      resetForm({ values: initialValues });
      captcha.reset();

      toast.success(
        'Дякуємо! Відгук успішно надіслано та передано на модерацію.'
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Помилка надсилання відгуку'
      );
      captcha.reset();
    }
  };

  return (
    <Formik<PublicReviewFormValues>
      initialValues={initialValues}
      validationSchema={publicReviewSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="flex w-full flex-col space-y-5">
          <motion.div {...fieldMotion(0.05)} className="grid gap-4">
            <Input name="authorName" label="Ваше ім'я" required />
            <Textarea name="text" label="Ваш відгук" rows={5} required />
            <StarRatingField
              name="rating"
              label="Оцініть послугу"
              step={0.5}
              targetType={targetType}
            />
          </motion.div>

          <motion.div
            {...fieldMotion(0.1)}
            className="border-border border-t pt-4"
          >
            <Checkbox name="consent">
              Даю згоду на обробку персональних даних
            </Checkbox>
          </motion.div>

          <HoneypotField />

          {captcha.isConfigured && (
            <motion.div {...fieldMotion(0.15)} className="flex justify-center">
              {captcha.widget}
            </motion.div>
          )}

          <div className="flex items-center gap-3">
            <Btn
              className="w-full sm:w-auto sm:min-w-42.5"
              type="submit"
              label={isSubmitting ? 'Надсилання...' : 'Надіслати відгук'}
              uiVariant="accent"
              disabled={
                isSubmitting ||
                !dirty ||
                !isValid ||
                (captcha.isConfigured && !captcha.token)
              }
            />

            {!isSubmitting && (
              <p className="text-muted-foreground text-sm">
                Відгук буде опубліковано після модерації.
              </p>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PublicReviewForm;
