import { AuthenticatedRequest } from '@src/middlewares/authorizeRoles';
import { Transaction, TransactionCategory } from '@src/models';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  const transactions = await Transaction.find({
    userId: req.user?._id,
  });

  return res.json({ success: true, data: transactions });
};

const getTransactiontionCategories = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const categories = await TransactionCategory.find();
  return res.json({ success: true, data: categories });
};

const getTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    _id: id,
    user: req.user?._id,
  });

  if (!transaction)
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Transaction not found or unauthorized',
    });

  if (!transaction.isRead) {
    transaction.isRead = true;
    await transaction.save();
  }

  return res.json({ success: true, data: transaction });
};

const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const { amount, transactionType, description, categoryId } = req.body;

  const category = await TransactionCategory.findById(categoryId);

  if (!category)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Transaction category not found' });

  const newTransaction = new Transaction({
    userId: req.user?._id,
    amount,
    transactionType,
    description,
  });

  const savedTransaction = await newTransaction.save();

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, data: savedTransaction });
};

const updateTransactionStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id, status } = req.body;

  const transaction = await Transaction.findOne({
    _id: id,
    userId: req.user?._id,
  });

  if (!transaction)
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Transaction not found or unauthorized',
    });

  transaction.status = status;
  const updatedTransaction = await transaction.save();

  return res.json({ success: true, data: updatedTransaction });
};

const getTransactionsInCategoryForUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.params.id;

  const category = await TransactionCategory.findById(id);

  if (!category)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Transaction category not found' });

  const updatedTransactions = await Transaction.updateMany(
    { categoryId: id, userId: req.user?._id, isRead: false },
    { $set: { isRead: true } },
    { new: true },
  );

  return res.json({ success: true, data: updatedTransactions });
};

const markAllUnreadTransactionsInACategoryAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.params.id;

  await Transaction.updateMany(
    { categoryId: id, userId: req.user?._id, isRead: false },
    { $set: { isRead: true } },
    { new: true },
  );

  return res.json({
    success: true,
    message: 'All unread transactions marked as read',
  });
};

export default {
  getTransactions,
  getTransaction,
  getTransactiontionCategories,
  createTransaction,
  updateTransactionStatus,
  getTransactionsInCategoryForUser,
  markAllUnreadTransactionsInACategoryAsRead,
};
