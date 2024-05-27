import { OTP, User } from '@src/models';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { compare, hash } from 'bcrypt';
import { generate } from 'otp-generator';
import { sign, verify } from 'jsonwebtoken';

const otpOptions = {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
};

// REGISTER
const register = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;

  const user = await User.findOne({ email }).exec();

  if (user) {
    if (user.isVerified)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: 'Account already exist' });

    user.firstname = firstname;
    user.lastname = lastname;
    user.password = await hash(password, Number(process.env.SALT));

    const updatedUser = await user.save();

    if (updatedUser) {
      let otp = generate(6, otpOptions);
      let result = await OTP.findOne({ otp });

      while (result?.email === email) {
        otp = generate(6, otpOptions);
        result = await OTP.findOne({ otp });
      }

      const hashedOTP = await hash(otp, Number(process.env.SALT));

      const createdOTP = await OTP.create({
        email,
        otp: hashedOTP,
        type: 'Verify Account',
      });

      if (createdOTP)
        return res.json({
          success: true,
          message: `A verification code was sent to ${email}`,
        });

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  const hashedPassword = await hash(password, Number(process.env.SALT));
  const registeredUser = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  if (!registeredUser)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });

  let otp = generate(6, otpOptions);
  let result = await OTP.findOne({ otp });

  while (result?.email === email) {
    otp = generate(6, otpOptions);
    result = await OTP.findOne({ otp });
  }

  const hashedOTP = await hash(otp, Number(process.env.SALT));

  const createdOTP = await OTP.create({
    email,
    otp: hashedOTP,
    type: 'Verify Account',
  });

  if (createdOTP)
    return res.json({
      success: true,
      message: `A verification code was sent to ${email}`,
    });

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
};

// Resend Verification Code
const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (user.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account already verified' });

  let otp = generate(6, otpOptions);
  let result = await OTP.findOne({ otp });

  while (result?.email === email) {
    otp = generate(6, otpOptions);
    result = await OTP.findOne({ otp });
  }

  const hashedOTP = await hash(otp, Number(process.env.SALT));

  const createdOTP = await OTP.create({
    email,
    otp: hashedOTP,
    type: 'Verify Account',
  });

  if (createdOTP)
    return res.json({
      success: true,
      message: `A verification code was resent to ${email}`,
    });

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
};

// Verify Email
const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

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

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (user.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account already verified' });

  user.isVerified = true;
  const savedUser = await user.save();

  if (savedUser) {
    await OTP.deleteMany({ email });

    return res.json({
      success: true,
      message: `User "${email}" Account verified successfully`,
    });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).exec();
  if (!user)
    return res
      .status(400)
      .send({ success: false, message: 'Account does not exist' });

  if (!user.isVerified)
    return res
      .status(401)
      .send({ success: false, message: 'Account not verified' });

  let otp = generate(6, otpOptions);
  let result = await OTP.findOne({ otp });

  while (result?.email === email) {
    otp = generate(6, otpOptions);
    result = await OTP.findOne({ otp });
  }

  const hashedOTP = await hash(otp, Number(process.env.SALT));

  const createdOTP = await OTP.create({
    email,
    otp: hashedOTP,
    type: 'Password Reset',
  });

  if (createdOTP)
    return res.json({
      success: true,
      message: `A reset code was resent to ${email}`,
    });

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
};

const newPassword = async (req: Request, res: Response) => {
  const { password, otp, email } = req.body;

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

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account does not exist' });

  if (!user.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Account not verified' });

  user.password = await hash(password, Number(process.env.SALT));

  const savedUser = await user.save();

  if (savedUser) {
    await OTP.deleteMany({ email });

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: StatusCodes.INTERNAL_SERVER_ERROR });
};

// Login
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res
      .status(400)
      .send({ success: false, message: 'Account does not exist' });

  if (!user.isVerified)
    return res
      .status(401)
      .send({ success: false, message: 'Account not verified' });

  const match = await compare(password, user.password);

  if (!match)
    return res
      .status(401)
      .send({ success: false, message: 'Incorrect email or password' });

  const accessToken = sign(
    {
      UserInfo: { email: user.email },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' },
  );

  const refreshToken = sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' },
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password: userPassword, ...userDetails } = user;

  return res.json({
    success: true,
    message: 'User logged in',
    data: { accessToken, userDetails },
  });
};

// Refresh
const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).send({ success: false, message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  const decoded: any = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

  if (!decoded)
    return res.status(403).send({ success: false, message: 'Forbidden' });

  const user = await User.findOne({ email: decoded.email })
    .select('-password')
    .lean()
    .exec();

  if (!user)
    return res.status(401).send({ success: false, message: 'Unauthorized' });

  if (!user.isVerified)
    return res
      .status(401)
      .send({ success: false, message: 'Account not verified' });

  const accessToken = sign(
    {
      UserInfo: { email: user.email },
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

// Logout
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
  resendVerificationCode,
  verifyEmail,
  forgotPassword,
  newPassword,
  login,
  refresh,
  logout,
};
