import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { sendTelegramMessage } from '@/app/lib';

type WayForPayCallbackBody = {
  merchantAccount?: string;
  orderReference?: string;
  merchantSignature?: string;
  amount?: number | string;
  currency?: string;
  authCode?: string;
  email?: string;
  phone?: string;
  createdDate?: number | string;
  processingDate?: number | string;
  cardPan?: string;
  cardType?: string;
  issuerBankCountry?: string;
  issuerBankName?: string;
  recToken?: string;
  transactionStatus?: string;
  reason?: string;
  reasonCode?: number | string;
  fee?: number | string;
  paymentSystem?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }

  return value;
}

const SECRET_KEY = getRequiredEnv('WAYFORPAY_SECRET_KEY');
const MERCHANT_ACCOUNT = getRequiredEnv('WAYFORPAY_MERCHANT_ACCOUNT');

function createHmacMd5(values: Array<string | number>): string {
  const payload = values.map(value => String(value)).join(';');

  return crypto
    .createHmac('md5', SECRET_KEY)
    .update(payload, 'utf8')
    .digest('hex');
}

function getAcceptResponse(orderReference: string, time: number) {
  const status = 'accept';
  const signature = createHmacMd5([orderReference, status, time]);

  return {
    orderReference,
    status,
    time,
    signature,
  };
}

async function handleApprovedPayment(payload: WayForPayCallbackBody) {
  await sendTelegramMessage(
    [
      '✅ <b>WayForPay: успішна оплата</b>',
      `🧾 Reference: ${payload.orderReference ?? '-'}`,
      `💰 Amount: ${payload.amount ?? '-'} ${payload.currency ?? ''}`,
      `📧 Email: ${payload.email ?? '-'}`,
      `📱 Phone: ${payload.phone ?? '-'}`,
      `💳 Status: ${payload.transactionStatus ?? '-'}`,
    ].join('\n')
  );

  // console.info('WayForPay approved payment:', {
  //   orderReference: payload.orderReference,
  //   amount: payload.amount,
  //   currency: payload.currency,
  //   email: payload.email,
  //   phone: payload.phone,
  //   transactionStatus: payload.transactionStatus,
  //   reasonCode: payload.reasonCode,
  //   paymentSystem: payload.paymentSystem,
  // });
}

async function handleDeclinedPayment(payload: WayForPayCallbackBody) {
  console.warn('WayForPay declined payment:', {
    orderReference: payload.orderReference,
    amount: payload.amount,
    currency: payload.currency,
    transactionStatus: payload.transactionStatus,
    reason: payload.reason,
    reasonCode: payload.reasonCode,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WayForPayCallbackBody;

    const orderReference = String(body.orderReference ?? '').trim();
    const merchantSignature = String(body.merchantSignature ?? '').trim();
    const amount = String(body.amount ?? '').trim();
    const currency = String(body.currency ?? '').trim();
    const authCode = String(body.authCode ?? '').trim();
    const cardPan = String(body.cardPan ?? '').trim();
    const transactionStatus = String(body.transactionStatus ?? '').trim();
    const reasonCode = String(body.reasonCode ?? '').trim();

    if (!orderReference || !merchantSignature) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required callback fields' },
        { status: 400 }
      );
    }

    const expectedSignature = createHmacMd5([
      MERCHANT_ACCOUNT,
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reasonCode,
    ]);

    if (expectedSignature !== merchantSignature) {
      console.error('WayForPay callback signature mismatch', {
        orderReference,
        expectedSignature,
        merchantSignature,
      });

      return NextResponse.json(
        { status: 'refused', reason: 'Invalid merchant signature' },
        { status: 403 }
      );
    }

    if (transactionStatus === 'Approved') {
      await handleApprovedPayment(body);
    } else {
      await handleDeclinedPayment(body);
    }

    const time = Math.floor(Date.now() / 1000);

    return NextResponse.json(getAcceptResponse(orderReference, time));
  } catch (error) {
    console.error('WayForPay callback error:', error);

    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
