'use client';

import { Form, Formik } from 'formik';

import Btn from '@/app/components/ui/button/Btn';
import { Input, Textarea } from '@/components/index';

type Props = {
  articleId: string;
  onSubmit: (values: {
    authorName: string;
    text: string;
    rating?: number;
    targetType: 'article';
    targetId: string;
  }) => Promise<void>;
};

const ArticleReviewForm = ({ articleId, onSubmit }: Props) => {
  return (
    <Formik
      initialValues={{
        authorName: '',
        text: '',
        rating: 5,
      }}
      onSubmit={async values => {
        await onSubmit({
          ...values,
          targetType: 'article',
          targetId: articleId,
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="grid gap-4">
          <Input name="authorName" label="Ваше ім’я" required />
          <Textarea name="text" label="Ваш відгук" rows={5} required />
          <Input name="rating" label="Оцінка 1-5" type="number" />
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

export default ArticleReviewForm;
