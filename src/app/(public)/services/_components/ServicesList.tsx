'use client';

import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

import { imageVariants } from '@/app/config/imageVariants';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { ServiceListItemDto } from '@/app/types';

export type ListSectionProps = {
  services: ServiceListItemDto[];
};
const ServicesList = ({ services }: ListSectionProps) => {
  if (services.length === 0) {
    return (
      <section className="min-w-0">
        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-app text-base leading-7">
            Наразі опублікованих послуг ще немає.
          </p>
        </div>
      </section>
    );
  }
  const variant = imageVariants.card;

  return (
    <section className="min-w-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(service => {
          const publicId = service.src
            ? getCloudinarySrc(service.src)
            : undefined;

          return (
            <article
              key={service.id}
              className="border-border bg-card overflow-hidden rounded-2xl border"
            >
              <Link
                href={`/services/${service.slug}`}
                className="text-accent text-sm font-semibold"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden">
                  {publicId ? (
                    <CldImage
                      src={publicId}
                      alt={service.title}
                      fill
                      sizes={variant.sizes}
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-accent text-xl font-semibold">
                    {service.title}
                  </h2>
                  <p className="text-app mt-3 text-sm leading-6">
                    {service.summary}
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesList;
