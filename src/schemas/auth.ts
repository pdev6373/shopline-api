import { z } from 'zod';

const registration = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const forgotPassword = z.object({
  type: z.string(),
  email: z.string().min(8),
  phoneNumber: z.string(),
});

const verifyEmail = z.object({
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
  newPassword,
  login,
};
