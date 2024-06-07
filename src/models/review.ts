import { model, Schema, Document, Types } from 'mongoose';
import { IUser } from './user';

export interface IReview extends Document {
  userID: IUser;
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
}

// Define the schema for the Review model
const reviewSchema = new Schema<IReview>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IReview>('Review', reviewSchema);
