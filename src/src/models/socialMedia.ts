import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { ISocialMediaCategory } from './socialMediaCategory';

export interface ISocialMedia extends Document {
  username: string;
  userSocialId: string;
  userId: IUser;
  categoryId: ISocialMediaCategory;
}

const socialMediaSchema = new Schema<ISocialMedia>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SocialMediaCategory',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userSocialId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ISocialMedia>('SocialMedia', socialMediaSchema);
