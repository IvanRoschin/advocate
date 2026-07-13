import { Types } from 'mongoose';

import { ValidationError } from '@/app/lib/server/errors/httpErrors';

export const assertObjectId = (id: string, label = 'id') => {
  if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
    throw new ValidationError(`Невірний ${label}`);
  }
};
