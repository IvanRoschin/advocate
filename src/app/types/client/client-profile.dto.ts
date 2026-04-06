export type ClientProfileDto = {
  id: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive';
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
};

export type UpdateClientProfileDto = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  type: 'individual' | 'company';
};
