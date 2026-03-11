import { Metadata } from 'next/types';

import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { paymentLayout } from '@/app/resources/content/pages/payment.layout';

import { renderLayout } from '../lib/layouts/renderLayout';
import {
  PAYMENT_SECTIONS,
  PaymentSectionProps,
} from './_components/payment.sections';

export const metadata: Metadata = buildMetadata({
  title: 'Оплата послуг адвоката | Іван Рощин',
  description:
    'Сторінка оплати юридичних послуг адвоката Івана Рощина. Реквізити для оплати, призначення платежу та важлива інформація.',
  path: '/payment',
  imageUrl: '/images/ivan_roschin.webp',
});

export default function PaymentPage() {
  const sectionProps: PaymentSectionProps = {};

  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: paymentLayout,
        sections: PAYMENT_SECTIONS,
        sectionProps,
        renderGroup: ({ node, children, index }) => (
          <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              {children}
            </div>
          </div>
        ),
      })}
    </main>
  );
}
