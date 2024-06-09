import { AuthenticatedRequest } from '@src/middlewares/authorizeRoles';
import { Transaction } from '@src/models';
import { ITransaction } from '@src/models/transaction';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  const transactions = await Transaction.find({ userId: req.user?._id });
  return res.json({ success: true, data: transactions });
};

const getTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    _id: id,
    userId: req.user?._id,
  });

  if (!transaction)
    return res.status(404).json({
      success: false,
      message: 'Transaction not found or unauthorized',
    });

  return res.json({ success: true, data: transaction });
};

const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const { amount, transactionType, description } = req.body;

  const newTransaction: ITransaction = new Transaction({
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

export default {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransactionStatus,
};
