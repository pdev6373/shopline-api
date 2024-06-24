import { z } from 'zod';

enum OTPTypes {
  'verify-account' = 'verify-account',
  'reset-password' = 'reset-password',
}

const register = z.object({
  role: z.enum(['customer', 'caregiver', 'admin']),
  subRoles: z.array(z.string()).nonempty(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^\+[1-9]{1}[0-9]{3,14}$/),
  password: z.string().min(6),
  ageGroup: z.string(),
  organizationName: z.string(),
  address: z.string(),
  city: z.string(),
  zipcode: z.string(),
  country: z.string(),
});

const verify = z.object({
  otp: z.string(),
  id: z.string(),
});

const resendOTP = z.object({
  id: z.string(),
  type: z.nativeEnum(OTPTypes),
});

const forgotPassword = z.object({
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]{1}[0-9]{3,14}$/)
    .optional(),
});

const newPassword = z.object({
  id: z.string(),
  password: z.string().min(6),
  otp: z.string(),
});

const login = z.object({
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]{1}[0-9]{3,14}$/)
    .optional(),
  password: z.string().min(6),
});

export default {
  register,
  verify,
  resendOTP,
  forgotPassword,
  login,
  newPassword,
};

export type RegisterInput = z.infer<typeof register>;
export type VerifyInput = z.infer<typeof verify>;
export type ResendOTPInput = z.infer<typeof resendOTP>;
export type ForgotPasswordInput = z.infer<typeof forgotPassword>;
export type NewPasswordInput = z.infer<typeof newPassword>;
export type LoginInput = z.infer<typeof login>;
