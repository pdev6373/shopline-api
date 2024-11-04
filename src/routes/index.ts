import { Router } from 'express';
import { authorizeRoles, isAuthenticated } from '../middlewares';
import { authRoutes } from './auth';
import { faqRoutes } from './faq';
import { privacyPolicyRoutes } from './privacyPolicy';
import { faqCategoryRoutes } from './faqCategory';
import { notificationCategoryRoutes } from './notificationCategory';
import { transactionRoutes } from './transaction';
import { socialMediaCategoryRoutes } from './socialMediaCategory';
import { notificationRoutes } from './notification';
import { socialMediaRoutes } from './socialMedia';
import { wishlistRoutes } from './wishlist';
import { chatRoutes } from './chat';
import { messageRoutes } from './message';

const routes = () => {
  const router = Router();

  router.use('/auth', authRoutes());
  router.use('/faqs', faqRoutes());
  router.use('/privacy-policies', privacyPolicyRoutes());

  router.use(isAuthenticated);

  router.use('/notifications', notificationRoutes());
  router.use('/transactions', transactionRoutes());
  router.use('/socialmedias', socialMediaRoutes());
  router.use('/wishlist', wishlistRoutes());
  router.use('/chats', chatRoutes());
  router.use('/messages', messageRoutes());

  router.use(authorizeRoles('Admin'));
  router.use('/admin/faq-categories', faqCategoryRoutes());
  router.use('/admin/notification-categories', notificationCategoryRoutes());
  router.use('/admin/transaction-categories', notificationCategoryRoutes());
  router.use('/admin/socialmedia-categories', socialMediaCategoryRoutes());

  return router;
};

export default routes;
