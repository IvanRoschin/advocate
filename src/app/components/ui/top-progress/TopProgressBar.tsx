'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useLoadingStore } from '@/store/loading.store.ts';

export function TopProgressBar() {
  const progress = useLoadingStore(s => s.progress);
  const visible = progress > 0 && progress < 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed top-0 left-0 z-9999 h-0.75 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-foreground h-full w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ ease: 'easeOut', duration: 0.12 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
