import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

const leadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: { type: String, enum: ['new', 'processed'], default: 'new' },
  convertedToClient: { type: Boolean, default: false },
});

leadSchema.index({ '$**': 'text' });

export type LeadInput = InferSchemaType<typeof leadSchema>;

export type LeadDocument = LeadInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
