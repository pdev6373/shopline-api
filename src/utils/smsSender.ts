import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

type SmsSenderType = {
  phone: string;
  message: string;
};

const client = twilio(accountSid, authToken);

export const smsSender = async ({ phone, message }: SmsSenderType) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return true;
  } catch (error) {
    console.error('Error occurred while sending otp: ', error);
    return false;
  }
};
