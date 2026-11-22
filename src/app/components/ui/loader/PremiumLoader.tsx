'use client';

import { brand } from '@/app/resources';
import { useLoadingStore } from '@/app/store/loading.store';

import { NextImage } from '../../common';

export function PremiumLoader() {
  const isLoading = useLoadingStore(s => s.isLoading);

  return (
    <>
      {isLoading && (
        <div className="bg-background/70 animate-in fade-in fixed inset-0 z-9998 grid place-items-center backdrop-blur-sm duration-150">
          <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-4 duration-200 ease-out">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full animate-spin [animation-duration:2.2s]"
                viewBox="0 0 80 80"
                fill="none"
              >
                {/* тонке фонове кільце */}
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="var(--accentcolor)"
                  strokeOpacity="0.15"
                  strokeWidth="1.5"
                />
                {/* активна дуга — те, що "обертається" */}
                <path
                  d="M40 4a36 36 0 0 1 25.46 61.46"
                  stroke="var(--accentcolor)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <NextImage
                src={brand.logoSrc}
                alt="Logo"
                width={38}
                height={38}
                priority
              />
            </div>

            <p className="text-muted-foreground animate-in fade-in text-xs font-medium tracking-[0.2em] uppercase delay-100 duration-200">
              {brand.label}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
