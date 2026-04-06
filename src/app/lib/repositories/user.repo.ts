import { ClientSession } from 'mongoose';

import { CreateUserRequestDTO, UpdateUserDTO } from '@/app/types';
import { User } from '@/models';
import { dbConnect } from '../server/mongoose';

export const userRepo = {
  async findAll() {
    await dbConnect();

    return User.find()
      .select('_id name surname email phone role isActive createdAt')
      .lean();
  },

  async findById(id: string) {
    await dbConnect();

    return User.findById(id);
  },

  async findByEmail(email: string) {
    await dbConnect();

    return User.findOne({ email });
  },

  findByPhone(phone: string) {
    return User.findOne({ phone: phone.trim() });
  },

  async create(data: CreateUserRequestDTO, session?: ClientSession) {
    await dbConnect();

    return User.create([data], { session }).then(([doc]) => doc);
  },

  async update(id: string, data: UpdateUserDTO) {
    await dbConnect();

    return User.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    await dbConnect();

    return User.findByIdAndDelete(id);
  },
};
