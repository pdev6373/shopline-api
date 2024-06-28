import { Request, Response } from 'express';
import { Subscription } from '../models';
import { SubscriptionInput } from '@src/schemas';
import { StatusCodes } from 'http-status-codes';
import { ISubscription } from '@src/models/subscription';

const subscription = async (req: Request, res: Response) => {
  const userData: SubscriptionInput = req.body;

  const subscription: ISubscription | null = await Subscription.findOne({
    email: userData.email,
  });

  if (userData.type === 'unsubscribe') {
    if (!subscription || !subscription.subscribed)
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User isn't subscribed",
      });

    subscription.subscribed = false;
    await subscription.save();

    return res.json({
      success: true,
      message: 'User unsubscribed successfully',
    });
  }

  if (subscription)
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: 'User already subcribed',
    });

  await Subscription.create(req.body);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User subscribed successfully',
  });
};

export default {
  subscription,
};
