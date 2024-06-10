import { AuthenticatedRequest } from '@src/middlewares/authorizeRoles';
import { Notification, NotificationCategory } from '@src/models';
import { INotification } from '@src/models/notification';
import { INotificationCategory } from '@src/models/notificationCategory';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface INotificationOverview {
  name: string;
  description?: string;
  icon?: string;
  lastNotification: {
    title: string;
    message: string;
    createdAt: Date;
  } | null;
  unreadCount: number;
}

const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  const { title, message, categoryId } = req.body;

  const category = await NotificationCategory.findById(categoryId);

  if (!category)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Notification category not found' });

  const notification: INotification = new Notification({
    title,
    message,
    categoryId: category._id,
    userId: req.user?._id,
  });

  await notification.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Notification created',
    data: notification,
  });
};

const getNotificationOverview = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const categories = await NotificationCategory.find();

  const overview: INotificationOverview[] = await Promise.all(
    categories.map(async (category: INotificationCategory) => {
      const lastNotification = await Notification.findOne({
        category: category._id,
      }).sort({ createdAt: -1 });

      const unReadNotifications = await Notification.find({
        category: category._id,
        isRead: false,
      }).lean();

      return {
        name: category.name,
        description: category.description,
        icon: category.icon,
        lastNotification: lastNotification
          ? {
              title: lastNotification.title,
              message: lastNotification.message,
              createdAt: lastNotification.createdAt,
            }
          : null,
        unreadCount: unReadNotifications?.length,
      };
    }),
  );

  return res.json({ success: true, data: overview });
};

const getNotificationsInCategoryForUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.params.id;

  const category = await NotificationCategory.findById(id);

  if (!category)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Notification category not found' });

  const updatedNotifications = await Notification.updateMany(
    { categoryId: id, userId: req.user?._id, isRead: false },
    { $set: { isRead: true } },
    { new: true },
  );

  return res.json({ success: true, data: updatedNotifications });
};

const markAllUnreadNotificationsInACategoryAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.params.id;

  await Notification.updateMany(
    { categoryId: id, userId: req.user?._id, isRead: false },
    { $set: { isRead: true } },
    { new: true },
  );

  return res.json({
    success: true,
    message: 'All unread notifications marked as read',
  });
};

export default {
  createNotification,
  getNotificationOverview,
  markAllUnreadNotificationsInACategoryAsRead,
  getNotificationsInCategoryForUser,
};
