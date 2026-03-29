import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { UserRole } from '@/types';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ADMIN,
    },
    googleId: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password: string) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password: string) {
  if (!this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
