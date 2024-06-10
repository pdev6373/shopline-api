import { Store } from '@src/models';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { compare, hash } from 'bcrypt';

// GET STORES
const getStores = async (req: Request, res: Response) => {
  const stores = await Store.find().select('-password').lean();

  return res.json({
    success: true,
    data: stores,
  });
};

// GET STORE
const getStore = async (req: Request, res: Response) => {
  const storeId: string = req.params.id;

  const store = await Store.findById(storeId).select('-password').lean();

  if (!store)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Store does not exist' });

  return res.json({
    success: true,
    data: store,
  });
};

// UPDATE STORE
const updateStore = async (req: Request, res: Response) => {
  const { id, name, logo } = req.body;

  const store = await Store.findById(id).exec();

  if (!store)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Store does not exist' });

  if (!store.isVerified)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Store not verified' });

  if (name !== store.email) {
    const duplicate = await Store.findOne({
      name,
      _id: { $ne: id },
    })
      .lean()
      .exec();

    if (duplicate)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Name already taken' });

    store.name = name;
  }

  store.logo = logo;

  const updatedStore = await Store.findByIdAndUpdate(
    {
      _id: id,
    },
    store,
    { new: true },
  );

  return res.json({
    success: true,
    message: 'Store updated',
    data: updatedStore,
  });
};

// CHANGE PASSWORD
const changePassword = async (req: Request, res: Response) => {
  const { id, oldPassword, newPassword } = req.body;

  const store = await Store.findById(id).exec();

  if (!store)
    return res
      .status(400)
      .json({ success: false, message: 'Store does not exist' });

  if (!store.isVerified)
    return res
      .status(401)
      .json({ success: false, message: 'Store not verified' });

  const match = await compare(oldPassword, store.password);

  if (!match)
    return res
      .status(401)
      .json({ success: false, message: 'Old password is incorrect' });

  store.password = await hash(newPassword, Number(process.env.SALT));

  await store.save();

  return res.json({
    success: true,
    message: 'Password changed',
  });
};

// Update email
const changeEmail = async (req: Request, res: Response) => {};

// New Email
const verifyEmail = async (req: Request, res: Response) => {};

// New Email
const newEmail = async (req: Request, res: Response) => {};

// DELETE STORE
const deleteStore = async (req: Request, res: Response) => {
  const storeId: string = req.params.id;

  // const deletedStore: IStore | null = await Store.findByIdAndDelete(storeId);
  const deletedStore = await Store.findByIdAndDelete(storeId);

  if (!deletedStore)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Store not found' });

  return res.json({
    success: true,
    message: 'Store deleted',
  });
};

export default {
  getStores,
  getStore,
  updateStore,
  changePassword,
  changeEmail,
  verifyEmail,
  newEmail,
  deleteStore,
};
