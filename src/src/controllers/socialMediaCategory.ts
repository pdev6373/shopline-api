import { SocialMedia, SocialMediaCategory } from '../models';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const createSocialMediaCategory = async (req: Request, res: Response) => {
  const { name, description, icon } = req.body;

  const existingCategory = await SocialMediaCategory.findOne({
    name,
  });

  if (existingCategory)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Social media category with this name already exists',
    });

  const newCategory = new SocialMediaCategory({
    name,
    description,
    icon,
  });

  await newCategory.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Social media category created',
    data: newCategory,
  });
};

const updateSocialMediaCategory = async (req: Request, res: Response) => {
  const { id, name, description, icon } = req.body;

  const category = await SocialMediaCategory.findById(id);

  if (!category)
    return res
      .status(404)
      .json({ success: false, message: 'Social media category not found' });

  const existingCategory = await SocialMediaCategory.findOne({
    name,
    _id: { $ne: id },
  });

  if (existingCategory)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Category Name already taken' });

  category.name = name;
  category.description = description;
  category.icon = icon;

  await category.save();

  return res.json({ success: true, data: category });
};

const deleteSocialMediaCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await SocialMediaCategory.findById(id);

  if (!category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Social media category not found' });
  }

  await SocialMedia.deleteMany({ categoryId: id });
  await SocialMediaCategory.deleteOne({ _id: id });

  return res.json({
    success: true,
    message: 'Social media category and associated social medias deleted',
  });
};

export default {
  createSocialMediaCategory,
  updateSocialMediaCategory,
  deleteSocialMediaCategory,
};
