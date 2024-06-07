import { object, string } from 'zod';

const createAndUpdatePrivacyPolicy = object({
  content: string(),
  answer: string().email(),
});

export default {
  createAndUpdatePrivacyPolicy,
};
