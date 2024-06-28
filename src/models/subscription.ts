import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  subscribed: boolean;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    email: { type: String, required: true, unique: true },
    subscribed: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

export default model<ISubscription>('Subscription', subscriptionSchema);
