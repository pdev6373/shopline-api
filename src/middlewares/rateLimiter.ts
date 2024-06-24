import { rateLimit } from 'express-rate-limit';

type RateLimiterType = {
  type: 'login' | 'otp';
};

export const rateLimiter = ({ type }: RateLimiterType) =>
  rateLimit({
    windowMs: type === 'login' ? 300000 : 60000, // 5 MINUTES and 1 MINUTE respectively,
    max: type === 'login' ? 5 : 1, // LIMITS EACH IP TO 5 LOGIN REQUESTS PER `WINDOW` PER MINUTE,
    message: {
      message:
        type === 'login'
          ? 'Too many requests made from this IP, please try again after 5 minutes'
          : 'You can only request for another OTP after 1 minute',
    },
    handler: (req, res, next, options) => {
      res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
