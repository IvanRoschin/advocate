import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';

import { TokenType } from '@/app/types';

export interface TokenDB {
  userId: Types.ObjectId;
  email?: string;
  token: string;
  type: TokenType;
  used: boolean;
  expiresAt?: Date;
  meta?: Record<string, unknown>;
}

const TokenSchema = new Schema<TokenDB>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: { type: String },
    token: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(TokenType),
      required: true,
      default: TokenType.REFRESH,
    },
    used: { type: Boolean, default: false },
    expiresAt: { type: Date },
    meta: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
  },
  { timestamps: true, autoIndex: false }
);

export type TokenDocument = HydratedDocument<TokenDB>;

export default mongoose.models.Token ||
  mongoose.model<TokenDB>('Token', TokenSchema);
