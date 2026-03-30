import * as Yup from 'yup';

export const pageSettingsEntitySchema = Yup.mixed<'article' | 'service'>()
  .oneOf(['article', 'service'], 'Некоректна сутність')
  .required("Обов'язкове поле");

const layoutItemSchema = Yup.object({
  key: Yup.string().trim().required("Обов'язкове поле"),
  display: Yup.boolean().required("Обов'язкове поле"),
});

const layoutNodeSchema = Yup.object({
  type: Yup.mixed<'section' | 'group'>()
    .oneOf(['section', 'group'], 'Некоректний тип секції')
    .required("Обов'язкове поле"),
  key: Yup.string().trim().required("Обов'язкове поле"),
  display: Yup.boolean().required("Обов'язкове поле"),
  wrapperClassName: Yup.string().trim().optional(),
  items: Yup.array().of(layoutItemSchema).optional(),
});

export const updatePageSettingsSchema = Yup.object({
  entity: pageSettingsEntitySchema,
  layout: Yup.array()
    .of(layoutNodeSchema)
    .min(1, 'Потрібна хоча б одна секція')
    .required("Обов'язкове поле"),
}).noUnknown(true);
