import { create } from 'zustand';

import { SessionUserDTO } from '../types';

export interface UserState {
  user: SessionUserDTO | null;
  setUser: (user: SessionUserDTO) => void;
  updateField: <K extends keyof SessionUserDTO>(
    field: K,
    value: SessionUserDTO[K]
  ) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
  updateField: (field, value) =>
    set(state => ({
      user: state.user ? { ...state.user, [field]: value } : null,
    })),
  clearUser: () => set({ user: null }),
}));
