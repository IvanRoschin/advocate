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
  message: string;
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
// VALIDATION
// =========================

const publicLeadSchemaShape = {
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

  message: Yup.string()
    .trim()
    .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
    .required(),

  consent: Yup.boolean()
    .oneOf([true], 'Потрібно надати згоду на обробку персональних даних')
    .required('Потрібно надати згоду на обробку персональних даних'),

  website: Yup.string().default(''),
};

export const leadFormSchema: Yup.ObjectSchema<PublicLeadFormValues> =
  Yup.object(publicLeadSchemaShape);

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
    .trim()
    .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
    .default(''),

  status: Yup.mixed<LeadStatus>()
    .oneOf([...LEAD_STATUSES], 'Некоректний статус')
    .required('Вкажіть статус'),

  notes: Yup.string()
    .trim()
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
      .trim()
      .max(5000, 'Повідомлення не може бути довшим за 5000 символів')
      .default(''),

    status: Yup.mixed<LeadStatus>()
      .oneOf([...LEAD_STATUSES], 'Некоректний статус')
      .required('Вкажіть статус'),

    notes: Yup.string()
      .trim()
      .max(5000, 'Нотатки не можуть бути довшими за 5000 символів')
      .default(''),
  });

export const createLeadRequestSchema = leadFormSchema.shape({
  recaptchaToken: Yup.string().trim().required('Підтвердіть, що ви не робот'),
});

export type CreateLeadRequestDTO = Yup.InferType<
  typeof createLeadRequestSchema
>;
