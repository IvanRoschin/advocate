import { Metadata } from 'next/types';

import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { renderLayout } from '@/app/lib/layouts/renderLayout';
import {
  offerLayout,
  OfferLayoutNode,
} from '@/app/resources/content/pages/offer.layout';

import { OFFER_SECTIONS } from './_components/offer.sections';

export const metadata: Metadata = buildMetadata({
  title: 'Публічний договір (оферта) | Адвокат Іван Рощин',
  description:
    'Публічна оферта на надання правничої допомоги адвокатом Іваном Рощиним: умови, порядок оплати, права та обов’язки сторін.',
  path: '/offer',
  imageUrl: '/images/ivan_roschin.webp',
});

export const dynamic = 'force-dynamic';

export default async function OfferPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: offerLayout as OfferLayoutNode[],
        sections: OFFER_SECTIONS,
        sectionProps: {},
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
