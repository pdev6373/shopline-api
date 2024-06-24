import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

const CUSTOMER_ROLES = ['parent', 'guardian', 'others'];
const CAREGIVER_ROLES = ['sitter', 'coach', 'counselor', 'tutor', 'nanny'];

type ValidateRoleType = {
  [x: string]: any;
};

const getRole = (role: 'customer' | 'caregiver') =>
  role === 'customer' ? CUSTOMER_ROLES : CAREGIVER_ROLES;

const isRoleValid = (data: ValidateRoleType) => {
  const role = getRole(data.role);
  return data.subRoles.every((subRole: string) => role.includes(subRole));
};

export function validateSignupData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req.body);

      if (!isRoleValid(parsedData))
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: [
            {
              path: ['subRoles'],
              message: `Invalid subRoles for the selected role, subroles should be at least one of ${getRole(parsedData.role).toString()}`,
            },
          ],
        });

      req.body = parsedData;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Invalid data', details: errorMessages });
      } else
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' });
    }
  };
}
