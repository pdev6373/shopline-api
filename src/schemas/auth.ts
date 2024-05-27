import { z } from 'zod';

enum UserRoles {
  Admin = 'Admin',
  User = 'User',
  Company = 'Company',
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

const forgotPassword = z.object({
  type: z.string(),
  email: z.string().min(8),
  phoneNumber: z.string(),
});

const resendVerificationCode = z.object({
  otp: z.string(),
  email: z.string().min(8),
});

const newPassword = z.object({
  password: z.string(),
  email: z.string().min(8),
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
