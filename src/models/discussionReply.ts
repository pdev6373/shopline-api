import { model, Schema, Document, Types } from 'mongoose';
import { IUser } from './user';
import { IDiscussion } from './discussion';

export interface IDiscussionReply extends Document {
  userId: IUser;
  discussionId: IDiscussion;
  content: string;
}

const discussionReplySchema = new Schema<IDiscussionReply>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    discussionId: {
      type: Schema.Types.ObjectId,
      ref: 'Discussion',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IDiscussionReply>(
  'DiscussionReply',
  discussionReplySchema,
);
