import * as Yup from 'yup';

import { CLIENT_STATUSES, CLIENT_TYPES } from './client.dto';

const clientShape = {
  type: Yup.mixed<(typeof CLIENT_TYPES)[number]>()
    .oneOf([...CLIENT_TYPES], 'Оберіть тип клієнта')
    .required('Оберіть тип клієнта'),

  status: Yup.mixed<(typeof CLIENT_STATUSES)[number]>()
    .oneOf([...CLIENT_STATUSES], 'Некоректний статус')
    .default('active'),

  fullName: Yup.string().trim().required('Вкажіть імʼя / назву'),
  email: Yup.string()
    .trim()
    .email('Некоректний email')
    .required('Вкажіть email'),
  phone: Yup.string().trim().required('Вкажіть телефон'),

  companyName: Yup.string().trim().default(''),
  taxId: Yup.string().trim().default(''),
  address: Yup.string().trim().default(''),
  notes: Yup.string().trim().default(''),
  sourceLeadId: Yup.string().nullable().default(null),
};

export const clientFormSchema = Yup.object(clientShape);

export const createClientSchema = Yup.object(clientShape);

export const updateClientSchema = Yup.object({
  type: Yup.mixed<(typeof CLIENT_TYPES)[number]>()
    .oneOf([...CLIENT_TYPES], 'Оберіть тип клієнта')
    .optional(),

  status: Yup.mixed<(typeof CLIENT_STATUSES)[number]>()
    .oneOf([...CLIENT_STATUSES], 'Некоректний статус')
    .optional(),

  fullName: Yup.string().trim().optional(),
  email: Yup.string().trim().email('Некоректний email').optional(),
  phone: Yup.string().trim().optional(),
  companyName: Yup.string().trim().optional(),
  taxId: Yup.string().trim().optional(),
  address: Yup.string().trim().optional(),
  notes: Yup.string().trim().optional(),
}).noUnknown(true);
