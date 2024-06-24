import { OTP, User } from '@src/models';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { compare, hash } from 'bcrypt';
import { generate } from 'otp-generator';
import { sign, verify as verifyToken } from 'jsonwebtoken';
import { sendVerificationOTP } from '@src/models/otp';
import {
  ForgotPasswordInput,
  LoginInput,
  NewPasswordInput,
  RegisterInput,
  ResendOTPInput,
  VerifyInput,
} from '@src/schemas';
import { IUser } from '@src/models/user';

type GenerateOTPType = {
  user: IUser;
  type: 'reset-password' | 'verify-account';
};

const otpOptions = {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
};

const generateOTP = async ({
  user,
  type = 'verify-account',
}: GenerateOTPType) => {
  let otp = generate(6, otpOptions);
  let result = await OTP.findOne({ otp });

  while (result?.userId === user) {
    otp = generate(6, otpOptions);
    result = await OTP.findOne({ otp });
  }

  const hashedOTP = await hash(otp, Number(process.env.SALT));

  await OTP.deleteMany({ userId: user });
  await OTP.create({
    userId: user,
    type,
    otp: hashedOTP,
  });

  const response = await sendVerificationOTP({
    email: user.email,
    phone: user.phone,
    otp,
    type,
  });

  return response;
};

const register = async (req: Request, res: Response) => {
  let userData: RegisterInput = req.body;

  let user = await User.findOne({
    $or: [{ email: userData.email }, { phone: userData.phone }],
  }).exec();

  if (user) {
    if (user.isEmailOrPhoneVerified)
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `${`${userData.role[0].toUpperCase()}${userData.role.slice(1)}`} already exist`,
      });

    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.phone = userData.phone;
    user.ageGroup = userData.ageGroup;
    user.organizationName = userData.organizationName;
    user.role = userData.role;
    user.subRoles = userData.subRoles;
    user.address = userData.address;
    user.city = userData.city;
    user.country = userData.country;
    user.zipcode = userData.zipcode;
    user.password = await hash(userData.password, Number(process.env.SALT));

    await user.save();

    const { isMailSent, isSmsSent } = await generateOTP({
      user,
      type: 'verify-account',
    });

    return res.json({
      success: true,
      message:
        isMailSent && isSmsSent
          ? `OTP successfully sent to  your email: ${userData.email} and phone: ${userData.phone}`
          : isMailSent
            ? `OTP successfully sent sent to  your email: ${userData.email}`
            : `OTP successfully sent sent to  your phone: ${userData.phone}`,
    });
  }

  const hashedPassword = await hash(
    userData.password,
    Number(process.env.SALT),
  );

  const createdUser = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  const { isMailSent, isSmsSent } = await generateOTP({
    user: createdUser,
    type: 'verify-account',
  });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message:
      isMailSent && isSmsSent
        ? `A verification code was sent to  your email: ${userData.email} and phone: ${userData.phone}`
        : isMailSent
          ? `OTP successfully sent to  your email: ${userData.email}`
          : `OTP successfully sent to  your phone: ${userData.phone}`,
  });
};

const verify = async (req: Request, res: Response) => {
  const userData: VerifyInput = req.body;

  const user = await User.findById(userData.id).exec();

  if (!user)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'User does not exist',
    });

  if (user.isEmailOrPhoneVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account already verified' });

  const foundOTP = await OTP.find({ userId: userData.id })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!foundOTP.length)
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'OTP does not exist',
    });

  if (foundOTP[0].type !== 'verify-account')
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid OTP',
    });

  const OTPMatch = await compare(userData.otp, foundOTP[0].otp);

  if (!OTPMatch)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid OTP',
    });

  user.isEmailOrPhoneVerified = true;

  await user.save();
  await OTP.deleteMany({ userId: userData.id });

  return res.json({
    success: true,
    message: 'Account verified successfully',
  });
};

const resendOTP = async (req: Request, res: Response) => {
  const userData: ResendOTPInput = req.body;

  const user = await User.findById(userData.id).exec();

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (userData.type === 'verify-account' && user.isEmailOrPhoneVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account already verified' });

  const { isMailSent, isSmsSent } = await generateOTP({
    user,
    type: userData.type,
  });

  return res.json({
    success: true,
    message:
      isMailSent && isSmsSent
        ? `OTP successfully resent to  your email: ${user.email} and phone: ${user.phone}`
        : isMailSent
          ? `OTP successfully resent to  your email: ${user.email}`
          : `OTP successfully resent to  your phone: ${user.phone}`,
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const userData: ForgotPasswordInput = req.body;

  const user = await User.findOne({
    $and: [{ email: userData.email }, { phone: userData.phone }],
  }).exec();

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (!user.isEmailOrPhoneVerified)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Account not verified' });

  const { isMailSent, isSmsSent } = await generateOTP({
    user,
    type: 'reset-password',
  });

  return res.json({
    success: true,
    message:
      isMailSent && isSmsSent
        ? `OTP successfully sent to  your email: ${user.email} and phone: ${user.phone}`
        : isMailSent
          ? `OTP successfully sent to  your email: ${user.email}`
          : `OTP successfully sent to  your phone: ${user.phone}`,
  });
};

const newPassword = async (req: Request, res: Response) => {
  const userData: NewPasswordInput = req.body;

  const foundOTP = await OTP.find({ userId: userData.id })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!foundOTP.length)
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'OTP does not exist',
    });

  if (foundOTP[0].type !== 'reset-password')
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid OTP',
    });

  const OTPMatch = await compare(userData.otp, foundOTP[0].otp);

  if (!OTPMatch)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid OTP',
    });

  const user = await User.findById(userData.id).exec();

  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Account does not exist' });

  if (!user.isEmailOrPhoneVerified)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Account not verified' });

  user.password = await hash(userData.password, Number(process.env.SALT));

  await user.save();
  await OTP.deleteMany({ userId: userData.id });

  return res.json({
    success: true,
    message: 'Password changed successfully',
  });
};

const login = async (req: Request, res: Response) => {
  const userData: LoginInput = req.body;

  const user = await User.findOne({
    $or: [{ email: userData.email }, { phone: userData.phone }],
  }).exec();

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (!user.isEmailOrPhoneVerified)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Account not verified' });

  const match = await compare(userData.password, user.password);

  if (!match)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Incorrect email/phone or password' });

  const accessToken = sign(
    {
      UserInfo: { _id: user._id, role: user.role },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' },
  );

  const refreshToken = sign(
    { _id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '21d' },
  );

  const { password: userPassword, ...userDetails } = user.toObject();

  return res
    .cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: 'User logged in',
      data: { accessToken, userDetails },
    });
};

const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: ReasonPhrases.UNAUTHORIZED });

  const refreshToken = cookies.jwt;

  const decoded: any = verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
  );

  if (!decoded)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ success: false, message: 'Forbidden' });

  const user = await User.findById(decoded._id)
    .select('-password')
    .lean()
    .exec();

  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: ReasonPhrases.NOT_FOUND });

  if (!user.isEmailOrPhoneVerified)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Account not verified' });

  const accessToken = sign(
    {
      UserInfo: { _id: user._id, role: user.role },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' },
  );

  return res.json({
    success: true,
    message: 'New access token generated',
    data: { accessToken, userDetails: user },
  });
};

const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(204);

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return res.json({ success: true, message: 'Cookie cleared' });
};

export default {
  register,
  verify,
  resendOTP,
  forgotPassword,
  newPassword,
  login,
  refresh,
  logout,
};
