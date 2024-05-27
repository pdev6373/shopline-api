import express from 'express';
import authRoutes from './auth';
import { verifyJWT } from '@src/middlewares';
// const UserRoutes = require('./user');
// const PostRoutes = require('./post');

const routes = () => {
  const router = express.Router();
  router.use('/auth', authRoutes());
  router.use(verifyJWT);
  //   router.use('/user', UserRoutes());
  //   router.use('/post', PostRoutes());

  return router;
};

export default routes;
