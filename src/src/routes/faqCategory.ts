import { Router } from 'express';
import { faqCategoryController } from '../controllers';
import { validateData } from '../middlewares';
import { faqCategorySchema } from '../schemas';

export const faqCategoryRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(
      validateData(faqCategorySchema.createFaqCategory),
      faqCategoryController.createFaqCategory,
    )
    .put(
      validateData(faqCategorySchema.updateFaqCategory),
      faqCategoryController.updateFaqCategory,
    )
    .delete(
      validateData(faqCategorySchema.deleteFaqCategory),
      faqCategoryController.deleteFaqCategory,
    );

  return router;
};
