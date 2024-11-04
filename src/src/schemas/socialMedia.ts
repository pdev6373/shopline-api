import { object, string } from 'zod';

const getSocialMedia = object({
  id: string(),
});

const createSocialMedia = object({
  username: string(),
  userSocialId: string(),
  categoryId: string(),
});

const updateSocialMedia = object({
  id: string(),
  username: string(),
  userSocialId: string(),
  categoryId: string(),
});

const deleteSocialMedia = object({
  id: string(),
});

export default {
  getSocialMedia,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
