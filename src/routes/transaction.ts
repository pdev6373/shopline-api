import { Router } from 'express';
import { transactionController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { transactionSchema } from '@src/schemas';

export const transactionRoutes = () => {
  const router = Router();

  router.use(authorizeRoles('User'));

  router
    .route('/')
    .get(transactionController.getTransactions)
    .post(
      validateData(transactionSchema.createTransaction),
      transactionController.createTransaction,
    )
    .patch(
      validateData(transactionSchema.updatedTransaction),
      transactionController.updateTransactionStatus,
    );

  router.get('/categories', transactionController.getTransactiontionCategories);
  router.get(
    '/:id',
    validateData(transactionSchema.getTransaction),
    transactionController.getTransaction,
  );

  return router;
};
