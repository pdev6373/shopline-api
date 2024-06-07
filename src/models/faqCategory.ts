import { model, Schema, Document } from 'mongoose';

export interface IFAQCategory extends Document {
  name: string;
  description: string;
}

const faqCategorySchema = new Schema<IFAQCategory>(
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
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IFAQCategory>('FAQCategory', faqCategorySchema);
