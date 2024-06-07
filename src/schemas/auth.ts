import { object, string, nativeEnum } from 'zod';

enum OTPTypes {
  'Verify Account' = 'Verify Account',
  'Password Reset' = 'Password Reset',
}

enum AccountTypes {
  User = 'User',
  Store = 'Store',
}

const userRegistration = object({
  firstname: string(),
  lastname: string(),
  email: string().email(),
  password: string().min(8),
});

const storeRegistration = object({
  name: string(),
  logo: string(),
  email: string().email(),
  password: string().min(8),
  category: string(),
});

const verifyEmail = object({
  otp: string(),
  email: string().min(8),
  type: nativeEnum(AccountTypes),
});

const resendVerificationCode = object({
  email: string().min(8),
  otpType: nativeEnum(OTPTypes),
  type: nativeEnum(AccountTypes),
});

const forgotPassword = object({
  email: string().min(8),
  type: nativeEnum(AccountTypes),
});

const newPassword = object({
  email: string().min(8),
  password: string(),
  otp: string(),
  type: nativeEnum(AccountTypes),
});

const login = object({
  email: string(),
  password: string().min(8),
  type: nativeEnum(AccountTypes),
});

export default {
  userRegistration,
  storeRegistration,
  forgotPassword,
  verifyEmail,
  resendVerificationCode,
  newPassword,
  login,
};
