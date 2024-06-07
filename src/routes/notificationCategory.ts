import { Router } from 'express';
import { notificationCategoryController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { notificationCategorySchema } from '@src/schemas';

export const notificationCategoryRoutes = () => {
  const router = Router();

  router.use(authorizeRoles('Admin'));

  router
    .route('/')
    .get(notificationCategoryController.getNotificationCategories)
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
