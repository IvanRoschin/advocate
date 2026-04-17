'use client';

import { CldImage } from 'next-cloudinary';

import { Breadcrumbs } from '@/app/components';
import { imageVariants } from '@/app/config/imageVariants';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { ServicePublicPageDto } from '@/app/types';

export type ServiceSectionProps = {
  service: ServicePublicPageDto;
};

const ServiceHero = ({ service }: ServiceSectionProps) => {
  const hero = service.sections.hero;

  if (!hero) return null;

  const variant = imageVariants.card;
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
        </div>
        {publicId ? (
          <div className="relative min-h-70 min-w-0 overflow-hidden rounded-2xl lg:min-h-90">
            <CldImage
              src={publicId}
              alt={service.title}
              fill
              sizes={variant.sizes}
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ServiceHero;
