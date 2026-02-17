'use client';

import Image, { ImageProps } from 'next/image';
import * as React from 'react';

import { Skeleton } from '@/components/common';
import { cn } from '@/lib';

type NextImageProps = Omit<ImageProps, 'alt'> & {
  alt: string;
  useSkeleton?: boolean;

  /** className для wrapper */
  wrapperClassName?: string;

  /** className для самого <Image/> */
  className?: string;

  /** legacy */
  classNames?: {
    image?: string;
    wrapper?: string;
  };
};

export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  fill,
  className,
  wrapperClassName,
  classNames,
  onLoadingComplete,
  ...rest
}: NextImageProps) {
  const [isLoading, setIsLoading] = React.useState(useSkeleton);

  const style =
    !fill && typeof width === 'number' && typeof height === 'number'
      ? { width, height }
      : undefined;

  return (
    <figure
      style={style}
      className={cn(
        'relative overflow-hidden',
        classNames?.wrapper,
        wrapperClassName
      )}
    >
      {useSkeleton && isLoading && (
        <Skeleton className="absolute inset-0 z-0 h-full w-full animate-pulse rounded-md" />
      )}

      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        className={cn(
          'transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100',
          // default object-fit можно оставлять тут или задавать снаружи
          classNames?.image,
          className
        )}
        onLoadingComplete={img => {
          setIsLoading(false);
          onLoadingComplete?.(img);
        }}
        {...rest}
      />
    </figure>
  );
}
