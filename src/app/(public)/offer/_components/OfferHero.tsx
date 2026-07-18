import { offerContent } from '@/app/resources/content/pages/offer.content';

const OfferHero = () => (
  <section className="container py-8 lg:py-10">
    <div className="max-w-3xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
        {offerContent.eyebrow}
      </p>

      <h1 className="text-foreground text-3xl font-semibold tracking-tight lg:text-4xl">
        {offerContent.heading}
      </h1>

      <p className="text-muted-foreground mt-4 text-base leading-7">
        {offerContent.lead}
      </p>
    </div>
  </section>
);

export default OfferHero;
