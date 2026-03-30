'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { brand } from '@/app/resources';
import { useLoadingStore } from '@/app/store/loading.store.ts';

import { NextImage } from '../../common';

export function PremiumLoader() {
  const isLoading = useLoadingStore(s => s.isLoading);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="bg-background/80 fixed inset-0 z-9998 grid place-items-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card flex flex-col items-center gap-5 rounded-2xl border px-8 py-7 shadow-xl"
            initial={{ scale: 0.98, y: 6, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 6, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <motion.div
              className="relative"
              animate={{
                opacity: [1, 0.55, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: 'easeInOut',
              }}
            >
              <div className="bg-foreground/20 absolute inset-0 rounded-full opacity-40 blur-lg" />
              <div className="bg-background grid place-items-center rounded-full border p-4">
                <NextImage
                  src={brand.logoSrc}
                  alt="Logo"
                  width={56}
                  height={56}
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
            >
              {brand.label}
            </motion.div>

            <motion.div
              className="bg-muted h-1.5 w-48 overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              <motion.div
                className="bg-foreground h-full w-24 rounded-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
