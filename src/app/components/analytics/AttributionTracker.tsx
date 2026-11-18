'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { contactMethodFromHref, trackEvent } from '@/app/lib/client/analytics';
import { captureAttribution } from '@/app/lib/client/attribution';

/**
 * Mounted once in the root layout:
 * - remembers the visit source (UTM / gclid / referrer) for lead attribution;
 * - reports clicks on phone / Telegram / Viber / email links to GA4,
 *   so contacts that bypass the lead form are counted too.
 */
export default function AttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const method = contactMethodFromHref(link.getAttribute('href') ?? '');
      if (!method) return;

      trackEvent(`click_${method}`, {
        contact_method: method,
        page_path: window.location.pathname,
      });
    };

    // Capture phase: fires even if a component stops propagation.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
