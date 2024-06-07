import { object, string } from 'zod';

const createFaq = object({
  categoryId: string(),
  question: string(),
  answer: string().email(),
});

const updateFaq = object({
  id: string(),
  question: string(),
  answer: string().email(),
});

const deleteFaq = object({
  id: string(),
});

export default {
  createFaq,
  updateFaq,
  deleteFaq,
};
