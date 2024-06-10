import { object, string } from 'zod';

const createTransactionCategory = object({
  name: string(),
  description: string(),
  icon: string(),
});

const updateTransactionCategory = object({
  id: string(),
  name: string(),
  description: string(),
  icon: string(),
});

const deleteTransactionCategory = object({
  id: string(),
});

export default {
  createTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
};
