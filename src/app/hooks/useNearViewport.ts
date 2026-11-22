'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * true, коли елемент наблизився до вʼюпорту (rootMargin) — і далі лишається true.
 * Для відкладеного монтування важких клієнтських блоків (форми з Formik/Yup/Turnstile).
 */
export function useNearViewport<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '800px'
) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
}
