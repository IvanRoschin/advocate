import { CreateUserRequestDTO, UpdateUserDTO } from '@/app/types';
import { User } from '@/models';

export const userRepo = {
  findAll() {
    return User.find()
      .select('_id name surname email phone role isActive createdAt')
      .lean();
  },

  findById(id: string) {
    return User.findById(id);
  },

  findByEmail(email: string) {
    return User.findOne({ email });
  },

  create(data: CreateUserRequestDTO) {
    return User.create(data);
  },

  update(id: string, data: UpdateUserDTO) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  delete(id: string) {
    return User.findByIdAndDelete(id);
  },
};
