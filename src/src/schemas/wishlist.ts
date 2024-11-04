import { object, string } from 'zod';

const wishlist = object({
  productId: string(),
});

export default {
  wishlist,
};
