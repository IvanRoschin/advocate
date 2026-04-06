import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

export const CLIENT_ACCESS_ROLES = ['owner', 'manager', 'viewer'] as const;

const clientAccessSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    accessRole: {
      type: String,
      enum: CLIENT_ACCESS_ROLES,
      required: true,
      default: 'owner',
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

clientAccessSchema.index({ userId: 1, clientId: 1 }, { unique: true });

export type ClientAccessInput = InferSchemaType<typeof clientAccessSchema>;

export type ClientAccessDocument = ClientAccessInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export default mongoose.models.ClientAccess ||
  mongoose.model<ClientAccessDocument>('ClientAccess', clientAccessSchema);
