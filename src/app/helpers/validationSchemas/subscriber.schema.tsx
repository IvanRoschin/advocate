import * as Yup from 'yup';

const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const subscriberSchema = Yup.object({
  email: Yup.string()
    .min(3, 'Мінімум 3 символи')
    .max(63, 'Максимум 63 символи')
    .email('Невірний формат email')
    .matches(emailRegex, 'Має включати @, від 3 до 63 символів')
    .required("Обов'язкове поле"),

  consent: Yup.boolean().oneOf([true], 'Потрібна згода на обробку даних'),

  // Honeypot поле, чтобы ловить ботов
  website: Yup.string().max(0).optional(),
});

export default subscriberSchema;

// Тип TypeScript для данных формы
export type SubscriberInput = Yup.InferType<typeof subscriberSchema>;
