import { Router } from 'express';
import { storeController } from '../../controllers';
import { validateData } from '../../middlewares';
import { storeSchema } from '../../schemas';

const storeRoutes = () => {
  const router = Router();

  router
    .route('/')
    .get(storeController.getStores)
    .patch(validateData(storeSchema.updateStore), storeController.updateStore)
    .delete(validateData(storeSchema.deleteStore), storeController.deleteStore);

  router.get('/:id', storeController.getStore);

  router.post(
    '/change-password',
    validateData(storeSchema.changePassword),
    storeController.changePassword,
  );

  return router;
};

export default storeRoutes;
