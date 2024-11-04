import { object, string } from 'zod';

const createFaqCategory = object({
  name: string(),
  description: string(),
});

const updateFaqCategory = object({
  id: string(),
  name: string(),
  description: string(),
});

const deleteFaqCategory = object({
  id: string(),
});

export default {
  createFaqCategory,
  updateFaqCategory,
  deleteFaqCategory,
};
