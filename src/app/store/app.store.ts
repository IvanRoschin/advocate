import { useFiltersStore } from './filters.store';
import { useModalStore } from './modal.store';
import { useRefreshStore } from './refresh.store';
import { useUserStore } from './user.store';

export const useAppStore = () => ({
  user: useUserStore(),
  filters: useFiltersStore(),
  refresh: useRefreshStore(),
  modals: useModalStore(),
});
