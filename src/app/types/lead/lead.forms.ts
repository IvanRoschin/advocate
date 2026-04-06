// src/app/types/lead.ts
import * as Yup from 'yup';

import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  LeadSource,
  LeadStatus,
} from './lead.constants';

const phoneRegExp = /^\+?[0-9\s\-()]{7,20}$/;

// =========================
// FORM TYPES
// =========================

export type PublicLeadFormValues = {
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  message?: string;
  consent: boolean;
  website: string;
};

export type AdminLeadFormValues = {
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  message: string;
  status: LeadStatus;
  notes: string;
  clientId: string | null;
  assignedToUserId: string | null;
  convertedToClient: boolean;
};

export type LeadAdminFormSubmitValues = Pick<
  AdminLeadFormValues,
  'name' | 'email' | 'phone' | 'message' | 'source' | 'status' | 'notes'
>;

// =========================
// BASE FIELDS
// =========================

const basePublicFields = {
  name: Yup.string()
    .trim()
    .min(2, 'Імʼя має містити щонайменше 2 символи')
    .max(100, 'Імʼя не може бути довшим за 100 символів')
    .required('Вкажіть ваше імʼя'),

  email: Yup.string()
    .trim()
    .email('Вкажіть коректний email')
    .max(255, 'Email не може бути довшим за 255 символів')
    .required('Вкажіть email'),

  phone: Yup.string()
    .trim()
    .matches(phoneRegExp, 'Вкажіть коректний номер телефону')
    .required('Вкажіть номер телефону'),

  source: Yup.mixed<LeadSource>()
    .oneOf([...LEAD_SOURCES], 'Некоректне джерело форми')
    .required('Не вдалося визначити джерело форми'),

  consent: Yup.boolean()
    .oneOf([true], 'Потрібно надати згоду на обробку персональних даних')
    .required('Потрібно надати згоду на обробку персональних даних'),

  website: Yup.string().trim().default(''),
};

const optionalMessageField: Yup.StringSchema<string | undefined> = Yup.string()
  .transform((value, originalValue) => {
    if (typeof originalValue !== 'string') return undefined;
    const trimmed = originalValue.trim();
    return trimmed === '' ? undefined : trimmed;
  })
  .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
  .optional()
  .nonNullable();

const requiredMessageField: Yup.StringSchema<string> = Yup.string()
  .transform((value, originalValue) => {
    if (typeof originalValue !== 'string') return '';
    return originalValue.trim();
  })
  .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
  .required('Введіть повідомлення')
  .nonNullable();
// =========================
// PUBLIC VALIDATION
// =========================

export const publicLeadHomeSchema: Yup.ObjectSchema<PublicLeadFormValues> =
  Yup.object({
    ...basePublicFields,
    message: optionalMessageField,
  });

export const publicLeadContactsSchema: Yup.ObjectSchema<PublicLeadFormValues> =
  Yup.object({
    ...basePublicFields,
    message: requiredMessageField,
  });

// Оставь как "дефолтную" публичную схему вариант с обязательным сообщением,
// если она где-то еще используется в старом коде.
export const leadFormSchema: Yup.ObjectSchema<PublicLeadFormValues> =
  publicLeadContactsSchema;

// =========================
// ADMIN VALIDATION
// =========================

export const adminLeadFormSchemaShape = {
  name: Yup.string()
    .trim()
    .min(2, 'Імʼя має містити щонайменше 2 символи')
    .max(100, 'Імʼя не може бути довшим за 100 символів')
    .required('Вкажіть імʼя'),

  email: Yup.string()
    .trim()
    .email('Вкажіть коректний email')
    .max(255, 'Email не може бути довшим за 255 символів')
    .required('Вкажіть email'),

  phone: Yup.string()
    .trim()
    .matches(phoneRegExp, 'Вкажіть коректний номер телефону')
    .required('Вкажіть номер телефону'),

  source: Yup.mixed<LeadSource>()
    .oneOf([...LEAD_SOURCES], 'Некоректне джерело форми')
    .required('Не вдалося визначити джерело форми'),

  message: Yup.string()
    .transform((value, originalValue) => {
      if (typeof originalValue !== 'string') return '';
      return originalValue.trim();
    })
    .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
    .default(''),

  status: Yup.mixed<LeadStatus>()
    .oneOf([...LEAD_STATUSES], 'Некоректний статус')
    .required('Вкажіть статус'),

  notes: Yup.string()
    .transform((value, originalValue) => {
      if (typeof originalValue !== 'string') return '';
      return originalValue.trim();
    })
    .max(5000, 'Нотатки не можуть бути довшими за 5000 символів')
    .default(''),

  clientId: Yup.string().nullable().default(null),

  assignedToUserId: Yup.string().nullable().default(null),
};

export const adminLeadSubmitSchema: Yup.ObjectSchema<LeadAdminFormSubmitValues> =
  Yup.object({
    name: Yup.string()
      .trim()
      .min(2, 'Імʼя має містити щонайменше 2 символи')
      .max(100, 'Імʼя не може бути довшим за 100 символів')
      .required('Вкажіть імʼя'),

    email: Yup.string()
      .trim()
      .email('Вкажіть коректний email')
      .max(255, 'Email не може бути довшим за 255 символів')
      .required('Вкажіть email'),

    phone: Yup.string()
      .trim()
      .matches(phoneRegExp, 'Вкажіть коректний номер телефону')
      .required('Вкажіть номер телефону'),

    source: Yup.mixed<LeadSource>()
      .oneOf([...LEAD_SOURCES], 'Некоректне джерело форми')
      .required('Не вдалося визначити джерело форми'),

    message: Yup.string()
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') return '';
        return originalValue.trim();
      })
      .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
      .default(''),

    status: Yup.mixed<LeadStatus>()
      .oneOf([...LEAD_STATUSES], 'Некоректний статус')
      .required('Вкажіть статус'),

    notes: Yup.string()
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') return '';
        return originalValue.trim();
      })
      .max(5000, 'Нотатки не можуть бути довшими за 5000 символів')
      .default(''),
  });

// =========================
// SERVER REQUEST VALIDATION
// =========================

// Для home message опционален, для contacts обязателен.
// Это и есть ключевой фикс для 422.
export const createLeadRequestSchema = Yup.object({
  ...basePublicFields,

  message: Yup.string()
    .transform((value, originalValue) => {
      if (typeof originalValue !== 'string') return undefined;
      const trimmed = originalValue.trim();
      return trimmed === '' ? undefined : trimmed;
    })
    .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
    .when('source', {
      is: 'contacts',
      then: schema => schema.required('Введіть повідомлення'),
      otherwise: schema => schema.notRequired(),
    }),

  recaptchaToken: Yup.string().trim().required('Підтвердіть, що ви не робот'),
});

export type CreateLeadRequestDTO = Yup.InferType<
  typeof createLeadRequestSchema
>;
