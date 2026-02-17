export type CategoryResponseDTO = {
  _id: string;
  title: string;
  slug: string;
  src: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCategoryRequestDTO = {
  title: string;
  src: string[];
  slug?: string;
};

export type UpdateCategoryDTO = Partial<CreateCategoryRequestDTO>;
