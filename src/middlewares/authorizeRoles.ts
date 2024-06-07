import { IUser } from '@src/models/user';
import { Request, Response, NextFunction } from 'express';

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
      return res.status(403).send({ error: 'Access denied' });

    return next();
  };
};
