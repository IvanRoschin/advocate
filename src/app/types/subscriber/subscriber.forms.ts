import * as yup from 'yup';

export const createSubscriberSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Вкажіть коректний email')
    .max(255, 'Email не може бути довшим за 255 символів')
    .required('Вкажіть email'),
  subscribed: yup.boolean().required(),
  website: yup.string().trim().default(''),
  turnstileToken: yup.string().trim().required(),
});

export const updateSubscriberSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Вкажіть коректний email')
    .max(255, 'Email не може бути довшим за 255 символів'),
  isActive: yup.boolean(),
});
