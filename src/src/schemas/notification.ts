import { boolean, object, string } from 'zod';

const createNotification = object({
  title: string(),
  message: string(),
  categoryId: string(),
});

const markNotificationAsRead = object({
  id: string(),
});

const getNotificationsInCategoryForUser = object({
  id: string(),
});

const updateNotificationCategoryPushNotificationStatus = object({
  categoryId: string(),
  hasPushNotification: boolean(),
});

export default {
  createNotification,
  markNotificationAsRead,
  getNotificationsInCategoryForUser,
  updateNotificationCategoryPushNotificationStatus,
};
