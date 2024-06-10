import { PrivacyPolicy } from '@src/models';
import { IPrivacyPolicy } from '@src/models/privacyPolicy';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// GET PRIVACY POLICY
export const getPrivacyPolicy = async (req: Request, res: Response) => {
  const privacyPolicy: IPrivacyPolicy | null =
    await PrivacyPolicy.findOne().sort({ createdAt: -1 });

  if (!privacyPolicy)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Privacy policy not found' });

  return res.json({ success: true, data: privacyPolicy });
};

// CREATE PRIVACY POLICY
const createPrivacyPolicy = async (req: Request, res: Response) => {
  const { content, version } = req.body;

  const newPrivacyPolicy: IPrivacyPolicy = new PrivacyPolicy({
    content,
    version,
  });

  await newPrivacyPolicy.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    privacyPolicy: newPrivacyPolicy,
  });
};

// UPDATE PRIVACY POLICY
const updatePrivacyPolicy = async (req: Request, res: Response) => {
  const { content, version } = req.body;

  const privacyPolicy: IPrivacyPolicy | null =
    await PrivacyPolicy.findOne().sort({ createdAt: -1 });

  if (!privacyPolicy)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Privacy policy not found' });

  privacyPolicy.content = content;
  privacyPolicy.version = version;

  await privacyPolicy.save();

  return res.json({
    success: true,
    data: privacyPolicy,
  });
};

// DELETE PRIVACY POLICY
const deletePrivacyPolicy = async (req: Request, res: Response) => {
  const privacyPolicy: IPrivacyPolicy | null =
    await PrivacyPolicy.findOne().sort({ createdAt: -1 });

  if (!privacyPolicy)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Privacy policy not found' });

  await PrivacyPolicy.findByIdAndDelete(privacyPolicy._id);

  return res.json({
    success: true,
    message: 'Privacy policy deleted',
  });
};

export default {
  getPrivacyPolicy,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
