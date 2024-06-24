import { Router } from 'express';
import { authController } from '@src/controllers';
import {
  rateLimiter,
  validateAuthData,
  validateData,
  validateSignupData,
} from '@src/middlewares';
import { authSchema } from '@src/schemas';

export const authRoutes = () => {
  const router = Router();

  router.post(
    '/register',
    validateSignupData(authSchema.register),
    authController.register,
  );

  router.post(
    '/verify',
    validateData(authSchema.verify),
    authController.verify,
  );

  router.post(
    '/resend-otp',
    validateData(authSchema.resendOTP),
    rateLimiter({
      type: 'otp',
    }),
    authController.resendOTP,
  );

  router.post(
    '/forgot-password',
    validateAuthData(authSchema.forgotPassword),
    authController.forgotPassword,
  );

  router.patch(
    '/new-password',
    validateData(authSchema.newPassword),
    authController.newPassword,
  );

  router.post(
    '/login',
    validateAuthData(authSchema.login),
    rateLimiter({
      type: 'login',
    }),
    authController.login,
  );

  router.get('/refresh', authController.refresh);
  router.get('/logout', authController.logout);

  return router;
};
