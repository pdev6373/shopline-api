import { Router } from 'express';
import { transactionCategoryController } from '../controllers';
import { validateData } from '../middlewares';
import { transactionCategorySchema } from '../schemas';

export const transactionCategoryRoutes = () => {
  const router = Router();

  router
    .route('/')
    .post(
      validateData(transactionCategorySchema.createTransactionCategory),
      transactionCategoryController.createTransactionCategory,
    )
    .put(
      validateData(transactionCategorySchema.updateTransactionCategory),
      transactionCategoryController.updateTransactionCategory,
    )
    .delete(
      validateData(transactionCategorySchema.deleteTransactionCategory),
      transactionCategoryController.deleteTransactionCategory,
    );

  return router;
};
