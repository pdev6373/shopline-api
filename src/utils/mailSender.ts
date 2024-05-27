import { createTransport } from 'nodemailer';

type SendVerificationEmailType = {
  to: string;
  subject: string;
  body: string;
};

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const mailSender = async ({
  to,
  subject,
  body,
}: SendVerificationEmailType) => {
  try {
    await transporter.sendMail({
      from: '"Meetmax" <adebayoluborode@gmail.com>',
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.error('Error occurred while sending email: ', error);
  }
};
