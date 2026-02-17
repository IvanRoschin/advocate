// stores/filtersStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import storageKeys from '@/app/config/storageKeys';

export interface Option {
  value: string;
  label: string;
  slug?: string;
  src?: string;
}

export interface FiltersState {
  selectedCategory: string;
  sort: 'asc' | 'desc' | '';
  setCategory: (slug: string) => void;
  setSort: (sort: 'asc' | 'desc' | '') => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    set => ({
      selectedCategory: '',
      sort: '',
      setCategory: slug => set(state => ({ ...state, selectedCategory: slug })),
      setSort: sort => set(state => ({ ...state, sort })),
      resetFilters: () =>
        set(state => ({
          ...state,
          selectedCategory: '',
          sort: '',
        })),
    }),
    { name: storageKeys.filters }
  )
);
