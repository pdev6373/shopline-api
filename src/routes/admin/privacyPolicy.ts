import { Router } from 'express';
import { privacyPolicyController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { privacyPolicySchema } from '@src/schemas';

export const privacyPolicyRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(
      validateData(privacyPolicySchema.createAndUpdatePrivacyPolicy),
      privacyPolicyController.createPrivacyPolicy,
    )
    .put(
      validateData(privacyPolicySchema.createAndUpdatePrivacyPolicy),
      privacyPolicyController.updatePrivacyPolicy,
    )
    .delete(privacyPolicyController.deletePrivacyPolicy);

  return router;
};
