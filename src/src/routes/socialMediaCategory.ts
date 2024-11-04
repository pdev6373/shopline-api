import { Router } from 'express';
import { socialMediaCategoryController } from '../controllers';
import { validateData } from '../middlewares';
import { socialMediaCategorySchema } from '../schemas';

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
