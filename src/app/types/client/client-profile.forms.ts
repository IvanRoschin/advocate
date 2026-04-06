import * as Yup from 'yup';

import { ClientProfileDto, UpdateClientProfileDto } from './client-profile.dto';

export type ClientProfileFormValues = ClientProfileDto;

export const clientProfileSchema = Yup.object({
  fullName: Yup.string().trim().min(2).required("Обов'язкове поле"),
  email: Yup.string()
    .trim()
    .email('Некоректний email')
    .required("Обов'язкове поле"),
  phone: Yup.string().trim().min(8).required("Обов'язкове поле"),
  address: Yup.string().trim().default(''),
  companyName: Yup.string().trim().default(''),
  type: Yup.mixed<'individual' | 'company'>()
    .oneOf(['individual', 'company'])
    .required("Обов'язкове поле"),
  status: Yup.mixed<'active' | 'inactive'>()
    .oneOf(['active', 'inactive'])
    .required("Обов'язкове поле"),
});

export const updateClientProfileSchema = Yup.object({
  fullName: Yup.string().trim().min(2).required("Обов'язкове поле"),
  email: Yup.string()
    .trim()
    .email('Некоректний email')
    .required("Обов'язкове поле"),
  phone: Yup.string().trim().min(8).required("Обов'язкове поле"),
  address: Yup.string().trim().default(''),
  companyName: Yup.string().trim().default(''),
  type: Yup.mixed<'individual' | 'company'>()
    .oneOf(['individual', 'company'])
    .required("Обов'язкове поле"),
}).noUnknown(true);

export const mapClientProfileToForm = (
  profile: ClientProfileDto
): ClientProfileFormValues => ({
  ...profile,
});

export const mapFormToUpdateClientProfile = (
  values: ClientProfileFormValues
): UpdateClientProfileDto => ({
  fullName: values.fullName.trim(),
  email: values.email.trim(),
  phone: values.phone.trim(),
  companyName: values.companyName.trim(),
  address: values.address.trim(),
  type: values.type,
});
