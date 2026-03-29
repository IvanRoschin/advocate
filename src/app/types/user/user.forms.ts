import * as Yup from 'yup';

import type { CreateUserRequestDTO } from './user.dto';
import { UserRole } from './user.enums';
const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/;
const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+380\d{9}$/;
const passwordRegex = /^\S+$/;

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

export const baseUserSchema = {
  name: Yup.string()
    .transform(emptyToUndefined)
    .min(2)
    .max(20)
    .matches(nameRegex),

  email: Yup.string()
    .transform(emptyToUndefined)
    .min(3)
    .max(63)
    .email()
    .matches(emailRegex),

  phone: Yup.string()
    .transform(emptyToUndefined)
    .matches(phoneRegex)
    .optional(),

  password: Yup.string()
    .transform(emptyToUndefined)
    .matches(passwordRegex)
    .min(6)
    .optional(),

  role: Yup.mixed<UserRole>().oneOf(Object.values(UserRole)).optional(),

  isActive: Yup.boolean().optional(),

  googleId: Yup.string().transform(emptyToUndefined).optional(),
};

export const createUserSchema: Yup.ObjectSchema<CreateUserRequestDTO> =
  Yup.object({
    name: baseUserSchema.name.required("Обов'язкове поле"),

    email: baseUserSchema.email.required("Обов'язкове поле"),

    password: baseUserSchema.password.optional(),

    phone: baseUserSchema.phone,
    role: baseUserSchema.role.default(UserRole.ADMIN),
    isActive: baseUserSchema.isActive.default(false),
    googleId: baseUserSchema.googleId,
  }).noUnknown(true);

export type CreateUserFormValues = Yup.InferType<typeof createUserSchema>;

export const updateUserSchema = Yup.object({
  name: baseUserSchema.name.optional(),

  email: baseUserSchema.email.optional(),
  password: baseUserSchema.password.optional(),

  phone: baseUserSchema.phone.optional(),
  role: baseUserSchema.role.optional(),
  isActive: baseUserSchema.isActive.optional(),
  googleId: baseUserSchema.googleId.optional(),
})
  .noUnknown(true)
  .test(
    'at-least-one-field',
    'Потрібно змінити хоча б одне поле',
    value =>
      value != null &&
      Object.values(value).some(v =>
        Array.isArray(v) ? v.length > 0 : v !== undefined
      )
  );

export type UpdateUserFormValues = Yup.InferType<typeof updateUserSchema>;
