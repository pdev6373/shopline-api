import { Router } from 'express';
import { faqController } from '../controllers';
import { validateData } from '../middlewares';
import { faqSchema } from '../schemas';

export const faqRoutes = () => {
  const router = Router();

  router
    .route('/')
    .get(faqController.getFaqs)
    .post(validateData(faqSchema.createFaq), faqController.createFaq)
    .put(validateData(faqSchema.updateFaq), faqController.updateFaq)
    .delete(validateData(faqSchema.deleteFaq), faqController.deleteFaq);

  router.get('/categories', faqController.getFaqCategories);
  router.get('/:id', faqController.getFaq);

  return router;
};
