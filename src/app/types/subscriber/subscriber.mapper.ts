import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';

import { SubscriberResponseDTO } from './subscriber.dto';

import type { SubscriberEntity } from '@/app/models/Subscriber';
export type SubscriberLike = SubscriberEntity & {
  _id: { toString(): string } | string;
  recaptchaToken?: string;
  consent?: boolean;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function mapSubscriberToResponse(
  subscriber: SubscriberLike
): SubscriberResponseDTO {
  return {
    _id: toIdString(subscriber._id),
    email: subscriber.email,
    subscribed: Boolean(subscriber.subscribed),
    createdAt: toIsoString(subscriber.createdAt),
    updatedAt: toIsoString(subscriber.updatedAt),
  };
}
