import { Router } from 'express';
import { contactController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { contactSchema } from '@src/schemas';

export const contactRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(validateData(contactSchema.contact), contactController.contact);

  return router;
};
