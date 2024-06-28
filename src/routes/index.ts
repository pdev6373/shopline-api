import { Router } from 'express';
import { authorizeRoles, isAuthenticated } from '@src/middlewares';
import { authRoutes } from './auth';
import { contactRoutes } from './contact';
import { subscriptionRoutes } from './subscription';

const routes = () => {
  const router = Router();

  router.use('/auth', authRoutes());
  router.use('/contact-danbertech', contactRoutes());
  router.use('/subscribe', subscriptionRoutes());

  router.use(isAuthenticated);
  // router.use('/user', authRoutes());

  router.use(authorizeRoles('admin'));

  return router;
};

export default routes;
