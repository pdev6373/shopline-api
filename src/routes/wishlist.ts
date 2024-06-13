import { Router } from 'express';
import { wishlistController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { wishlistSchema } from '@src/schemas';

export const wishlistRoutes = () => {
  const router = Router();

  router.use(authorizeRoles('User'));

  router
    .route('/')
    .get(wishlistController.getWishlist)
    .post(
      validateData(wishlistSchema.wishlist),
      wishlistController.addProductToWishlist,
    );

  router.get('/:productId', wishlistController.getProductInWishlist);

  router.post(
    '/remove',
    validateData(wishlistSchema.wishlist),
    wishlistController.removeProductFromWishlist,
  );

  router.post('/clear', wishlistController.removeProductFromWishlist);

  return router;
};
