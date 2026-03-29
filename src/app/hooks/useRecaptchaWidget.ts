'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type GrecaptchaRenderParams = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
};

type GrecaptchaApi = {
  render: (
    container: HTMLElement,
    parameters: GrecaptchaRenderParams
  ) => number;
  reset: (widgetId?: number) => void;
};

type UnknownRecord = Record<string, unknown>;

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isGrecaptchaApi(value: unknown): value is GrecaptchaApi {
  if (!isObject(value)) return false;

  return (
    typeof value.render === 'function' && typeof value.reset === 'function'
  );
}

function getGrecaptcha(): GrecaptchaApi | null {
  const maybeWindow: unknown = window;

  if (!isObject(maybeWindow)) return null;

  const maybeGrecaptcha = maybeWindow.grecaptcha;

  if (!isGrecaptchaApi(maybeGrecaptcha)) return null;

  return maybeGrecaptcha;
}

type UseRecaptchaWidgetOptions = {
  siteKey?: string;
};

type UseRecaptchaWidgetResult = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  captchaToken: string;
  isRendered: boolean;
  resetCaptcha: () => void;
};

export function useRecaptchaWidget({
  siteKey,
}: UseRecaptchaWidgetOptions): UseRecaptchaWidgetResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isRendered, setIsRendered] = useState(false);

  const resetCaptcha = useCallback(() => {
    const grecaptcha = getGrecaptcha();

    setCaptchaToken('');

    if (!grecaptcha) return;

    if (widgetIdRef.current !== null) {
      grecaptcha.reset(widgetIdRef.current);
      return;
    }

    grecaptcha.reset();
  }, []);

  useEffect(() => {
    if (!siteKey) return;
    if (!containerRef.current) return;

    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;
      if (!containerRef.current) return;
      if (widgetIdRef.current !== null) return;

      const grecaptcha = getGrecaptcha();
      if (!grecaptcha) return;

      widgetIdRef.current = grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          if (!cancelled) {
            setCaptchaToken(token);
          }
        },
        'expired-callback': () => {
          if (!cancelled) {
            setCaptchaToken('');
          }
        },
        'error-callback': () => {
          if (!cancelled) {
            setCaptchaToken('');
          }
        },
      });

      setIsRendered(true);
    };

    tryRender();

    if (widgetIdRef.current !== null) {
      return () => {
        cancelled = true;
      };
    }

    const intervalId = window.setInterval(() => {
      tryRender();

      if (widgetIdRef.current !== null) {
        window.clearInterval(intervalId);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [siteKey]);

  return {
    containerRef,
    captchaToken,
    isRendered,
    resetCaptcha,
  };
}
