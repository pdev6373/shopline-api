import { Router } from 'express';
import { transactionCategoryController } from '@src/controllers';
import { validateData } from '@src/middlewares';
import { transactionCategorySchema } from '@src/schemas';

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
