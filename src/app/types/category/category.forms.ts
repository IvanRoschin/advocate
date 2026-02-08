import * as Yup from 'yup';

export const baseCategorySchema = {
  title: Yup.string()
    .min(2, 'Мінімальна кількість символів 2')
    .max(50, 'Максимальна кількість символів 50'),

  src: Yup.array()
    .of(Yup.string())
    .min(1, 'Додайте хоча б одне фото')
    .max(3, 'Максимум 3 фото')
    .defined(),
};

export type CategoryBaseValues = {
  title: string;
  src: string[];
};

export const createCategorySchema = Yup.object({
  title: baseCategorySchema.title.required("Обов'язкове поле"),
  src: baseCategorySchema.src.required("Обов'язкове поле").defined(),
});

export type CreateCategoryFormValues = Yup.InferType<
  typeof createCategorySchema
>;
