import { model, Schema, Document, Types } from 'mongoose';
import { IUser } from './user';
import { IProduct } from './product';

export interface IDiscussion extends Document {
  userId: IUser;
  productId: IProduct;
  content: string;
  replies: Types.ObjectId[];
}

const discussionSchema = new Schema<IDiscussion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DiscussionReply',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model<IDiscussion>('Discussion', discussionSchema);
