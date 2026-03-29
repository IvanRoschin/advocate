import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

export const CLIENT_TYPES = ['individual', 'company'] as const;
export const CLIENT_STATUSES = ['active', 'inactive'] as const;

const clientSchema = new Schema(
  {
    type: {
      type: String,
      enum: CLIENT_TYPES,
      required: true,
      default: 'individual',
      index: true,
    },
    status: {
      type: String,
      enum: CLIENT_STATUSES,
      required: true,
      default: 'active',
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    taxId: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },

    sourceLeadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

clientSchema.index({
  fullName: 'text',
  email: 'text',
  phone: 'text',
  companyName: 'text',
  taxId: 'text',
  notes: 'text',
});

export type ClientInput = InferSchemaType<typeof clientSchema>;

export type ClientDocument = ClientInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client;
