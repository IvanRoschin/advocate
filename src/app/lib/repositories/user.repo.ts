import { User } from '@/models';
import { IUser } from '@/models/User';

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

  create(data: Partial<IUser>) {
    return User.create(data);
  },

  update(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  delete(id: string) {
    return User.findByIdAndDelete(id);
  },
};
