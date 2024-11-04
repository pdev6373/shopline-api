import { Router } from 'express';
import { notificationCategoryController } from '../controllers';
import { validateData } from '../middlewares';
import { notificationCategorySchema } from '../schemas';

export const notificationCategoryRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(
      validateData(notificationCategorySchema.createNotificationCategory),
      notificationCategoryController.createNotificationCategory,
    )
    .put(
      validateData(notificationCategorySchema.updateNotificationCategory),
      notificationCategoryController.updateNotificationCategory,
    )
    .delete(
      validateData(notificationCategorySchema.deleteNotificationCategory),
      notificationCategoryController.deleteNotificationCategory,
    );

  return router;
};
