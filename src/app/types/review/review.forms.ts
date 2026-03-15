import * as Yup from 'yup';

export const createReviewSchema = Yup.object({
  authorName: Yup.string().trim().required('Вкажіть ім’я'),
  text: Yup.string().trim().required('Вкажіть текст відгуку'),
  rating: Yup.number().min(1).max(5).optional(),

  targetType: Yup.mixed<'service' | 'article' | 'page'>()
    .oneOf(['service', 'article', 'page'])
    .required(),

  targetId: Yup.string().when('targetType', {
    is: (value: string) => value === 'service' || value === 'article',
    then: schema => schema.required('targetId є обов’язковим'),
    otherwise: schema => schema.optional(),
  }),

  pageKey: Yup.string().when('targetType', {
    is: 'page',
    then: schema => schema.required('pageKey є обов’язковим'),
    otherwise: schema => schema.optional(),
  }),
});
