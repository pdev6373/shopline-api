import { IUser } from '../models/user';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

type role = 'User' | 'Store' | 'Admin';

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
