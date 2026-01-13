'use client';

import { useEffect, useRef, useState } from 'react';
import SlotCounter from 'react-slot-counter';

type Props = {
  value: number;
  suffix?: string;
};

export default function AdvantageCounter({ value, suffix }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-end text-4xl font-bold md:text-5xl lg:text-6xl"
    >
      {active && <SlotCounter value={value} duration={1.6} />}
      {suffix && (
        <span className="text-accent ml-1 text-2xl md:text-3xl">{suffix}</span>
      )}
    </div>
  );
}
