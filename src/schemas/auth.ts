import { z } from 'zod';

enum UserRoles {
  Admin = 'Admin',
  User = 'User',
  Company = 'Company',
}

enum OTPTypes {
  'Verify Account' = 'Verify Account',
  'Password Reset' = 'Password Reset',
}

const registration = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRoles).optional(),
});

const verifyEmail = z.object({
  otp: z.string(),
  email: z.string().min(8),
});

const resendVerificationCode = z.object({
  email: z.string().min(8),
  type: z.nativeEnum(OTPTypes),
});

const forgotPassword = z.object({
  email: z.string().min(8),
});

const newPassword = z.object({
  email: z.string().min(8),
  password: z.string(),
  otp: z.string(),
});

const login = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export default {
  registration,
  forgotPassword,
  verifyEmail,
  resendVerificationCode,
  newPassword,
  login,
};
