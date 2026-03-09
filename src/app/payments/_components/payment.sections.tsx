import type { ReactNode } from 'react';

import { PaymentSectionKey } from '@/app/resources/content/pages/payment.layout';
import { Footer, Header } from '@/components';

import PaymentsAside from './paymentsAside';
import PaymentsContent from './paymentsContent';

export type PaymentSectionProps = Record<string, never>;

export type PaymentSectionComponent = (props: PaymentSectionProps) => ReactNode;

const PaymentHeaderSection: PaymentSectionComponent = () => <Header />;

// temporary:
// пока PaymentsContent не распилен на отдельные секции,
// используем его как основной контент страницы
const PaymentFormSection: PaymentSectionComponent = () => (
  <section className="min-w-0">
    <PaymentsContent />
  </section>
);

// temporary:
// aside пока считаем order summary
const PaymentOrderSummarySection: PaymentSectionComponent = () => (
  <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
    <PaymentsAside />
  </aside>
);

// temporary:
// после декомпозиции PaymentsContent сюда вынесем отдельные блоки
const PaymentMethodsSection: PaymentSectionComponent = () => null;
const PaymentSecuritySection: PaymentSectionComponent = () => null;

const PaymentFooterSection: PaymentSectionComponent = () => <Footer />;

export const PAYMENT_SECTIONS: Record<
  PaymentSectionKey,
  PaymentSectionComponent
> = {
  header: PaymentHeaderSection,
  orderSummary: PaymentOrderSummarySection,
  paymentForm: PaymentFormSection,
  paymentMethods: PaymentMethodsSection,
  security: PaymentSecuritySection,
  footer: PaymentFooterSection,
};
