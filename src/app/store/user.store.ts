import { create } from 'zustand';

// Import the type directly, not from the root `../types` barrel — that
// barrel re-exports every domain (admin, client, lead, ...) via `export *`.
// This store is pulled into every page through UserProvider in the root
// layout, so going through the barrel dragged admin/client/lead runtime
// code into the shared chunk every page has to download and parse.
import type { SessionUserDTO } from '../types/user/user.dto';

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
