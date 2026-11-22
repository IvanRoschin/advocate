'use client';

import { useEffect } from 'react';

type Props = {
  measurementId: string;
  nonce?: string;
};

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'touchstart',
  'scroll',
] as const;

/** Підстраховка: якщо відвідувач нічого не робить, вантажимо GA через 10 с. */
const FALLBACK_DELAY_MS = 10_000;

/**
 * GA4 без блокування першого екрану.
 * gtag-стаб і `config` ставляться одразу — події з trackEvent накопичуються
 * в dataLayer. Сам скрипт googletagmanager (~0,5 с виконання на мобільному)
 * підвантажується після першої взаємодії або через 10 с.
 * Компроміс: візит до 10 с без жодної дії не потрапить в аналітику.
 */
export function GoogleAnalytics({ measurementId, nonce }: Props) {
  useEffect(() => {
    const w = window as GtagWindow;

    if (!w.gtag) {
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        // gtag.js очікує саме обʼєкт arguments
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag('js', new Date());
      w.gtag('config', measurementId);
    }

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      cleanup();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      if (nonce) script.nonce = nonce;
      document.head.appendChild(script);
    };

    const timer = window.setTimeout(load, FALLBACK_DELAY_MS);
    const cleanup = () => {
      window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach(e => window.removeEventListener(e, load));
    };

    INTERACTION_EVENTS.forEach(e =>
      window.addEventListener(e, load, { once: true, passive: true })
    );

    return cleanup;
  }, [measurementId, nonce]);

  return null;
}
