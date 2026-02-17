'use client';

import * as React from 'react';

import type { IconType } from 'react-icons';

type BtnVariant = 'accent' | 'outline' | 'ghost';
type BtnType = 'submit' | 'reset' | 'button';

type CommonProps = {
  label?: string;
  uiVariant?: BtnVariant;
  radius?: number | string;
  type?: BtnType;
  icon?: IconType;
  className?: string;
  children?: React.ReactNode;
};

type AnchorLikeProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> & {
    href: string;
  };

type ButtonLikeProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type BtnProps = AnchorLikeProps | ButtonLikeProps;

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const variantClasses: Record<BtnVariant, string> = {
  accent:
    'bg-[var(--accentcolor)] text-white hover:opacity-90 active:opacity-95',
  outline:
    'bg-transparent text-[var(--accentcolor)] border-2 border-[var(--accentcolor)] hover:bg-[color-mix(in_srgb,var(--accentcolor)_10%,transparent)]',
  ghost:
    'bg-transparent text-[var(--accentcolor)] hover:bg-[color-mix(in_srgb,var(--accentcolor)_8%,transparent)]',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold select-none ' +
  'px-6 py-2.5 leading-none transition-all duration-200 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accentcolor)] focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const Btn = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, BtnProps>(
  function Btn(
    {
      label,
      children,
      uiVariant = 'accent',
      radius = 14,
      icon: Icon,
      type = 'button',
      className,
      style,
      ...rest
    },
    ref
  ) {
    const content = (
      <>
        {Icon ? <Icon size={16} aria-hidden /> : null}
        {label ?? children}
      </>
    );

    const mergedStyle: React.CSSProperties = {
      borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
      ...style,
    };

    const classes = cn(baseClasses, variantClasses[uiVariant], className);

    // Если есть href — делаем <a>. Иначе — <button>.
    if ('href' in rest && typeof rest.href === 'string') {
      const { href, ...anchorRest } = rest as AnchorLikeProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          style={mergedStyle}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    const buttonRest = rest as ButtonLikeProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        style={mergedStyle}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

export default Btn;
