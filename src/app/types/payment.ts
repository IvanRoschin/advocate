import * as Yup from 'yup';

export interface CreatePaymentRequestDTO {
  serviceName: string;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const createPaymentSchema = Yup.object({
  serviceName: Yup.string().trim().required('Вкажіть назву послуги'),
  amount: Yup.string()
    .trim()
    .required('Вкажіть суму платежу')
    .test('is-valid-amount', 'Вкажіть коректну суму', value => {
      if (!value) return false;
      const amount = Number(value);
      return Number.isFinite(amount) && amount > 0;
    }),
  firstName: Yup.string().trim(),
  lastName: Yup.string().trim(),
  email: Yup.string().trim().email('Некоректний email'),
});
