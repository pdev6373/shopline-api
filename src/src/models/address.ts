import { Document, model, Schema } from 'mongoose';
import { IUser } from './user';

export interface IAddress extends Document {
  userId: IUser;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  country: string;
  latitude: number;
  longitude: number;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IAddress>('Address', addressSchema);
