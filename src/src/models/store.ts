import { model, Schema } from 'mongoose';

const storeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    shipment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      // rating
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    products: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Store', storeSchema);
