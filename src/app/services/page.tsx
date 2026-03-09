import type { Metadata } from 'next';
import Link from 'next/link';

import { generateMetadata as buildMetadata } from '@/app/helpers/generateMetadata';
import { serviceService } from '@/app/lib/services/service.service';

import { NextImage } from '../components';

export const metadata: Metadata = buildMetadata({
  title: 'Послуги адвоката | Іван Рощин',
  description:
    'Юридичні послуги адвоката Івана Рощина: консультації, представництво в суді, супровід справ та правовий захист.',
  path: '/services',
  imageUrl: '/images/ivan_roschin.webp',
});

export default async function ServicesPage() {
  const services = await serviceService.getPublicList();

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="container py-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-accent mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
            Послуги
          </p>

          <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-4xl">
            Юридичні послуги
          </h1>

          <p className="text-app mt-4 text-base leading-7">
            Оберіть напрям правової допомоги, який відповідає вашій ситуації.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="text-app text-base leading-7">
              Наразі опублікованих послуг ще немає.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <article
                key={service.id}
                className="border-border bg-card overflow-hidden rounded-2xl border"
              >
                {service.src ? (
                  <div className="aspect-16/10 w-full overflow-hidden">
                    {/* temporary: later replace with next/image or your image wrapper */}
                    <NextImage
                      src={service.src}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="p-5">
                  <h2 className="text-accent text-xl font-semibold">
                    {service.title}
                  </h2>

                  <p className="text-app mt-3 text-sm leading-6">
                    {service.summary}
                  </p>

                  <div className="mt-5">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-accent text-sm font-semibold"
                    >
                      Детальніше
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
