import * as Yup from 'yup';

import { UserRole } from './user.enums';

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/;
const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+380\d{9}$/;
const passwordRegex = /^\S+$/;

export const baseUserSchema = {
  name: Yup.string().min(2).max(20).matches(nameRegex),

  email: Yup.string().min(3).max(63).email().matches(emailRegex),

  phone: Yup.string().matches(phoneRegex).optional(),

  password: Yup.string().matches(passwordRegex).min(6).optional(),

  role: Yup.mixed<UserRole>().oneOf(Object.values(UserRole)),

  isActive: Yup.boolean(),

  googleId: Yup.string().optional(),
};

export const createUserSchema = Yup.object({
  name: baseUserSchema.name.required("Обов'язкове поле"),

  email: baseUserSchema.email.required("Обов'язкове поле"),

  password: baseUserSchema.password.optional(),

  phone: baseUserSchema.phone,
  role: baseUserSchema.role.default(UserRole.CLIENT),
  isActive: baseUserSchema.isActive.default(false),
  googleId: baseUserSchema.googleId,
});

export type CreateUserFormValues = Yup.InferType<typeof createUserSchema>;

/* -------------------------------- Update (PATCH) -------------------------------- */

export const updateUserSchema = Yup.object({
  name: baseUserSchema.name.optional(),

  email: baseUserSchema.email.optional(),
  password: baseUserSchema.password.optional(),

  phone: baseUserSchema.phone.optional(),
  role: baseUserSchema.role.optional(),
  isActive: baseUserSchema.isActive,
  googleId: baseUserSchema.googleId,
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
