import { Router } from 'express';
import { userController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { userSchema } from '@src/schemas';

export const userRoutes = () => {
  const router = Router();

  router
    .route('/')
    .patch(validateData(userSchema.update), userController.update);

  return router;
};
