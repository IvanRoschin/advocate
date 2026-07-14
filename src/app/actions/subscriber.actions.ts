import 'server-only';

import {
  subscriberQueries,
  subscriberRepo,
} from '../lib/repositories/subscriber.repo';
import { Subscriber } from '../models';
import { mapSubscriberToResponse, SubscriberResponseDTO } from '../types';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';
import { createPublicAction } from './createPublicAction';
import { notifySubscriberCreated } from './subscriber-notifications.helpers';

export const subscriberActions = createEntityModule({
  repo: subscriberRepo,

  toDTO: mapSubscriberToResponse,
  toListDTO: mapSubscriberToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Subscriber not found',
  },
});

export const subscriberPublicActions = {
  create: createPublicAction<
    { email: string; website?: string; turnstileToken?: string },
    SubscriberResponseDTO
  >(async ({ args }) => {
    let subscriber = await Subscriber.findOne({ email: args.email });

    if (subscriber) {
      if (!subscriber.subscribed) {
        subscriber.subscribed = true;
        await subscriber.save();
      }
    } else {
      subscriber = await subscriberActions.create({ email: args.email });
    }

    await notifySubscriberCreated({ email: args.email });

    return mapSubscriberToResponse(subscriber);
  }),

  list: createAction<
    { page?: number; limit?: number },
    {
      items: ReturnType<typeof mapSubscriberToResponse>[];
      total: number;
      hasMore: boolean;
    }
  >(async ({ args }) => {
    const page = Math.max(1, args?.page ?? 1);
    const limit = Math.max(1, args?.limit ?? 10);

    const result = await subscriberRepo.findAllPaginated(page, limit);

    return {
      ...result,
      items: result.items.map(mapSubscriberToResponse),
    };
  }),

  activate: createAction<string, SubscriberResponseDTO>(
    async ({ args: id }) => {
      const subscriber = await subscriberRepo.activate(id);

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      return mapSubscriberToResponse(subscriber);
    }
  ),

  deactivate: createAction<string, SubscriberResponseDTO>(
    async ({ args: id }) => {
      const subscriber = await subscriberRepo.deactivate(id);

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      return mapSubscriberToResponse(subscriber);
    }
  ),

  active: createAction<void, SubscriberResponseDTO[]>(async () => {
    const items = await subscriberQueries.findActive();

    return items.map(mapSubscriberToResponse);
  }),
};
