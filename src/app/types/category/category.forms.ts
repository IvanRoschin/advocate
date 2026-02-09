import * as Yup from 'yup';

/* -------------------------------- Base rules -------------------------------- */

export const baseCategorySchema = {
  title: Yup.string()
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(50, 'Максимальна кількість символів 50'),

  src: Yup.array()
    .of(Yup.string().trim())
    .min(1, 'Додайте хоча б одне фото')
    .max(3, 'Максимум 3 фото'),
};

export type CategoryBaseValues = {
  title: string;
  src: string[];
};

/* -------------------------------- Create -------------------------------- */

export const createCategorySchema = Yup.object({
  title: baseCategorySchema.title.required("Обов'язкове поле"),
  src: baseCategorySchema.src.required("Обов'язкове поле"),
});

export type CreateCategoryFormValues = Yup.InferType<
  typeof createCategorySchema
>;

/* -------------------------------- Update (PATCH) -------------------------------- */

export const updateCategorySchema = Yup.object({
  title: baseCategorySchema.title.optional(),
  src: baseCategorySchema.src.optional(),
})
  .noUnknown(true)
  .test(
    'at-least-one-field',
    'Потрібно змінити хоча б одне поле',
    value =>
      value != null &&
      Object.values(value).some(v =>
        Array.isArray(v) ? v.length > 0 : v !== undefined
      )
  );

export type UpdateCategoryFormValues = Yup.InferType<
  typeof updateCategorySchema
>;
