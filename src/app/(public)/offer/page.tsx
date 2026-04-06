import { renderLayout } from '@/app/lib/layouts/renderLayout';
import {
  offerLayout,
  OfferLayoutNode,
} from '@/app/resources/content/pages/offer.layout';
import { OFFER_SECTIONS } from './_components/offer.sections';

export const dynamic = 'force-dynamic';

export default async function OfferPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      {renderLayout({
        layout: offerLayout as OfferLayoutNode[],
        sections: OFFER_SECTIONS,
        sectionProps: undefined,
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
