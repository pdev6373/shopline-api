import { Router } from 'express';
import { notificationController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { notificationSchema } from '@src/schemas';

export const notificationRoutes = () => {
  const router = Router();

  router.post(
    '/',
    authorizeRoles('Admin'),
    validateData(notificationSchema.createNotification),
    notificationController.createNotification,
  );

  router.use(authorizeRoles('User', 'Store'));

  router.get('/', notificationController.getNotificationOverview);
  router.get('/categories', notificationController.getNotificationCategories);
  router.get(
    '/:categoryId',
    validateData(notificationSchema.getNotificationsInCategoryForUser),
    notificationController.getNotificationsInCategoryForUser,
  );
  router.put(
    '/mark-all-as-read',
    notificationController.markAllUnreadNotificationsInACategoryAsRead,
  );
  router.put(
    '/status',
    validateData(
      notificationSchema.updateNotificationCategoryPushNotificationStatus,
    ),
    notificationController.updateNotificationCategoryPushNotificationStatus,
  );

  return router;
};
