import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface INotificationCategory extends Document {
  name: string;
  description: string;
  icon: string;
  hasPushNotification: boolean;
  disabledPushNotificationUserIds: IUser[];
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
    hasPushNotification: {
      type: Boolean,
      default: false,
    },
    disabledPushNotificationUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    icon: {
      type: String,
      required: true,
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
