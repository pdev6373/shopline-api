import { model, Schema, Document } from 'mongoose';
import { INotificationCategory } from './notificationCategory';
import { IUser } from './user';

export interface INotification extends Document {
  title: string;
  message: string;
  categoryId: INotificationCategory;
  isRead: boolean;
  userId?: IUser;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'NotificationCategory',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<INotification>('Notification', notificationSchema);
