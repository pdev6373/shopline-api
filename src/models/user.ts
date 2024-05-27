import { model, Schema } from 'mongoose';
import { sign } from 'jsonwebtoken';

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
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'User', 'Company'],
      default: 'User',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.generateVerificationToken = function () {
  const verificationToken = sign(
    { id: this._id },
    `${process.env.USER_VERIFICATION_TOKEN_SECRET}`,
    { expiresIn: '5m' },
  );
  return verificationToken;
};

export default model('User', userSchema);
