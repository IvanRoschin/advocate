import 'server-only';

import { wayForPayConfig } from './config';
import { createWayForPaySignature } from './signature';

import type {
  CreateWayForPayInvoiceInput,
  WayForPayCreateInvoiceRequest,
  WayForPayCreateInvoiceResponse,
} from './types';
function assertValidInput(input: CreateWayForPayInvoiceInput): void {
  if (!input.orderReference.trim()) {
    throw new Error('orderReference is required');
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('amount must be a positive number');
  }

  if (!input.products.length) {
    throw new Error('At least one product is required');
  }

  for (const product of input.products) {
    if (!product.name.trim()) {
      throw new Error('Each product must have a name');
    }

    if (!Number.isFinite(product.price) || product.price <= 0) {
      throw new Error('Each product price must be a positive number');
    }

    if (
      product.quantity !== undefined &&
      (!Number.isInteger(product.quantity) || product.quantity <= 0)
    ) {
      throw new Error('Each product quantity must be a positive integer');
    }
  }
}

function buildRequest(
  input: CreateWayForPayInvoiceInput
): WayForPayCreateInvoiceRequest {
  assertValidInput(input);

  const orderDate = Math.floor(Date.now() / 1000);
  const currency = input.currency ?? 'UAH';
  const language = input.language ?? 'UA';

  const productName = input.products.map(product => product.name.trim());
  const productPrice = input.products.map(product => product.price);
  const productCount = input.products.map(product => product.quantity ?? 1);

  const signature = createWayForPaySignature(
    [
      wayForPayConfig.merchantAccount,
      wayForPayConfig.merchantDomainName,
      input.orderReference,
      orderDate,
      input.amount,
      currency,
      ...productName,
      ...productCount,
      ...productPrice,
    ],
    wayForPayConfig.secretKey
  );

  return {
    transactionType: 'CREATE_INVOICE',
    merchantAccount: wayForPayConfig.merchantAccount,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName: wayForPayConfig.merchantDomainName,
    merchantSignature: signature,
    apiVersion: 1,
    language,
    serviceUrl: wayForPayConfig.serviceUrl,

    orderReference: input.orderReference,
    orderDate,
    amount: input.amount,
    currency,

    productName,
    productPrice,
    productCount,

    ...(input.client?.firstName
      ? { clientFirstName: input.client.firstName }
      : {}),
    ...(input.client?.lastName
      ? { clientLastName: input.client.lastName }
      : {}),
    ...(input.client?.address ? { clientAddress: input.client.address } : {}),
    ...(input.client?.city ? { clientCity: input.client.city } : {}),
    ...(input.client?.email ? { clientEmail: input.client.email } : {}),
  };
}

export async function createWayForPayInvoice(
  input: CreateWayForPayInvoiceInput
): Promise<WayForPayCreateInvoiceResponse> {
  const request = buildRequest(input);

  const response = await fetch(wayForPayConfig.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as WayForPayCreateInvoiceResponse;

  if (!response.ok) {
    console.error('WayForPay HTTP error:', data);
    throw new Error('Не вдалося створити рахунок на оплату.');
  }

  if (typeof data.reasonCode === 'number' && data.reasonCode !== 1100) {
    console.error('WayForPay API error:', data);
    throw new Error(
      data.reason || 'WayForPay повернув помилку при створенні рахунку.'
    );
  }

  return data;
}
