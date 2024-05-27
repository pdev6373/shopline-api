import { model, Schema } from 'mongoose';
import { mailContent, mailSender } from '@src/utils';

type SendVerificationEmailType = {
  email: string;
  otp: string;
  type: 'Verify Account' | 'Password Reset';
};

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Verify Account', 'Password Reset'],
      default: 'Verify Account',
    },
  },
  {
    timestamps: true,
  },
);

async function sendVerificationEmail({
  email,
  otp,
  type,
}: SendVerificationEmailType) {
  try {
    const mailResponse = await mailSender({
      to: email,
      subject: type,
      body: mailContent({
        type: type === 'Verify Account' ? 'verify-account' : 'password-reset',
        otp,
      }),
    });
    console.log('Email sent successfully: ', mailResponse);
  } catch (error) {
    console.log('Error occurred while sending email: ', error);
    throw error;
  }
}

otpSchema.pre('save', async function (next) {
  console.log('New document saved to the database');
  // Only send an email when a new document is created
  if (this.isNew)
    await sendVerificationEmail({
      email: this.email,
      otp: this.otp,
      type: this.type,
    });

  next();
});

export default model('OTP', otpSchema);
