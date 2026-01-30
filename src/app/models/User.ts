import bcrypt from 'bcryptjs';
import mongoose, { InferSchemaType, Types } from 'mongoose';

export interface IUserMethods {
  setPassword(password: string): void;
  comparePassword(password: string): boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  GUEST = 'guest',
}

export interface IUser {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  token?: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  googleId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: false },
  password: { type: String },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CLIENT,
  },
  googleId: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, default: false },
});

userSchema.methods.setPassword = function (password: string) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password: string) {
  if (!this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

export type UserInput = InferSchemaType<typeof userSchema>;

export type UserDocument = UserInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export default mongoose.models.User ||
  mongoose.model<UserDocument>('User', userSchema);
