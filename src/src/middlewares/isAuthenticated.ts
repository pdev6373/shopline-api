import type { RequestHandler } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';

export const isAuthenticated: RequestHandler = (req: any, res, next): any => {
  const authHeader =
    req.headers.authorization ||
    (req.headers.Authorization as string | undefined);

  if (!authHeader?.startsWith('Bearer '))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: ReasonPhrases.UNAUTHORIZED });

  const token = authHeader.split(' ')[1];

  const decoded: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

  if (!decoded)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ success: false, message: ReasonPhrases.FORBIDDEN });

  req.user = decoded.UserInfo;
  next();
};
