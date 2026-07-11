import { toIdString, toIsoString } from '@/app/lib/mappers/_utils';

import type { SlideEntity } from '@/app/models/Slide';
import type { SlideResponseDTO } from '@/app/types';

export type SlideLike = SlideEntity & {
  _id: { toString(): string } | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function mapSlideToResponse(slide: SlideLike): SlideResponseDTO {
  return {
    _id: toIdString(slide._id),
    title: slide.title,
    desc: slide.desc,
    src: slide.src ?? [],
    isActive: Boolean(slide.isActive),
    createdAt: toIsoString(slide.createdAt),
    updatedAt: toIsoString(slide.updatedAt),
  };
}
