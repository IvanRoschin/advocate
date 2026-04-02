export type SlideResponseDTO = {
  _id: string;
  title: string;
  desc: string;
  src: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSlideDTO = {
  title: string;
  desc: string;
  src: string[];
  isActive?: boolean;
};

export type UpdateSlideDTO = Partial<CreateSlideDTO>;
