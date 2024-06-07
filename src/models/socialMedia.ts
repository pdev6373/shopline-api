import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface ISocialMedia extends Document {
  platform: string;
  username: string;
  userSocialId: string;
  userId: IUser;
}

const socialMediaSchema = new Schema<ISocialMedia>(
  {
    platform: {
      type: String,
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ISocialMedia>('SocialMedia', socialMediaSchema);
