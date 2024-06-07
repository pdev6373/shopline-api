import { model, Schema, Document } from 'mongoose';
import { IFAQCategory } from './faqCategory';

export interface IFAQ extends Document {
  categoryId: IFAQCategory;
  question: string;
  answer: string;
}

const faqSchema = new Schema<IFAQ>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'FAQCategory',
      required: true,
    },
    question: {
      type: String,
      required: true,
      unique: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IFAQ>('FAQ', faqSchema);
