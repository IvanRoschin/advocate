import * as Yup from 'yup';

import {
  CATEGORY_ICON_KEYS,
  CategoryIconKey,
} from '@/app/resources/category-icons';

/* -------------------------------- Base rules -------------------------------- */

const baseCategorySchema = {
  title: Yup.string()
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(50, 'Максимальна кількість символів 50'),

  icon: Yup.string(),
};

/* -------------------------------- Create -------------------------------- */

export const createCategorySchema = Yup.object({
  title: baseCategorySchema.title.required("Обов'язкове поле"),
  icon: Yup.mixed<CategoryIconKey>().oneOf(CATEGORY_ICON_KEYS).required(),
});

