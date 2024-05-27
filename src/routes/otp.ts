import { Router } from 'express';
import { otpController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { otpSchema } from '@src/schemas';

const otpRoutes = () => {
  const router = Router();

  router.post(
    '/send-otp',
    validateData(otpSchema.sendOTP),
    otpController.sendOTP,
  );

  return router;
};

export default otpRoutes;
