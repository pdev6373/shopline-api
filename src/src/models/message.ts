import { Schema, model, Document } from 'mongoose';
import { IChat } from './chat';
import { IUser } from './user';
import { IProduct } from './product';

export interface IMessage extends Document {
  chatId: IChat;
  senderId: IUser;
  content: string;
  sentAt: Date;
  isRead: boolean;
  type: 'Text' | 'Emoji' | 'File' | 'Product';
  productId: IProduct;
}

const messageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['text', 'emoji', 'file', 'product'],
    required: true,
  },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
});

export default model<IMessage>('Message', messageSchema);
