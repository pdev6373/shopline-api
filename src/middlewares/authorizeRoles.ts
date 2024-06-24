import { IUser } from '@src/models/user';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

type role = 'customer' | 'caregiver' | 'admin';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: IUser;
    role: role;
  };
}

export const authorizeRoles = (...roles: role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles?.includes(req.user.role))
      return res.status(StatusCodes.FORBIDDEN).send({ error: 'Access denied' });

    return next();
  };
};
