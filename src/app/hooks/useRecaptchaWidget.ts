'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type RecaptchaTheme = 'light' | 'dark';

type GrecaptchaRenderParams = {
  sitekey: string;
  theme?: RecaptchaTheme;
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
  theme?: RecaptchaTheme;
};

type UseRecaptchaWidgetResult = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  captchaToken: string;
  isRendered: boolean;
  resetCaptcha: () => void;
};

export function useRecaptchaWidget({
  siteKey,
  theme = 'light',
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
    let frameId: number | null = null;

    widgetIdRef.current = null;
    containerRef.current.innerHTML = '';

    const tryRender = () => {
      if (cancelled) return;
      if (!containerRef.current) return;
      if (widgetIdRef.current !== null) return;

      const grecaptcha = getGrecaptcha();
      if (!grecaptcha) return;

      const mountNode = document.createElement('div');
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(mountNode);

      widgetIdRef.current = grecaptcha.render(mountNode, {
        sitekey: siteKey,
        theme,
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

      if (!cancelled) {
        setIsRendered(true);
      }
    };

    frameId = window.requestAnimationFrame(() => {
      tryRender();
    });

    const intervalId = window.setInterval(() => {
      if (widgetIdRef.current !== null) {
        window.clearInterval(intervalId);
        return;
      }

      tryRender();
    }, 300);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [siteKey, theme]);

  return {
    containerRef,
    captchaToken,
    isRendered,
    resetCaptcha,
  };
}
