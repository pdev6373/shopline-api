import { boolean, object, string } from 'zod';

const createNotificationCategory = object({
  name: string(),
  description: string(),
  icon: string(),
  isUserSpecific: boolean(),
});

const updateNotificationCategory = object({
  id: string(),
  name: string(),
  description: string(),
  icon: string(),
  isUserSpecific: boolean(),
});

const deleteNotificationCategory = object({
  id: string(),
});

export default {
  createNotificationCategory,
  updateNotificationCategory,
  deleteNotificationCategory,
};
