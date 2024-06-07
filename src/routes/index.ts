import { Router } from 'express';
import { authorizeRoles, isAuthenticated } from '@src/middlewares';
import notificationRoutes from './notification';
import { authRoutes } from './auth';
import { faqRoutes } from './faq';
import { privacyPolicyRoutes } from './privacyPolicy';
import { faqCategoryRoutes } from './faqCategory';
import { notificationCategoryRoutes } from './notificationCategory';

const routes = () => {
  const router = Router();

  router.use('/auth', authRoutes());
  router.use('/faq', faqRoutes());
  router.use('/privacy-policy', privacyPolicyRoutes());

  router.use(isAuthenticated);

  router.use('/admin/faq-category', faqCategoryRoutes());
  router.use('/admin/notification-category', notificationCategoryRoutes());
  router.use('/notification', notificationRoutes());

  return router;
};

export default routes;
