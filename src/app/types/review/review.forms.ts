import * as Yup from 'yup';

import type { ReviewStatus, ReviewTargetType } from './review.dto';

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

export type ReviewFormValues = {
  authorName: string;
  text: string;
  rating: number | '';
  status: ReviewStatus;
  targetType: ReviewTargetType;
  targetId: string;
  pageKey: string;
};

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createReviewFormSchema = Yup.object({
  authorName: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(120, 'Максимальна кількість символів 120')
    .required("Обов'язкове поле"),

  text: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(5, 'Мінімальна кількість символів 5')
    .max(5000, 'Максимальна кількість символів 5000')
    .required("Обов'язкове поле"),

  rating: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue == null ? undefined : value
    )
    .min(1, 'Мінімальний рейтинг 1')
    .max(5, 'Максимальний рейтинг 5')
    .optional(),

  status: Yup.mixed<ReviewStatus>()
    .oneOf(['pending', 'approved', 'rejected'], 'Некоректний статус')
    .required("Обов'язкове поле"),

  targetType: Yup.mixed<ReviewTargetType>()
    .oneOf(['service', 'article', 'page'], 'Некоректний тип')
    .required("Обов'язкове поле"),

  targetId: Yup.string().when('targetType', {
    is: (targetType: ReviewTargetType) =>
      targetType === 'service' || targetType === 'article',
    then: schema =>
      schema
        .transform(emptyToUndefined)
        .trim()
        .matches(objectIdRegex, 'Target ID має бути валідним ObjectId')
        .required("Обов'язкове поле"),
    otherwise: schema => schema.strip(),
  }),

  pageKey: Yup.string().when('targetType', {
    is: 'page',
    then: schema =>
      schema.transform(emptyToUndefined).trim().required("Обов'язкове поле"),
    otherwise: schema => schema.strip(),
  }),
}).noUnknown(true);

export const updateReviewFormSchema = Yup.object({
  authorName: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(120, 'Максимальна кількість символів 120')
    .required("Обов'язкове поле"),

  text: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(5, 'Мінімальна кількість символів 5')
    .max(5000, 'Максимальна кількість символів 5000')
    .required("Обов'язкове поле"),

  rating: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue == null ? undefined : value
    )
    .min(1, 'Мінімальний рейтинг 1')
    .max(5, 'Максимальний рейтинг 5')
    .optional(),

  status: Yup.mixed<ReviewStatus>()
    .oneOf(['pending', 'approved', 'rejected'], 'Некоректний статус')
    .required("Обов'язкове поле"),

  targetType: Yup.mixed<ReviewTargetType>()
    .oneOf(['service', 'article', 'page'], 'Некоректний тип')
    .required("Обов'язкове поле"),

  targetId: Yup.string().when('targetType', {
    is: (targetType: ReviewTargetType) =>
      targetType === 'service' || targetType === 'article',
    then: schema =>
      schema
        .transform(emptyToUndefined)
        .trim()
        .matches(objectIdRegex, 'Target ID має бути валідним ObjectId')
        .required("Обов'язкове поле"),
    otherwise: schema => schema.strip(),
  }),

  pageKey: Yup.string().when('targetType', {
    is: 'page',
    then: schema =>
      schema.transform(emptyToUndefined).trim().required("Обов'язкове поле"),
    otherwise: schema => schema.strip(),
  }),
}).noUnknown(true);

export const createReviewSchema = Yup.object({
  authorName: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(120, 'Максимальна кількість символів 120')
    .required("Обов'язкове поле"),

  text: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(5, 'Мінімальна кількість символів 5')
    .max(5000, 'Максимальна кількість символів 5000')
    .required("Обов'язкове поле"),

  rating: Yup.number()
    .min(1, 'Мінімальний рейтинг 1')
    .max(5, 'Максимальний рейтинг 5')
    .optional(),

  status: Yup.mixed<ReviewStatus>()
    .oneOf(['pending', 'approved', 'rejected'], 'Некоректний статус')
    .required("Обов'язкове поле"),

  targetType: Yup.mixed<ReviewTargetType>()
    .oneOf(['service', 'article', 'page'], 'Некоректний тип')
    .required("Обов'язкове поле"),

  targetId: Yup.string().trim().optional(),
  pageKey: Yup.string().trim().optional(),
})
  .test(
    'target-link',
    'Для service/article потрібен targetId, для page потрібен pageKey',
    value => {
      if (!value) return false;

      if (value.targetType === 'page') {
        return Boolean(value.pageKey?.trim());
      }

      return Boolean(value.targetId?.trim());
    }
  )
  .noUnknown(true);

export const updateReviewSchema = Yup.object({
  authorName: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(120, 'Максимальна кількість символів 120')
    .optional(),

  text: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(5, 'Мінімальна кількість символів 5')
    .max(5000, 'Максимальна кількість символів 5000')
    .optional(),

  rating: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue == null ? undefined : value
    )
    .min(1, 'Мінімальний рейтинг 1')
    .max(5, 'Максимальний рейтинг 5')
    .optional(),

  status: Yup.mixed<ReviewStatus>()
    .oneOf(['pending', 'approved', 'rejected'], 'Некоректний статус')
    .optional(),

  targetType: Yup.mixed<ReviewTargetType>()
    .oneOf(['service', 'article', 'page'], 'Некоректний тип')
    .optional(),

  targetId: Yup.string().trim().optional(),
  pageKey: Yup.string().trim().optional(),
})
  .noUnknown(true)
  .test(
    'at-least-one-field',
    'Потрібно змінити хоча б одне поле',
    value =>
      value != null &&
      Object.values(value).some(v => v !== undefined && v !== '')
  );
