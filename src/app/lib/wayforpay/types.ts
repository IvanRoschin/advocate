export type WayForPayProduct = {
  name: string;
  price: number;
  quantity?: number;
};

export type WayForPayClient = {
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  address?: string;
};

export type CreateWayForPayInvoiceInput = {
  orderReference: string;
  amount: number;
  products: WayForPayProduct[];
  client?: WayForPayClient;
  currency?: 'UAH' | 'USD' | 'EUR';
  language?: 'UA' | 'EN' | 'RU';
};

export type WayForPayCreateInvoiceRequest = {
  transactionType: 'CREATE_INVOICE';
  merchantAccount: string;
  merchantAuthType: 'SimpleSignature';
  merchantDomainName: string;
  merchantSignature: string;
  apiVersion: 1;
  language: 'UA' | 'EN' | 'RU';
  serviceUrl?: string;

  orderReference: string;
  orderDate: number;
  amount: number;
  currency: 'UAH' | 'USD' | 'EUR';

  productName: string[];
  productPrice: number[];
  productCount: number[];

  clientFirstName?: string;
  clientLastName?: string;
  clientAddress?: string;
  clientCity?: string;
  clientEmail?: string;
};

export type WayForPayCreateInvoiceResponse = {
  reason: string;
  reasonCode: number;
  invoiceUrl?: string;
  orderReference?: string;
  createdDate?: number;
  qrCode?: string;
};
