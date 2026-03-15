'use client';

import { Form, Formik } from 'formik';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { Input, StarRatingField, Textarea } from '@/components/index';

type Props = {
  serviceId: string;
};

const ServiceReviewForm = ({ serviceId }: Props) => {
  const handleSubmit = async (values: {
    authorName: string;
    text: string;
    rating?: number;
  }) => {
    await fetch('/api/v1/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
        targetType: 'service',
        targetId: serviceId,
      }),
    });
    toast.success('Відгук надіслано. Після модерації він зʼявиться на сайті.');
  };

  return (
    <Formik
      initialValues={{
        authorName: '',
        text: '',
        rating: 5,
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="grid gap-4">
          <Input name="authorName" label="Ваше ім’я" required />
          <Textarea name="text" label="Ваш відгук" rows={5} required />
          <StarRatingField name="rating" label="Оцініть послугу" step={0.5} />
          <Btn
            type="submit"
            label="Надіслати відгук"
            uiVariant="accent"
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default ServiceReviewForm;
