import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

enum OTPTypes {
  'Verify Account' = 'Verify Account',
  'Password Reset' = 'Password Reset',
}

const sendOTP = z.object({
  email: z.string().email(),
  type: z.nativeEnum(OTPTypes),
});

export const validateOTPRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    sendOTP.parse({ email }); // Validate the request body against the schema
    next(); // If validation succeeds, proceed to the next middleware
  } catch (error) {
    // If validation fails, send an error response
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Email validation failed' });
  }
};
