import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose';

const { Schema, models, model } = mongoose;

const slideSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    src: {
      type: [String],
      required: true,
      validate: [
        (arr: string[]) => Array.isArray(arr) && arr.length > 0,
        'Щонайменше одне зображення обовʼязкове',
      ],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

slideSchema.index({ '$**': 'text' });

export type SlideEntity = InferSchemaType<typeof slideSchema>;
export type SlideDocument = HydratedDocument<SlideEntity>;
export type SlideModel = Model<SlideEntity>;

const Slide =
  (models.Slide as SlideModel | undefined) ||
  model<SlideEntity>('Slide', slideSchema);

export default Slide;
