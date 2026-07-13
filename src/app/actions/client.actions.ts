import { clientRepo, RepairClientAccessResult } from '../lib/repositories';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export const clientActions = createEntityModule({
  repo: clientRepo,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Client not found',
  },
});

export const clientPublicActions = {
  repairClientAccessService: createAction<
    { userId: string },
    RepairClientAccessResult
  >(({ args }) => clientRepo.repairClientAccessService(args.userId)),
};
