import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    pin: {
      type: String,
      trim: true,
    },
    accountDetails: {
      //   ref,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    socialMedia: {
      // ref
    },
    pushNotification: {
      // ref
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'User', 'Company'],
      default: 'User',
    },
    membership: {
      type: String,
      enum: ['Regular', 'Silver', 'Gold'],
      default: 'Regular',
    },
  },
  {
    timestamps: true,
  },
);

export default model('User', userSchema);
