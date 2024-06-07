import { OTP, Store, User } from '@src/models';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { compare, hash } from 'bcrypt';
import { generate } from 'otp-generator';
import { sign, verify } from 'jsonwebtoken';
import { sendVerificationEmail } from '@src/models/otp';

const otpOptions = {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
};

const generateOTP = async (
  email: string,
  type: 'Verify Account' | 'Password Reset' = 'Verify Account',
) => {
  let otp = generate(6, otpOptions);
  let result = await OTP.findOne({ otp });

  while (result?.email === email) {
    otp = generate(6, otpOptions);
    result = await OTP.findOne({ otp });
  }

  const hashedOTP = await hash(otp, Number(process.env.SALT));

  await OTP.deleteMany({ email });

  const createdOTP = await OTP.create({
    email,
    type,
    otp: hashedOTP,
  });

  if (createdOTP) {
    const response = await sendVerificationEmail({
      email,
      otp,
      type,
    });

    return response;
  }

  return false;
};

// REGISTER
const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const isUser = req.originalUrl.includes('/auth/user/register');

  let account: any;
  if (isUser) account = await User.findOne({ email }).exec();
  else account = await Store.findOne({ email }).exec();

  if (account) {
    if (account.isVerified)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: 'Account already exist' });

    if (isUser) {
      account.firstname = req.body.firstname;
      account.lastname = req.body.lastname;
    } else {
      account.name = req.body.name;
      account.logo = req.body.logo;
    }

    account.password = await hash(password, Number(process.env.SALT));

    await account.save();
    await generateOTP(email);

    return res.json({
      success: true,
      message: `A verification code was sent to ${email}`,
    });
  }

  const hashedPassword = await hash(password, Number(process.env.SALT));

  if (isUser)
    await User.create({
      ...req.body,
      password: hashedPassword,
    });
  else
    await Store.create({
      ...req.body,
      password: hashedPassword,
    });

  await generateOTP(email);

  return res.json({
    success: true,
    message: `A verification code was sent to ${email}`,
  });
};

// VERIFY EMAIL
const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp, type } = req.body;

  const isUser = type === 'User';

  let account;
  if (isUser) account = await User.findOne({ email }).exec();
  else account = await Store.findOne({ email }).exec();

  if (!account)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (account.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account already verified' });

  const foundOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

  if (!foundOTP.length)
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  if (foundOTP[0].type !== 'Verify Account')
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  const OTPMatch = await compare(otp, foundOTP[0].otp);

  if (!OTPMatch)
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  account.isVerified = true;

  await account.save();
  await OTP.deleteMany({ email });

  return res.json({
    success: true,
    message: 'Account verified successfully',
  });
};

// RESEND VERIFICATION CODE
const resendVerificationCode = async (req: Request, res: Response) => {
  const { email, otpType, type } = req.body;

  const isUser = type === 'User';

  let account;

  if (isUser) account = await User.findOne({ email }).exec();
  else account = await Store.findOne({ email }).exec();

  if (!account)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (otpType === 'Verify Account' && account.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account already verified' });

  await generateOTP(email, otpType);

  return res.json({
    success: true,
    message: `A verification code was resent to ${email}`,
  });
};

// FORGOT PASSWORD
const forgotPassword = async (req: Request, res: Response) => {
  const { email, type } = req.body;

  const isUser = type === 'User';

  let account;

  if (isUser) account = await User.findOne({ email }).exec();
  else account = await Store.findOne({ email }).exec();

  if (!account)
    return res
      .status(400)
      .json({ success: false, message: 'Account does not exist' });

  if (!account.isVerified)
    return res
      .status(401)
      .json({ success: false, message: 'Account not verified' });

  await generateOTP(email, 'Password Reset');

  return res.json({
    success: true,
    message: `A reset code was resent to ${email}`,
  });
};

// NEW PASSWORD
const newPassword = async (req: Request, res: Response) => {
  const { password, otp, email, type } = req.body;

  const foundOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

  if (!foundOTP.length)
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  if (foundOTP[0].type !== 'Password Reset')
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  const OTPMatch = await compare(otp, foundOTP[0].otp);

  if (!OTPMatch)
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  const isUser = type === 'User';

  let account;

  if (isUser) account = await User.findOne({ email }).exec();
  else account = await Store.findOne({ email }).exec();

  if (!account)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (!account.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account not verified' });

  account.password = await hash(password, Number(process.env.SALT));

  await account.save();

  await OTP.deleteMany({ email });

  return res.json({
    success: true,
    message: 'Password changed successfully',
  });
};

// LOGIN
const login = async (req: Request, res: Response) => {
  const { email, password, type } = req.body;

  const isUser = type === 'User';

  let account;

  if (isUser) account = await User.findOne({ email }).exec();
  else account = await Store.findOne({ email }).exec();

  if (!account)
    return res
      .status(400)
      .json({ success: false, message: 'Account does not exist' });

  if (!account.isVerified)
    return res
      .status(401)
      .json({ success: false, message: 'Account not verified' });

  const match = await compare(password, account.password);

  if (!match)
    return res
      .status(401)
      .json({ success: false, message: 'Incorrect email or password' });

  const accessToken = sign(
    {
      UserInfo: { email: account.email, type },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' },
  );

  const refreshToken = sign(
    { email: account.email, type },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' },
  );

  const { password: userPassword, ...userDetails } = account.toObject();

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

// REFRESH
const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  const decoded: any = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

  if (!decoded)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ success: false, message: 'Forbidden' });

  const isUser = decoded.type === 'User';

  let account;

  if (isUser)
    account = await User.findOne({ email: decoded.email })
      .select('-password')
      .lean()
      .exec();
  else
    account = await Store.findOne({ email: decoded.email })
      .select('-password')
      .lean()
      .exec();

  if (!account)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Unauthorized' });

  if (!account.isVerified)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Account not verified' });

  const accessToken = sign(
    {
      UserInfo: { email: account.email, type: decoded.type },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' },
  );

  return res.json({
    success: true,
    message: 'New access token generated',
    data: { accessToken, userDetails: account },
  });
};

// LOGOUT
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
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  newPassword,
  login,
  refresh,
  logout,
};
