import { Router } from 'express';
import { authController } from '../controllers';
import { rateLimiter, validateData } from '../middlewares';
import { authSchema } from '../schemas';
import { StatusCodes } from 'http-status-codes';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - type
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *         type:
 *           type: string
 *           enum: [User, Store]
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - email
 *         - code
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         code:
 *           type: string
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *     NewPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - code
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         code:
 *           type: string
 *         newPassword:
 *           type: string
 *           minLength: 8
 */

export const authRoutes = () => {
  const router = Router();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new user or store
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegistration'
   *     responses:
   *       201:
   *         description: User successfully registered
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Invalid account type
   */
  router.post(
    '/register',
    (req, res, next) => {
      const accountType: string = req.body.type;

      let schema;
      if (accountType === 'User') schema = authSchema.userRegistration;
      else if (accountType === 'Store') schema = authSchema.storeRegistration;
      else
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Invalid account type' });

      return validateData(schema)(req, res, next);
    },
    authController.register,
  );

  /**
   * @swagger
   * /auth/verify:
   *   post:
   *     tags: [Authentication]
   *     summary: Verify email address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/VerifyEmailRequest'
   *     responses:
   *       200:
   *         description: Email successfully verified
   *       400:
   *         description: Invalid verification code
   */
  router.post(
    '/verify',
    validateData(authSchema.verifyEmail),
    authController.verifyEmail,
  );

  /**
   * @swagger
   * /auth/resend-verification-code:
   *   post:
   *     tags: [Authentication]
   *     summary: Resend email verification code
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Verification code resent successfully
   *       400:
   *         description: Invalid email
   */
  router.post(
    '/resend-verification-code',
    validateData(authSchema.resendVerificationCode),
    authController.resendVerificationCode,
  );

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     tags: [Authentication]
   *     summary: Request password reset
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgotPasswordRequest'
   *     responses:
   *       200:
   *         description: Password reset email sent
   *       400:
   *         description: Invalid email
   */
  router.post(
    '/forgot-password',
    validateData(authSchema.forgotPassword),
    authController.forgotPassword,
  );

  /**
   * @swagger
   * /auth/new-password:
   *   patch:
   *     tags: [Authentication]
   *     summary: Set new password after reset
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewPasswordRequest'
   *     responses:
   *       200:
   *         description: Password successfully updated
   *       400:
   *         description: Invalid reset code or password requirements not met
   */
  router.patch(
    '/new-password',
    validateData(authSchema.newPassword),
    authController.newPassword,
  );

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Authentication]
   *     summary: Login user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   *       429:
   *         description: Too many login attempts
   */
  router.post(
    '/login',
    rateLimiter,
    validateData(authSchema.login),
    authController.login,
  );

  /**
   * @swagger
   * /auth/refresh:
   *   get:
   *     tags: [Authentication]
   *     summary: Refresh access token
   *     responses:
   *       200:
   *         description: New access token generated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *       401:
   *         description: Invalid refresh token
   */
  router.get('/refresh', authController.refresh);

  /**
   * @swagger
   * /auth/logout:
   *   get:
   *     tags: [Authentication]
   *     summary: Logout user
   *     responses:
   *       200:
   *         description: Successfully logged out
   *       401:
   *         description: Not authenticated
   */
  router.get('/logout', authController.logout);

  return router;
};
