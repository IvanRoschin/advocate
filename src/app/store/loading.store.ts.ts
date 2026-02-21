import { create } from 'zustand';

type LoadingState = {
  isLoading: boolean;
  progress: number; // 0..100

  start: () => void;
  done: () => void;
  stop: () => void;
  setProgress: (value: number) => void;
};

export const useLoadingStore = create<LoadingState>(set => ({
  isLoading: false,
  progress: 0,

  start: () =>
    set(() => ({
      isLoading: true,
      progress: 5,
    })),

  done: () =>
    set(() => ({
      isLoading: false,
      progress: 100,
    })),

  stop: () =>
    set(() => ({
      isLoading: false,
      progress: 0,
    })),

  setProgress: value =>
    set(() => ({
      progress: Math.max(0, Math.min(100, value)),
    })),
}));
