import Link from 'next/link';

import { offerContent } from '@/app/resources/content/pages/offer.content';

const OfferAside = () => (
  <aside className="border-accent min-w-0 space-y-4 pl-4 lg:sticky lg:top-24 lg:self-start lg:border-l">
    <div className="border-border bg-card rounded-2xl border p-5">
      <h2 className="text-foreground text-lg font-semibold">
        {offerContent.aside.title}
      </h2>

      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {offerContent.aside.description}
      </p>

      <div className="mt-4">
        <Link
          href={offerContent.aside.href}
          className="text-accent text-sm font-semibold"
        >
          {offerContent.aside.label}
        </Link>
      </div>
    </div>
  </aside>
);

export default OfferAside;
