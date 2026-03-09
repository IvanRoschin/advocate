import type { Metadata } from 'next';

import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import PaymentsAside from './_components/paymentsAside';
import PaymentsContent from './_components/paymentsContent';

export const metadata: Metadata = buildMetadata({
  title: 'Оплата послуг адвоката | Іван Рощин',
  description:
    'Сторінка оплати юридичних послуг адвоката Івана Рощина. Реквізити для оплати, призначення платежу та важлива інформація.',
  path: '/payment',
  imageUrl: '/images/ivan_roschin.webp',
});

export default function PaymentPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <section className="min-w-0">
          <PaymentsContent />
        </section>
        <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
          <PaymentsAside />
        </aside>
      </div>
    </main>
  );
}
