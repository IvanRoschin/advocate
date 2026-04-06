import { NextImage } from '@/app/components';
import { payment } from '@/app/resources/content';

import PaymentForm from './paymentForm';

export default function PaymentsAside() {
  return (
    <div className="space-y-4">
      <PaymentForm />
      <div className="flex flex-col items-center justify-center">
        <p className="text-app mt-3 text-sm leading-6">
          або скористайтесь QR кодом для оплати
        </p>
        <NextImage
          src="/images/payment/paymentqr.png"
          alt="payment QR-code"
          width={100}
          height={100}
          priority={false}
        />
      </div>
      <div className="border-accent rounded-2xl border p-6">
        <h2 className="text-accent text-xl font-semibold tracking-tight">
          {payment.aside.title}
        </h2>

        <p className="text-app mt-3 text-sm leading-6">
          {payment.aside.description}
        </p>

        <div className="border-accent mt-6 border-t pt-4">
          <p className="text-muted-foreground text-xs leading-5">
            {payment.aside.footnote}
          </p>
        </div>
      </div>
    </div>
  );
}
