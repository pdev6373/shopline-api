import { Response } from 'express';
import { AuthenticatedRequest } from '@src/middlewares/authorizeRoles';
import { StatusCodes } from 'http-status-codes';
import { Wishlist } from '@src/models';

const addProductToWishlist = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ userId: req.user?._id });

  if (!wishlist)
    wishlist = new Wishlist({ userId: req.user?._id, products: [] });

  if (wishlist.products.includes(productId))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Wishlist already exist' });

  wishlist.products.push(productId);
  await wishlist.save();

  return res.json({
    success: true,
    data: wishlist,
  });
};

export const removeProductFromWishlist = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { productId } = req.body;

  const wishlist = await Wishlist.findOne({
    userId: req.user?._id,
  });

  if (!wishlist)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Wishlist not found' });

  if (!wishlist.products.find((id) => id.toString() === productId))
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Product not found in wishlist' });

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId,
  );

  await wishlist.save();

  return res.json({
    success: true,
    data: wishlist,
  });
};

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const { sortBy, ...filters } = req.query;

  const getSortOptions = (sortBy: string) => {
    switch (sortBy) {
      case 'latest':
        return { _id: -1 };
      case 'mostReviews':
        return { reviewsCount: -1 };
      case 'highestPrice':
        return { price: -1 };
      case 'lowestPrice':
        return { price: 1 };
      case 'mostPurchases':
        return { purchasesCount: -1 };
      default:
        return {};
    }
  };

  const getFilterOptions = (filters: any) => {
    let filterOptions: any = {};

    if (filters.cashback === 'true') {
      filterOptions.cashback = true;
    }
    if (filters.freeShipping === 'true') {
      filterOptions.freeShipping = true;
    }
    if (filters.discount === 'true') {
      filterOptions.discount = true;
    }
    if (filters.wholesalePrice === 'true') {
      filterOptions.wholesalePrice = true;
    }

    return filterOptions;
  };

  const sortOptions = getSortOptions(sortBy as string);
  const filterOptions = getFilterOptions(filters);

  const wishlist = await Wishlist.findOne({ userId: req.user?._id }).populate({
    path: 'products',
    match: filterOptions,
    options: { sort: sortOptions },
  });

  if (!wishlist)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Wishlist not found' });

  return res.json({
    success: true,
    data: wishlist,
  });
};

export const getProductInWishlist = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ userId: req.user?._id });

  if (!wishlist)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Wishlist not found' });

  const foundProduct = wishlist.products.find(
    (id) => id.toString() === productId,
  );

  if (!foundProduct)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Product not found in wishlist' });

  return res.json({
    success: true,
    data: foundProduct,
  });
};

export const clearWishlist = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const wishlist = await Wishlist.findOne({ userId: req.user?._id });

  if (!wishlist)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Wishlist not found' });

  wishlist.products = [];
  await wishlist.save();

  return res.json({
    success: true,
    data: wishlist,
  });
};

export default {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
  getProductInWishlist,
  clearWishlist,
};
