'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { brand } from '@/app/resources';
import { useLoadingStore } from '@/app/store/loading.store';

import { NextImage } from '../../common';

export function PremiumLoader() {
  const isLoading = useLoadingStore(s => s.isLoading);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="bg-background/70 fixed inset-0 z-9998 grid place-items-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              <motion.svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 80 80"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
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
              </motion.svg>

              <NextImage
                src={brand.logoSrc}
                alt="Logo"
                width={38}
                height={38}
                preload
              />
            </div>

            <motion.p
              className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {brand.label}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
