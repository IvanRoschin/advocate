'use client';

import Image from 'next/image';
import * as React from 'react';

import { Skeleton } from '@/components/common';
import { cn } from '@/lib';

type NextImageSrc = React.ComponentProps<typeof Image>['src'];

type CommonImageProps = {
  src: NextImageSrc;
  alt: string;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

type BaseProps<TProps extends CommonImageProps> = Omit<
  TProps,
  'alt' | 'src' | 'fill' | 'width' | 'height' | 'onLoad' | 'className'
> & {
  as?: React.ComponentType<TProps>;
  src: TProps['src'];
  alt: string;
  useSkeleton?: boolean;
  wrapperClassName?: string;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  classNames?: {
    image?: string;
    wrapper?: string;
  };
};

type FillProps<TProps extends CommonImageProps> = BaseProps<TProps> & {
  fill: true;
  width?: never;
  height?: never;
};

type FixedSizeProps<TProps extends CommonImageProps> = BaseProps<TProps> & {
  fill?: false | undefined;
  width: number;
  height: number;
};

type NextImageProps<TProps extends CommonImageProps> =
  FillProps<TProps> | FixedSizeProps<TProps>;

export default function NextImage<
  TProps extends CommonImageProps = React.ComponentProps<typeof Image>,
>({
  as,
  useSkeleton = false,
  src,
  alt,
  className,
  wrapperClassName,
  classNames,
  onLoad,
  ...props
}: NextImageProps<TProps>) {
  const [isLoading, setIsLoading] = React.useState(useSkeleton);

  const ImageComponent = (as ?? Image) as React.ComponentType<
    CommonImageProps & Record<string, unknown>
  >;

  const isFill = 'fill' in props && props.fill === true;

  const style =
    !isFill && 'width' in props && 'height' in props
      ? { width: props.width as number, height: props.height as number }
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

      <ImageComponent
        {...(props as unknown as TProps)}
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100',
          classNames?.image,
          className
        )}
        onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
          if (useSkeleton) setIsLoading(false);
          onLoad?.(event);
        }}
      />
    </figure>
  );
}
