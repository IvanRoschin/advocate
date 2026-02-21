'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

import { useLoadingStore } from '@/app/store/loading.store.ts';

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

function isExternalHref(href: unknown) {
  return typeof href === 'string' && /^(https?:)?\/\//.test(href);
}

function getHrefPathname(href: LinkProps['href']): string | null {
  if (typeof href === 'string') {
    const noHash = href.split('#')[0] ?? href;
    const noQuery = noHash.split('?')[0] ?? noHash;
    return noQuery || '/';
  }
  return href?.pathname ?? null;
}

export function AppLink({ onClick, target, href, ...props }: Props) {
  const start = useLoadingStore(s => s.start);
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href={href}
      target={target}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        // новая вкладка / модификаторы / не левый клик
        if (
          target === '_blank' ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }

        // внешняя ссылка
        if (isExternalHref(href)) return;

        // тот же pathname (часто hash-only)
        const nextPath = getHrefPathname(href);
        if (!nextPath || nextPath === pathname) return;

        start();
      }}
    />
  );
}
