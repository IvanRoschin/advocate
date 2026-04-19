import * as Yup from 'yup';

import {
  CATEGORY_ICON_KEYS,
  CategoryIconKey,
} from '@/app/resources/category-icons';

/* -------------------------------- Base rules -------------------------------- */

export const baseCategorySchema = {
  title: Yup.string()
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(50, 'Максимальна кількість символів 50'),

  icon: Yup.string(),
};

export type CategoryBaseValues = {
  title: string;
  icon: string;
};

/* -------------------------------- Create -------------------------------- */

export const createCategorySchema = Yup.object({
  title: baseCategorySchema.title.required("Обов'язкове поле"),
  icon: Yup.mixed<CategoryIconKey>().oneOf(CATEGORY_ICON_KEYS).required(),
});

export type CreateCategoryFormValues = Yup.InferType<
  typeof createCategorySchema
>;

/* -------------------------------- Update (PATCH) -------------------------------- */

export const updateCategorySchema = Yup.object({
  title: baseCategorySchema.title.optional(),
  icon: baseCategorySchema.icon.optional(),
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
