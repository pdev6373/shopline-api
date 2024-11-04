import { Schema, model, Document } from 'mongoose';
import { IUser } from './user';

export interface IChat extends Document {
  userIds: IUser[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadMessagesCount: number;
  archivedBy: IUser[];
}

const chatSchema = new Schema<IChat>({
  userIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  archivedBy: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now },
  unreadMessagesCount: { type: Number, default: 0 },
});

export default model<IChat>('Chat', chatSchema);
