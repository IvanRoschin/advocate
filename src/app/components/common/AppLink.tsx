'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

import { watchViberLaunch } from '@/app/lib/client/viber';
import { useLoadingStore } from '@/app/store/loading.store';

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

function isExternalHref(href: unknown) {
  return typeof href === 'string' && /^(https?:)?\/\//.test(href);
}

/**
 * App/protocol links (viber:, tel:, mailto:, tg:, sms:, whatsapp:) must open in
 * the same browsing context: with target="_blank" browsers open an empty tab
 * and mobile Safari/Chrome often refuse to hand the URL to the app.
 */
export function isAppSchemeHref(href: unknown) {
  return (
    typeof href === 'string' &&
    /^(viber|tel|mailto|tg|sms|whatsapp|skype):/i.test(href)
  );
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

  if (isAppSchemeHref(href)) {
    // Plain anchor: next/link is pointless for non-http URLs.
    const { rel: _rel, ...anchorProps } =
      props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    void _rel;
    return (
      <a
        {...anchorProps}
        href={href as string}
        onClick={e => {
          onClick?.(e);
          if (!e.defaultPrevented && /^viber:/i.test(href as string)) {
            watchViberLaunch(href as string);
          }
        }}
      >
        {props.children}
      </a>
    );
  }

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
