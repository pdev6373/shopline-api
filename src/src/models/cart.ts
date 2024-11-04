import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IProduct } from './product';

export interface ICart extends Document {
  userId: IUser;
  storeName: string;
  productIds: IProduct[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model<ICart>('Cart', cartSchema);
