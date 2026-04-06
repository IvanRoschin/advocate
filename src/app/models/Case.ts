import mongoose, { InferSchemaType, Types } from 'mongoose';

const { Schema } = mongoose;

export const CASE_STATUSES = [
  'new',
  'in_progress',
  'awaiting_client',
  'in_court',
  'completed',
  'archived',
] as const;

const caseSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: CASE_STATUSES,
      required: true,
      default: 'new',
      index: true,
    },
    currentStage: {
      type: String,
      default: 'Первинний аналіз',
      trim: true,
    },
    sourceLeadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
      index: true,
    },
    assignedLawyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

caseSchema.index({ clientId: 1, updatedAt: -1 });

export type CaseInput = InferSchemaType<typeof caseSchema>;

export type CaseDocument = CaseInput & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export default mongoose.models.Case ||
  mongoose.model<CaseDocument>('Case', caseSchema);
