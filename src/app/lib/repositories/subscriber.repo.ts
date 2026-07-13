import { Subscriber } from '@/app/models';
import {
  CreateSubscriberDTO,
  SubscriberLike,
  UpdateSubscriberDTO,
} from '@/app/types';
import { createQuery } from './queryFactory';

const subscriberQuery = createQuery(Subscriber);

export const subscriberRepo = {
  /* ================= CRUD ================= */

  async findAll(): Promise<SubscriberLike[]> {
    return Subscriber.find().lean<SubscriberLike[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return subscriberQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<SubscriberLike>();
  },

  async findById(id: string) {
    return Subscriber.findById(id);
  },

  async create(data: CreateSubscriberDTO) {
    return Subscriber.create(data);
  },

  async update(id: string, data: UpdateSubscriberDTO) {
    return Subscriber.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return Subscriber.findByIdAndDelete(id);
  },

  /* ================= Activation ================= */

  async activate(id: string) {
    return Subscriber.findByIdAndUpdate(
      id,
      { subscribed: true },
      { returnDocument: 'after' }
    );
  },

  async deactivate(id: string) {
    return Subscriber.findByIdAndUpdate(
      id,
      { subscribed: false },
      { returnDocument: 'after', runValidators: true }
    );
  },
};

export const subscriberQueries = {
  async findActive() {
    return Subscriber.find({ subscribed: true })
      .sort({ createdAt: -1 })
      .lean<SubscriberLike[]>();
  },
};
