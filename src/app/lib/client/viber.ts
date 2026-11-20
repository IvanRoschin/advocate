'use client';

import { toast } from 'sonner';

/** Витягує номер з viber://chat?number=%2B380... → +380... */
export function viberNumberFromHref(href: string): string | null {
  const m = /[?&]number=([^&]+)/i.exec(href);
  if (!m?.[1]) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

const FALLBACK_DELAY_MS = 1500;

/**
 * Браузер не дає перевірити, чи зареєстрований обробник viber://.
 * Якщо застосунок відкрився — вкладка втрачає фокус (blur / visibilitychange).
 * Якщо за 1.5 с цього не сталося — Viber, найімовірніше, не встановлено:
 * копіюємо номер і показуємо підказку, щоб клієнт не залишився "ні з чим".
 */
export function watchViberLaunch(href: string) {
  if (typeof window === 'undefined') return;

  const number = viberNumberFromHref(href);
  let launched = false;

  const markLaunched = () => {
    launched = true;
  };
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') launched = true;
  };

  window.addEventListener('blur', markLaunched, { once: true });
  document.addEventListener('visibilitychange', onVisibility);

  window.setTimeout(() => {
    window.removeEventListener('blur', markLaunched);
    document.removeEventListener('visibilitychange', onVisibility);
    if (launched || !number) return;

    const show = (copied: boolean) =>
      toast.info('Схоже, Viber не встановлено на цьому пристрої', {
        id: 'viber-fallback',
        description: copied
          ? `Номер ${number} скопійовано — знайдіть його у Viber на телефоні.`
          : `Напишіть нам у Viber на номер ${number}.`,
      });

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(number).then(
        () => show(true),
        () => show(false)
      );
    } else {
      show(false);
    }
  }, FALLBACK_DELAY_MS);
}
