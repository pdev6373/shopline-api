import { model, Schema, Document } from 'mongoose';

export interface ITransactionCategory extends Document {
  name: string;
  description: string;
  icon: string;
}

const transactionCategorySchema = new Schema<ITransactionCategory>(
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

export default model<ITransactionCategory>(
  'TransactionCategory',
  transactionCategorySchema,
);
