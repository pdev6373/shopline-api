import { object, string } from 'zod';

const createNotificationCategory = object({
  name: string(),
  description: string(),
  icon: string(),
});

const updateNotificationCategory = object({
  id: string(),
  name: string(),
  description: string(),
  icon: string(),
});

const deleteNotificationCategory = object({
  id: string(),
});

export default {
  createNotificationCategory,
  updateNotificationCategory,
  deleteNotificationCategory,
};
