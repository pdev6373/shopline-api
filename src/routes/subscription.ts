import { Router } from 'express';
import { subscriptionController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { subscriptionSchema } from '@src/schemas';

export const subscriptionRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(
      validateData(subscriptionSchema.subscription),
      subscriptionController.subscription,
    );

  return router;
};
