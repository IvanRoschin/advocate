export type SubscriberResponseDTO = {
  _id: string;
  email: string;
  subscribed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSubscriberDTO = {
  email: string;
  subscribed?: boolean;
};

export type UpdateSubscriberDTO = Partial<CreateSubscriberDTO>;
