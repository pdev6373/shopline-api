import { INotification } from '@src/models/notification';
import { IUser } from '@src/models/user';
import { model, Schema, Document } from 'mongoose';

export interface INotificationCategory extends Document {
  name: string;
  description: string;
  icon: string;
  notificationIds: INotification[];
  unreadNotificationIds: INotification[];
  isUserSpecific: boolean;
  userId?: IUser;
}

const notificationCategorySchema = new Schema<INotificationCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    notificationIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    unreadNotificationIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    isUserSpecific: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default model<INotificationCategory>(
  'NotificationCategory',
  notificationCategorySchema,
);
