import type { AdminDashboardCountersDTO } from '@/app/types';
import {
  Article,
  Category,
  Lead,
  Review,
  Service,
  Subscriber,
  User,
} from '@/models';

export const adminDashboardRepo = {
  async getCounters(): Promise<AdminDashboardCountersDTO> {
    const [
      users,
      articles,
      services,
      categories,
      reviews,
      leads,
      clients,
      subscribers,
    ] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Service.countDocuments(),
      Category.countDocuments(),
      Review.countDocuments(),
      Lead.countDocuments(),
      User.countDocuments({ role: 'client' }),
      Subscriber.countDocuments(),
    ]);

    return {
      users,
      articles,
      services,
      categories,
      reviews,
      leads,
      clients,
      subscribers,
    };
  },
};
