import { Router } from 'express';
import { authorizeRoles, isAuthenticated } from '@src/middlewares';
import notificationRoutes from './notification';
import { authRoutes } from './auth';
import { faqRoutes } from './faq';
import { privacyPolicyRoutes } from './privacyPolicy';
import { faqCategoryRoutes } from './faqCategory';
import { notificationCategoryRoutes } from './notificationCategory';
import { transactionRoutes } from './transaction';
import { socialMediaCategoryRoutes } from './socialMediaCategory';

const routes = () => {
  const router = Router();

  router.use('/auth', authRoutes());
  router.use('/faq', faqRoutes());
  router.use('/privacy-policy', privacyPolicyRoutes());

  router.use(isAuthenticated);

  router.use('/notification', notificationRoutes());
  router.use('/transaction', transactionRoutes());

  router.use(authorizeRoles('Admin'));
  router.use('/admin/faq-category', faqCategoryRoutes());
  router.use('/admin/notification-category', notificationCategoryRoutes());
  router.use('/admin/transaction-category', notificationCategoryRoutes());
  router.use('/admin/socialmedia-category', socialMediaCategoryRoutes());

  return router;
};

export default routes;
