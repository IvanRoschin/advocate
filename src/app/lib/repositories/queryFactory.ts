import { Model } from 'mongoose';

import { QueryBuilder } from '../../helpers/queryBuilder';

export function createQuery<T extends object>(model: Model<T>) {
  return () => new QueryBuilder<T>(model);
}
