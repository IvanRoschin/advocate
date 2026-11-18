'use client';

import { CldImage } from 'next-cloudinary';

import { Breadcrumbs, NextImage } from '@/app/components';
import { imageVariants } from '@/app/config/imageVariants';
import {
  formatServicePrice,
  getServicePrice,
} from '@/app/config/servicePrices';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { ServicePublicPageDto } from '@/app/types';

type ServiceSectionProps = {
  service: ServicePublicPageDto;
};

const ServiceHero = ({ service }: ServiceSectionProps) => {
  const hero = service.sections.hero;

  if (!hero) return null;

  const variant = imageVariants.card;
  const price = getServicePrice(service.slug);
  const publicId = service.src ? getCloudinarySrc(service.src[0]) : undefined;

  return (
    <section className="container py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="min-w-0">
          <Breadcrumbs />
          <h1 className="title-app text-accent text-3xl font-semibold tracking-tight lg:text-5xl">
            {hero.title || service.title}
          </h1>
          <p className="text-app mt-4 text-base leading-7 lg:text-lg">
            {hero.description || service.summary}
          </p>
          {price ? (
            <div className="border-accent/40 mt-6 inline-flex flex-col rounded-2xl border px-5 py-3">
              <span className="text-app text-xs tracking-wide uppercase opacity-70">
                Вартість
              </span>
              <span className="text-accent text-2xl font-semibold">
                {formatServicePrice(price)}
              </span>
              {price.note ? (
                <span className="text-app mt-1 text-sm opacity-80">
                  {price.note}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        {publicId ? (
          <div className="relative min-h-70 min-w-0 overflow-hidden rounded-2xl lg:min-h-90">
            <NextImage
              as={CldImage}
              src={publicId}
              alt={service.title}
              fill
              sizes={variant.sizes}
              useSkeleton
              priority
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ServiceHero;
