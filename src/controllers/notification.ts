import { AuthenticatedRequest } from '@src/middlewares/authorizeRoles';
import { Notification, NotificationCategory } from '@src/models';
import { INotification } from '@src/models/notification';
import { INotificationCategory } from '@src/models/notificationCategory';
import { IUser } from '@src/models/user';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

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
      .status(404)
      .json({ success: false, message: 'Notification category not found' });

  const notification: INotification = new Notification({
    title,
    message,
    categoryId: category._id,
    userId: category.isUserSpecific ? req.user?._id : undefined,
  });

  await notification.save();

  category.notificationIds.push(notification);
  category.unreadNotificationIds.push(notification);

  await category.save();

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
  const id = req.user?._id;

  const categories = await NotificationCategory.find({
    $or: [{ isUserSpecific: false }, { isUserSpecific: true, userId: id }],
  }).populate('notifications unreadNotifications');

  const overview: INotificationOverview[] = await Promise.all(
    categories.map(async (category: INotificationCategory) => {
      const lastNotification = await Notification.findOne({
        category: category._id,
      }).sort({ createdAt: -1 });

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
        unreadCount: category.unreadNotificationIds.length,
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
  const userId = req.user?._id;

  if (!userId)
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: ReasonPhrases.FORBIDDEN,
    });

  const category = await NotificationCategory.findById(id);

  if (!category)
    return res
      .status(404)
      .json({ success: false, message: 'Notification category not found' });

  const notifications = await Notification.find({
    categoryId: id,
    $or: [{ user: userId }, { user: null }],
  });

  return res.json({ success: true, data: notifications });
};

const markNotificationAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;

  const notification: INotification | null = await Notification.findById(id);

  if (!notification)
    return res
      .status(404)
      .json({ success: false, message: 'Notification not found' });

  if (
    notification.userId &&
    notification.userId.toString() !== req.user!._id.toString()
  )
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'You do not have permission to mark this notification as read',
    });

  notification.isRead = true;
  await notification.save();

  await NotificationCategory.updateOne(
    { _id: notification.categoryId },
    { $pull: { unreadNotifications: notification._id } },
  );

  return res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
};

const markAllUserUnreadNotificationsAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.user?._id;

  if (!id)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: ReasonPhrases.UNAUTHORIZED });

  const unreadNotifications = await Notification.find({
    userId: id,
    isRead: false,
  });

  await Promise.all(
    unreadNotifications.map(async (notification) => {
      notification.isRead = true;
      await notification.save();

      await NotificationCategory.updateOne(
        { _id: notification.categoryId },
        { $pull: { unreadNotificationIds: notification._id } },
      );
    }),
  );

  return res.json({
    success: true,
    message: 'All unread notifications marked as read',
  });
};

export default {
  createNotification,
  getNotificationOverview,
  markNotificationAsRead,
  markAllUserUnreadNotificationsAsRead,
  getNotificationsInCategoryForUser,
};
