import { Metadata } from 'next/types';
import { Fragment } from 'react';

import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import {
  paymentLayout,
  PaymentLayoutNode,
} from '@/app/resources/content/pages/payment.layout';

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

  const renderSection = (
    key: keyof typeof PAYMENT_SECTIONS,
    uniqueKey: string
  ) => {
    const Section = PAYMENT_SECTIONS[key];

    return (
      <Fragment key={uniqueKey}>
        <Section {...sectionProps} />
      </Fragment>
    );
  };

  const renderNode = (node: PaymentLayoutNode, index: number) => {
    if (!node.display) return null;

    if (node.type === 'section') {
      return renderSection(node.key, `${node.key}-${index}`);
    }

    return (
      <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {node.items.map((item, itemIndex) =>
            item.display
              ? renderSection(item.key, `${node.key}-${item.key}-${itemIndex}`)
              : null
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      {paymentLayout.map(renderNode)}
    </main>
  );
}
