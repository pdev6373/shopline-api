import { nativeEnum, number, object, string } from 'zod';

enum transactionTypes {
  'Debit' = 'Debit',
  'Credit' = 'Credit',
}

enum transactionStatuses {
  'Pending' = 'Pending',
  'Completed' = 'Completed',
  'Failed' = 'Failed',
}

const getTransaction = object({
  id: string(),
});

const createTransaction = object({
  amount: number(),
  transactionType: nativeEnum(transactionTypes),
  description: string(),
});

const updatedTransaction = object({
  id: string(),
  status: nativeEnum(transactionStatuses),
});

export default {
  getTransaction,
  createTransaction,
  updatedTransaction,
};
