import type { RequestHandler } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { VerifyErrors, verify } from 'jsonwebtoken';

export const verifyJWT: RequestHandler = (req: any, res, next): any => {
  const authHeader =
    req.headers.authorization ||
    (req.headers.Authorization as string | undefined);

  if (!authHeader?.startsWith('Bearer '))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: ReasonPhrases.UNAUTHORIZED });

  const token = authHeader.split(' ')[1];

  verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err: VerifyErrors | null, decoded: any): any => {
      if (err)
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ success: false, message: ReasonPhrases.FORBIDDEN });
      req.email = decoded.UserInfo.email;
      next();
    },
  );
};
