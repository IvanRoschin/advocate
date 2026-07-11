import slugify from 'slugify';

import { caseQueries, caseRepo } from '@/app/lib/repositories/case.repo';
import { AdminClientCaseDto, mapCaseRowToAdminDto } from '@/app/types';

import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export const caseActions = createEntityModule({
  repo: caseRepo,

  toDTO: mapCaseRowToAdminDto,
  toListDTO: mapCaseRowToAdminDto,

  slug: {
    enabled: true,
    makeSlug: input =>
      slugify(input, { lower: true, strict: true, locale: 'uk' }),
    getBase: data => data.title,
  },

  validation: {
    notFoundMessage: 'Case not found',
    slugConflictMessage: 'Case slug already exists',
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
