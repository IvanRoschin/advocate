'use client';

import { useEffect, useRef, useState } from 'react';
import SlotCounter from 'react-slot-counter';

type Props = {
  value: number;
  suffix?: string;
};

/**
 * Число завжди присутнє в HTML (SSR) — його бачать пошуковики, AI-краулери
 * та відвідувачі без JS. Анімація лише «програється» поверх, коли блок
 * потрапляє у вʼюпорт, і не прибирає значення при виході з нього.
 */
export default function AdvantageCounter({ value, suffix }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-advantages flex items-end text-4xl font-bold md:text-5xl lg:text-6xl"
    >
      {animate ? (
        <SlotCounter value={value} duration={1.6} />
      ) : (
        <span>{value}</span>
      )}
      {suffix && (
        <span className="text-accent ml-1 text-2xl md:text-3xl">{suffix}</span>
      )}
    </div>
  );
}
