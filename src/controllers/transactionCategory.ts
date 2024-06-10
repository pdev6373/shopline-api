import { Transaction, TransactionCategory } from '@src/models';
import { ITransactionCategory } from '@src/models/transactionCategory';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const createTransactionCategory = async (req: Request, res: Response) => {
  const { name, description, icon } = req.body;

  const existingCategory = await TransactionCategory.findOne({
    name,
  });

  if (existingCategory)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Transaction category with this name already exists',
    });

  const newCategory: ITransactionCategory = new TransactionCategory({
    name,
    description,
    icon,
  });

  await newCategory.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Transaction category created',
    data: newCategory,
  });
};

const updateTransactionCategory = async (req: Request, res: Response) => {
  const { id, name, description, icon } = req.body;

  const category = await TransactionCategory.findById(id);

  if (!category)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Notification category not found' });

  const existingCategory = await TransactionCategory.findOne({
    name,
    _id: { $ne: id },
  });

  if (existingCategory)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Category Name already taken' });

  category.name = name;
  category.description = description;
  category.icon = icon;

  await category.save();

  return res.json({ success: true, data: category });
};

const deleteTransactionCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await TransactionCategory.findById(id);

  if (!category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Transaction category not found' });
  }

  await Transaction.deleteMany({ categoryId: id });
  await TransactionCategory.deleteOne({ _id: id });

  return res.json({
    success: true,
    message: 'Transaction category and associated transactions deleted',
  });
};

export default {
  createTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
};
