import { model, Schema, Document } from 'mongoose';

export interface ISocialMediaCategory extends Document {
  name: string;
  icon: string;
  description: string;
}

const socialMediaCategorySchema = new Schema<ISocialMediaCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ISocialMediaCategory>(
  'SocialMediaCategory',
  socialMediaCategorySchema,
);
