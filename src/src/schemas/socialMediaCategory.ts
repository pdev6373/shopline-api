import { object, string } from 'zod';

const createSocialMediaCategory = object({
  name: string(),
  icon: string(),
  description: string(),
});

const updateSocialMediaCategory = object({
  id: string(),
  name: string(),
  icon: string(),
  description: string(),
});

const deleteSocialMediaCategory = object({
  id: string(),
});

export default {
  createSocialMediaCategory,
  updateSocialMediaCategory,
  deleteSocialMediaCategory,
};
