import { Router } from 'express';
import { privacyPolicyController } from '@src/controllers';

export const privacyPolicyRoutes = () => {
  const router = Router();

  router.get('/', privacyPolicyController.getPrivacyPolicy);

  return router;
};
