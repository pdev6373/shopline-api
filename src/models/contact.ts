import { Schema, model, Document } from 'mongoose';

interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  comments: string;
}

const contactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    comments: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default model<IContact>('Contact', contactSchema);
