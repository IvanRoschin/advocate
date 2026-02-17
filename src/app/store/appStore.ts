import { useFiltersStore } from './filtersStore';
import { useModalStore } from './modalStore';
import { useRefreshStore } from './refreshStore';
import { useUserStore } from './userStore';

export const useAppStore = () => ({
  user: useUserStore(),
  filters: useFiltersStore(),
  refresh: useRefreshStore(),
  modals: useModalStore(),
});
