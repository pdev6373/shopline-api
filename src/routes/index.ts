import { Router } from 'express';
import { verifyJWT } from '@src/middlewares';
import { authRoutes, faqRoutes, privacyPolicyRoutes } from './public';
import {
  faqCategoryRoutes,
  privacyPolicyRoutes as adminPrivacyPolicyRoutes,
} from './admin';

const routes = () => {
  const router = Router();

  // PUBLIC
  router.use('/auth', authRoutes());
  router.use('/faq', faqRoutes());
  router.use('/privacy-policy', privacyPolicyRoutes());

  // USER
  router.use(verifyJWT);

  // STORE

  // ADMIN
  router.use('/admin/faq-category', faqCategoryRoutes());
  router.use('/admin/privacy-policy', adminPrivacyPolicyRoutes());

  return router;
};

export default routes;
