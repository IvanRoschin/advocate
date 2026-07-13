import bcrypt from 'bcryptjs';
import mongoose, { InferSchemaType } from 'mongoose';

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

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;

  const looksHashed =
    this.password.startsWith('$2a$') ||
    this.password.startsWith('$2b$') ||
    this.password.startsWith('$2y$');

  if (looksHashed) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password: string) {
  if (!this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

export interface UserMethods {
  comparePassword(password: string): boolean;
}

export type UserInput = InferSchemaType<typeof userSchema>;
export type UserDocument = UserInput & UserMethods;

const User =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>('User', userSchema);

export default User;
