import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { ITransactionCategory } from './transactionCategory';

export interface ITransaction extends Document {
  userId: IUser;
  categoryId: ITransactionCategory;
  amount: number;
  transactionType: 'Debit' | 'Credit';
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
  isRead: boolean;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'TransactionCategory',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['Debit', 'Credit'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
      required: true,
    },
    description: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ITransaction>('Transaction', transactionSchema);
