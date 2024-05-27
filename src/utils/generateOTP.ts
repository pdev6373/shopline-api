import { totp } from 'speakeasy';

export const generateOTP = () => {
  const otp = totp({
    secret: 'secret_key', // Use a secure key in production
    encoding: 'base32',
  });
  return otp;
};
