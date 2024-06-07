import { Router } from 'express';
import { authController } from '@src/controllers';
import { rateLimiter, validateData } from '@src/middlewares';
import { authSchema } from '@src/schemas';
import { StatusCodes } from 'http-status-codes';

export const authRoutes = () => {
  const router = Router();

  router.post(
    '/register',
    (req, res, next) => {
      const accountType: string = req.body.type;

      let schema;

      if (accountType === 'User') schema = authSchema.userRegistration;
      else if (accountType === 'Store') schema = authSchema.storeRegistration;
      else
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Invalid account type' });

      return validateData(schema)(req, res, next);
    },
    authController.register,
  );

  router.post(
    '/verify',
    validateData(authSchema.verifyEmail),
    authController.verifyEmail,
  );

  router.post(
    '/resend-verification-code',
    validateData(authSchema.resendVerificationCode),
    authController.resendVerificationCode,
  );

  router.post(
    '/forgot-password',
    validateData(authSchema.forgotPassword),
    authController.forgotPassword,
  );

  router.patch(
    '/new-password',
    validateData(authSchema.newPassword),
    authController.newPassword,
  );

  router.post(
    '/login',
    rateLimiter,
    validateData(authSchema.login),
    authController.login,
  );

  router.get('/refresh', authController.refresh);

  router.get('/logout', authController.logout);

  return router;
};
