'use client';

import Link from 'next/link';

import { NextImage } from '@/app/components';
import { imageVariants } from '@/app/config/imageVariants';
import { cloudinaryLoader } from '@/app/lib/cloudinary/cloudinaryLoader';
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
        {services.map(service => (
          <article
            key={service.id}
            className="border-border bg-card overflow-hidden rounded-2xl border"
          >
            <Link
              href={`/services/${service.slug}`}
              className="text-accent text-sm font-semibold"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden">
                {service.src ? (
                  <NextImage
                    useSkeleton
                    src={getCloudinarySrc(service.src)}
                    loader={cloudinaryLoader}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes={variant.sizes}
                    fetchPriority="auto"
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
                {/* <div className="mt-5">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-accent text-sm font-semibold"
                  >
                    Детальніше
                  </Link>
                </div> */}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServicesList;
