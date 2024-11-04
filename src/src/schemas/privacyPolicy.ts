import { object, string } from 'zod';

const createAndUpdatePrivacyPolicy = object({
  content: string(),
  answer: string(),
});

export default {
  createAndUpdatePrivacyPolicy,
};
