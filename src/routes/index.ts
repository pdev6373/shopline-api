import { Router } from 'express';
import { authorizeRoles, isAuthenticated } from '@src/middlewares';
import { authRoutes } from './auth';

const routes = () => {
  const router = Router();

  router.use('/auth', authRoutes());

  router.use(isAuthenticated);
  router.use('/user', authRoutes());

  router.use(authorizeRoles('admin'));

  return router;
};

export default routes;
