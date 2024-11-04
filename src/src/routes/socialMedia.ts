import { Router } from 'express';
import { socialMediaController } from '../controllers';
import { authorizeRoles, validateData } from '../middlewares';
import { socialMediaSchema } from '../schemas';

export const socialMediaRoutes = () => {
  const router = Router();

  router.use(authorizeRoles('User', 'Store'));

  router
    .route('/')
    .get(socialMediaController.getSocialMedias)
    .post(
      validateData(socialMediaSchema.createSocialMedia),
      socialMediaController.createSocialMedia,
    )
    .put(
      validateData(socialMediaSchema.updateSocialMedia),
      socialMediaController.updateSocialMedia,
    )
    .delete(
      validateData(socialMediaSchema.deleteSocialMedia),
      socialMediaController.deleteSocialMedia,
    );

  router.get('/categories', socialMediaController.getSocialMediaCategories);
  router.get(
    '/:id',
    validateData(socialMediaSchema.getSocialMedia),
    socialMediaController.getSocialMedia,
  );

  return router;
};
