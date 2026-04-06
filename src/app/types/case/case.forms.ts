import * as Yup from 'yup';

import type { CaseStatus } from './case.dto';

const CASE_STATUSES: CaseStatus[] = [
  'new',
  'in_progress',
  'awaiting_client',
  'in_court',
  'completed',
  'archived',
];

export const createCaseSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200')
    .required("Обов'язкове поле"),

  description: Yup.string().trim().default(''),

  status: Yup.mixed<CaseStatus>()
    .oneOf(CASE_STATUSES, 'Некоректний статус')
    .default('new')
    .optional(),

  currentStage: Yup.string()
    .trim()
    .max(200, 'Максимальна кількість символів 200')
    .default('Первинний аналіз'),

  sourceLeadId: Yup.string().trim().nullable().optional(),
  assignedLawyerId: Yup.string().trim().nullable().optional(),
}).noUnknown(true);

export const updateCaseSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200')
    .optional(),

  description: Yup.string().trim().optional(),

  status: Yup.mixed<CaseStatus>()
    .oneOf(CASE_STATUSES, 'Некоректний статус')
    .optional(),

  currentStage: Yup.string()
    .trim()
    .max(200, 'Максимальна кількість символів 200')
    .optional(),

  sourceLeadId: Yup.string().trim().nullable().optional(),
  assignedLawyerId: Yup.string().trim().nullable().optional(),
}).noUnknown(true);
