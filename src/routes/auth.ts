import { Router } from 'express';
import { authController } from '@src/controllers';
import { rateLimiter, validateData } from '@src/middlewares';
import authSchema from '@src/schemas/auth';

const authRoutes = () => {
  const router = Router();

  router.post(
    '/register',
    validateData(authSchema.registration),
    authController.register,
  );
  router.post(
    '/forgot-password',
    validateData(authSchema.forgotPassword),
    authController.forgotPassword,
  );
  router.post(
    '/verify',
    validateData(authSchema.verifyEmail),
    authController.verifyEmail,
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

export default authRoutes;
