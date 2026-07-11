import { CategoryIconKey } from '@/app/resources/category-icons';

export type CategoryAdminRow = {
  _id: string;
  title: string;
  slug: string;
  icon: CategoryIconKey;
  createdAt: string;
  updatedAt: string;
};

// PublicRow — для публичных списков, без служебных полей
export type CategoryPublicRow = {
  _id: string;
  title: string;
  slug: string;
  icon: CategoryIconKey;
};

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
