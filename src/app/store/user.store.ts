import { create } from 'zustand';

import { UserResponseDTO } from '@/types/user/user.dto';

export interface UserState {
  user: UserResponseDTO | null;
  setUser: (user: UserResponseDTO) => void;
  updateField: <K extends keyof UserResponseDTO>(
    field: K,
    value: UserResponseDTO[K]
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
