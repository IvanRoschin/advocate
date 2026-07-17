import { offerContent } from '@/app/resources/content/pages/offer.content';

const OfferContent = () => (
  <section className="min-w-0">
    <article className="border-border bg-card rounded-2xl border p-5 lg:p-6">
      <div className="space-y-8">
        <p className="text-muted-foreground text-sm leading-7">
          {offerContent.intro}
        </p>

        {offerContent.sections.map(section => (
          <section key={section.title}>
            <h2 className="text-foreground text-xl font-semibold">
              {section.title}
            </h2>

            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, index) => (
                <p
                  key={`${section.title}-${index}`}
                  className="text-muted-foreground text-sm leading-7"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-foreground text-xl font-semibold">
            {offerContent.requisites.title}
          </h2>

          <ul className="mt-3 space-y-2">
            {offerContent.requisites.items.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="text-muted-foreground text-sm leading-7"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  </section>
);

export default OfferContent;
