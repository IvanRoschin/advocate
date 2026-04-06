import type { ReactNode } from 'react';

import Footer from '@/app/components/footer/Footer';
import { PaymentSectionKey } from '@/app/resources/content/pages/payment.layout';
import { Header } from '@/components';
import PaymentsAside from './paymentsAside';
import PaymentsContent from './paymentsContent';

export type PaymentSectionProps = Record<string, never>;

export type PaymentSectionComponent = (props: PaymentSectionProps) => ReactNode;

const HeaderSection: PaymentSectionComponent = () => <Header />;

const FormSection: PaymentSectionComponent = () => (
  <section className="min-w-0">
    <PaymentsContent />
  </section>
);

const OrderSummarySection: PaymentSectionComponent = () => (
  <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
    <PaymentsAside />
  </aside>
);

const MethodsSection: PaymentSectionComponent = () => null;
const SecuritySection: PaymentSectionComponent = () => null;

const FooterSection: PaymentSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);

export const PAYMENT_SECTIONS: Record<
  PaymentSectionKey,
  PaymentSectionComponent
> = {
  header: HeaderSection,
  orderSummary: OrderSummarySection,
  paymentForm: FormSection,
  paymentMethods: MethodsSection,
  security: SecuritySection,
  footer: FooterSection,
};
