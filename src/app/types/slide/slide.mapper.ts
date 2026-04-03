import type { SlideResponseDTO } from '@/app/types';
import type { SlideEntity } from '@/app/models/Slide';

type SlideLike = SlideEntity & {
  _id: { toString(): string } | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function mapSlideToResponse(slide: SlideLike): SlideResponseDTO {
  return {
    _id: slide._id.toString(),
    title: slide.title,
    desc: slide.desc,
    src: slide.src ?? [],
    isActive: Boolean(slide.isActive),
    createdAt: slide.createdAt
      ? new Date(slide.createdAt).toISOString()
      : undefined,
    updatedAt: slide.updatedAt
      ? new Date(slide.updatedAt).toISOString()
      : undefined,
  };
}
