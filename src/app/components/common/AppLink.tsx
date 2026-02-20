'use client';

import Link, { LinkProps } from 'next/link';

import { useLoadingStore } from '@/store/loading.store.ts';

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

export function AppLink({ onClick, ...props }: Props) {
  const start = useLoadingStore(s => s.start);

  return (
    <Link
      {...props}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        start();
      }}
    />
  );
}
