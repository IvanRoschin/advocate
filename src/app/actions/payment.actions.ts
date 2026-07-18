'use server';

import { createPublicAction } from '@/app/actions/createPublicAction';
import { createLegalServiceInvoice } from '@/app/lib/wayforpay/payment-page';

import type { CreatePaymentRequestDTO } from '@/app/types/payment';

export type CreatePaymentResult = {
  ok: boolean;
  invoiceUrl?: string;
  error?: string;
};
type PublicRPaymentInput = CreatePaymentRequestDTO & {
  website?: string;
  turnstileToken?: string;
};

export const createPaymentInvoiceAction = createPublicAction<
  PublicRPaymentInput,
  CreatePaymentResult
>(async ({ args: values }) => {
  const serviceName = values.serviceName?.trim() ?? '';
  const amount =
    typeof values.amount === 'number' ? values.amount : Number(values.amount);
  const firstName = values.firstName?.trim() ?? '';
  const lastName = values.lastName?.trim() ?? '';
  const email = values.email?.trim() ?? '';

  if (!serviceName) {
    return { ok: false, error: 'Вкажіть назву послуги.' };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Вкажіть коректну суму платежу.' };
  }

  try {
    const result = await createLegalServiceInvoice({
      reference: `LEGAL-${Date.now()}`,
      amount,
      serviceName,
      client: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
      },
    });

    if (!result?.invoiceUrl) {
      return { ok: false, error: 'Платіжне посилання не було сформовано.' };
    }

    return { ok: true, invoiceUrl: result.invoiceUrl };
  } catch (error) {
    console.error('createPaymentInvoiceAction error:', error);
    return {
      ok: false,
      error: 'Не вдалося створити платіж. Спробуйте ще раз трохи пізніше.',
    };
  }
});
