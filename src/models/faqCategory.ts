import { model, Schema, Document } from 'mongoose';

export interface IFAQCategory extends Document {
  categoryName: string;
  categoryDescription: string;
}

const faqCategorySchema = new Schema<IFAQCategory>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categoryDescription: {
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
