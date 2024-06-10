import { Router } from 'express';
import { socialMediaCategoryController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { socialMediaCategorySchema } from '@src/schemas';

export const socialMediaCategoryRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(
      validateData(socialMediaCategorySchema.createSocialMediaCategory),
      socialMediaCategoryController.createSocialMediaCategory,
    )
    .put(
      validateData(socialMediaCategorySchema.updateSocialMediaCategory),
      socialMediaCategoryController.updateSocialMediaCategory,
    )
    .delete(
      validateData(socialMediaCategorySchema.deleteSocialMediaCategory),
      socialMediaCategoryController.deleteSocialMediaCategory,
    );

  return router;
};
