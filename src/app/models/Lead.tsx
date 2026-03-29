// src/app/models/Lead.ts
import mongoose, { InferSchemaType, Types } from 'mongoose';

import { LEAD_SOURCES, LEAD_STATUSES } from '../types';

const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: true,
      default: 'home',
      index: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'new',
      index: true,
    },
    convertedToClient: {
      type: Boolean,
      default: false,
      index: true,
    },
    assignedToUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      default: null,
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

leadSchema.index({
  name: 'text',
  email: 'text',
  phone: 'text',
  message: 'text',
});

export type LeadInput = InferSchemaType<typeof leadSchema>;

export type LeadDocument = LeadInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead;
