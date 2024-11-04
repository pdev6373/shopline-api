import { model, Schema, Document } from 'mongoose';

export interface IPrivacyPolicy extends Document {
  content: string;
  version: string;
}

const privacyPolicySchema = new Schema<IPrivacyPolicy>(
  {
    content: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IPrivacyPolicy>('PrivacyPolicy', privacyPolicySchema);
