import { Schema, model, Document } from 'mongoose';
import { IProduct } from './product';
import { IUser } from './user';

export interface IWishlist extends Document {
  userId: IUser;
  products: IProduct[];
}

const wishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export default model<IWishlist>('Wishlist', wishlistSchema);
