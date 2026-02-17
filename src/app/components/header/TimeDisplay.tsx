'use client';

import { useEffect, useState } from 'react';

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

export const TimeDisplay = ({
  timeZone,
  locale = 'uk-UA',
}: TimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat(locale, options).format(now));
    };

    updateTime();
    const id = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(id);
  }, [timeZone, locale]);

  return <span suppressHydrationWarning>{currentTime}</span>;
};
