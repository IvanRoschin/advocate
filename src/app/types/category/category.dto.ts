import { CategoryIconKey } from '@/app/resources/category-icons';

export type CategoryResponseDTO = {
  _id: string;
  title: string;
  slug: string;
  icon: CategoryIconKey;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCategoryRequestDTO = {
  title: string;
  icon: CategoryIconKey;
  slug?: string;
};

export type UpdateCategoryDTO = Partial<CreateCategoryRequestDTO>;
