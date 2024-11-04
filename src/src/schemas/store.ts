import { object, string } from 'zod';

const updateStore = object({
  id: string(),
  name: string(),
  logo: string(),
});

const changePassword = object({
  id: string(),
  oldPassword: string(),
  newPassword: string(),
});

const deleteStore = object({
  id: string(),
});

export default {
  updateStore,
  deleteStore,
  changePassword,
};
