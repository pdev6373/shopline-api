import { Notification, NotificationCategory } from '@src/models';
import { INotificationCategory } from '@src/models/notificationCategory';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getNotificationCategories = async (req: Request, res: Response) => {
  const categories = await NotificationCategory.find();
  res.json({ success: true, data: categories });
};

const createNotificationCategory = async (req: Request, res: Response) => {
  const { name, description, icon, isUserSpecific } = req.body;

  const existingCategory = await NotificationCategory.findOne({
    name,
  });

  if (existingCategory)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Notification category with this name already exists',
    });

  const newCategory: INotificationCategory = new NotificationCategory({
    name,
    description,
    icon,
    isUserSpecific,
  });

  await newCategory.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Notification category created',
    data: newCategory,
  });
};

const updateNotificationCategory = async (req: Request, res: Response) => {
  const { id, name, description, icon, isUserSpecific } = req.body;

  const category = await NotificationCategory.findById(id);

  if (!category)
    return res
      .status(404)
      .json({ success: false, message: 'Notification category not found' });

  category.name = name;
  category.description = description;
  category.icon = icon;
  category.isUserSpecific = isUserSpecific;

  await category.save();

  return res.json({ success: true, data: category });
};

const deleteNotificationCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await NotificationCategory.findById(id);

  if (!category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Notification category not found' });
  }

  await Notification.deleteMany({ categoryId: id });

  await NotificationCategory.deleteOne({ _id: id });

  return res.json({
    success: true,
    message: 'Notification category and associated notifications deleted',
  });
};

export default {
  getNotificationCategories,
  createNotificationCategory,
  updateNotificationCategory,
  deleteNotificationCategory,
};