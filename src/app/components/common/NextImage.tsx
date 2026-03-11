'use client';

import Image, { ImageProps } from 'next/image';
import * as React from 'react';

import { Skeleton } from '@/components/common';
import { cn } from '@/lib';

type BaseProps = Omit<ImageProps, 'alt' | 'fill' | 'width' | 'height'> & {
  alt: string;
  useSkeleton?: boolean;
  wrapperClassName?: string;
  className?: string;
  classNames?: {
    image?: string;
    wrapper?: string;
  };
};

type FillProps = BaseProps & {
  fill: true;
  width?: never;
  height?: never;
};

type FixedSizeProps = BaseProps & {
  fill?: false | undefined;
  width: number;
  height: number;
};

type NextImageProps = FillProps | FixedSizeProps;

export default function NextImage({
  useSkeleton = false,
  src,
  alt,
  className,
  wrapperClassName,
  classNames,
  onLoad,
  ...props
}: NextImageProps) {
  const [isLoading, setIsLoading] = React.useState(useSkeleton);

  const isFill = 'fill' in props && props.fill === true;

  const style =
    !isFill && 'width' in props && 'height' in props
      ? { width: props.width, height: props.height }
      : undefined;

  return (
    <figure
      style={style}
      className={cn(
        isFill ? 'absolute inset-0' : 'relative',
        'overflow-hidden',
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
        {...props}
        className={cn(
          'transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100',
          classNames?.image,
          className
        )}
        onLoad={event => {
          if (useSkeleton) setIsLoading(false);
          onLoad?.(event);
        }}
      />
    </figure>
  );
}
