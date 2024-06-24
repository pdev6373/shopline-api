import { model, Schema } from 'mongoose';
import { mailContent, mailSender, smsSender } from '@src/utils';
import { IUser } from './user';

type SendVerificationEmailType = {
  email: string;
  phone: string;
  otp: string;
  type: 'verify-account' | 'reset-password';
};

export interface IOtp extends Document {
  userId: IUser;
  otp: string;
  type: 'verify-account' | 'reset-password';
}

const otpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otp: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['verify-account', 'reset-password'],
      default: 'verify-account',
    },
  },
  {
    timestamps: true,
  },
);

export async function sendVerificationOTP({
  email,
  phone,
  otp,
  type,
}: SendVerificationEmailType) {
  return mailSender({
    to: email,
    subject: type,
    body: mailContent({ type, otp }),
  }).then((isMailSent) => {
    if (!isMailSent) return { isMailSent, isSmsSent: false };
    return smsSender({
      message: otp,
      phone,
    }).then((isSmsSent) => {
      return { isMailSent, isSmsSent };
    });
  });
}

export default model<IOtp>('OTP', otpSchema);
