import { caseQueries, caseRepo } from '@/app/lib/repositories/case.repo';
import { AdminClientCaseDto, mapCaseRowToAdminDto } from '@/app/types';

import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export const caseActions = createEntityModule({
  repo: caseRepo,

  toDTO: mapCaseRowToAdminDto,
  toListDTO: mapCaseRowToAdminDto,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Case not found',
  },
});

export const casePublicActions = {
  getCasesByClientId: createAction<string, AdminClientCaseDto[]>(
    async ({ args: clientId }) => {
      const rows = await caseQueries.findByClientId(clientId);
      return rows.map(mapCaseRowToAdminDto);
    }
  ),
};
