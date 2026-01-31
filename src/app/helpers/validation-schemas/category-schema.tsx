import * as Yup from 'yup';

const categorySchema = Yup.object({
  title: Yup.string().min(2).max(50).required(),

  src: Yup.array()
    .of(Yup.string())
    .min(1, 'Додайте хоча б одне фото')
    .max(3, 'Максимум 3 фото')
    .required(`Обов'язкове поле`),
});

export type CategoryFormValues = {
  title: string;
  src: string[];
};

export type CategoryInput = CategoryFormValues & {
  slug: string;
};

export default categorySchema;
