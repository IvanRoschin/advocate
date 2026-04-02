import * as yup from 'yup';

export const createSlideSchema = yup.object({
  title: yup.string().trim().min(2).max(120).required('Вкажіть назву'),
  desc: yup.string().trim().min(5).required('Вкажіть опис'),
  src: yup
    .array()
    .of(yup.string().trim().url('Некоректне посилання'))
    .min(1, 'Щонайменше одне зображення обовʼязкове')
    .required(),
  isActive: yup.boolean().required(),
});

export const updateSlideSchema = yup.object({
  title: yup.string().trim().min(2).max(120),
  desc: yup.string().trim().min(5),
  src: yup
    .array()
    .of(yup.string().trim().url('Некоректне посилання'))
    .min(1, 'Щонайменше одне зображення обовʼязкове'),
  isActive: yup.boolean(),
});
