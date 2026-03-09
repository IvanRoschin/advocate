import 'server-only';
import { createWayForPayInvoice } from './create-invoice';

type LegalPaymentInput = {
  reference: string;
  amount: number;
  serviceName: string;
  client?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    address?: string;
  };
};

export async function createLegalServiceInvoice(input: LegalPaymentInput) {
  return createWayForPayInvoice({
    orderReference: input.reference,
    amount: input.amount,
    currency: 'UAH',
    language: 'UA',
    products: [
      {
        name: input.serviceName,
        price: input.amount,
        quantity: 1,
      },
    ],
    client: input.client,
  });
}
