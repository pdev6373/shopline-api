import { model, Schema, Document, Types } from 'mongoose';

export interface IBankAccount extends Document {
  userId: Types.ObjectId;
  cardNumber: string;
  cardHolderName: string;
  expirationDate: Date;
  cvv: string;
  bankName: string;
}

const bankAccountSchema = new Schema<IBankAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    cardHolderName: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IBankAccount>('BankAccount', bankAccountSchema);
