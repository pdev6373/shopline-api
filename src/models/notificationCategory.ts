import { model, Schema, Document } from 'mongoose';

export interface INotificationCategory extends Document {
  name: string;
  description: string;
  icon: string;
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
  },
  {
    timestamps: true,
  },
);

export default model<INotificationCategory>(
  'NotificationCategory',
  notificationCategorySchema,
);
