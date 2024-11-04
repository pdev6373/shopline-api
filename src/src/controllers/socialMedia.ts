import { SocialMedia, SocialMediaCategory } from '../models';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../middlewares/authorizeRoles';

const getSocialMedias = async (req: AuthenticatedRequest, res: Response) => {
  const socialMediaByCategory = await SocialMedia.aggregate([
    {
      $group: {
        _id: {
          name: '$name',
          description: '$description',
          icon: '$icon',
        },
        socialMedias: {
          $push: {
            _id: '$_id',
            username: '$username',
            userSocialId: '$userSocialId',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id.name',
        description: '$_id.description',
        icon: '$_id.icon',
        socialMedias: 1,
      },
    },
  ]);

  if (!socialMediaByCategory || !socialMediaByCategory.length)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'No Social media found' });

  return res.json({
    success: true,
    data: socialMediaByCategory,
  });
};

const getSocialMedia = async (req: AuthenticatedRequest, res: Response) => {
  const id: string = req.params.id;

  const socialMedia = await SocialMedia.findById(id).lean();

  if (!socialMedia)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Social media not found' });

  return res.json({
    success: true,
    data: socialMedia,
  });
};

const getSocialMediaCategories = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const socialMediaCategories = await SocialMediaCategory.find();
  return res.json({ success: true, data: socialMediaCategories });
};

const createSocialMedia = async (req: AuthenticatedRequest, res: Response) => {
  const { username, userSocialId, categoryId } = req.body;

  const existingSocialMedia = await SocialMedia.findOne({
    categoryId,
  });

  if (existingSocialMedia)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Social media already exist',
    });

  const newSocialMedia = new SocialMedia({
    username,
    userSocialId,
    userId: req.user?._id,
    categoryId,
  });

  await newSocialMedia.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: newSocialMedia,
  });
};

const updateSocialMedia = async (req: AuthenticatedRequest, res: Response) => {
  const { id, username, userSocialId, categoryId } = req.body;

  let socialMedia = await SocialMedia.findById(id);

  if (!socialMedia)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Social media not found' });

  const existingSocialMedia = await SocialMedia.findOne({
    username,
    categoryId: socialMedia.categoryId,
    _id: { $ne: id },
  });

  if (existingSocialMedia)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Social media already exist' });

  socialMedia.username = username;
  socialMedia.userSocialId = userSocialId;
  socialMedia.categoryId = categoryId;

  await socialMedia.save();

  return res.json({
    success: true,
    data: socialMedia,
  });
};

const deleteSocialMedia = async (req: AuthenticatedRequest, res: Response) => {
  const id: string = req.params.id;

  const deletedSocialMedia = await SocialMedia.findByIdAndDelete(id);

  if (!deletedSocialMedia)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Social media not found' });

  return res.json({ success: true, message: 'Social media deleted' });
};

export default {
  getSocialMedias,
  getSocialMedia,
  getSocialMediaCategories,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
