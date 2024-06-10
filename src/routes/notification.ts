import { Router } from 'express';
import { notificationController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { notificationSchema } from '@src/schemas';

const notificationRoutes = () => {
  const router = Router();

  router.post(
    '/',
    authorizeRoles('Admin'),
    validateData(notificationSchema.createNotification),
    notificationController.createNotification,
  );

  router.use(authorizeRoles('User', 'Store'));

  router.get('/', notificationController.getNotificationOverview);
  router.get(
    '/:categoryId',
    validateData(notificationSchema.getNotificationsInCategoryForUser),
    notificationController.getNotificationsInCategoryForUser,
  );
  router.put(
    '/mark-all-as-read',
    notificationController.markAllUnreadNotificationsInACategoryAsRead,
  );

  return router;
};

export default notificationRoutes;
