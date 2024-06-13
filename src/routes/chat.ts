import { Router } from 'express';
import { chatController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { chatSchema } from '@src/schemas';

export const chatRoutes = () => {
  const router = Router();

  router.use(authorizeRoles('User', 'Store'));

  router.get('/', chatController.getChats);
  router.get(
    '/save',
    validateData(chatSchema.getSavedChat),
    chatController.getSavedChat,
  );
  router.post(
    '/save',
    validateData(chatSchema.saveChat),
    chatController.saveChat,
  );
  router.post(
    '/unsave',
    validateData(chatSchema.unsaveChat),
    chatController.unsaveChat,
  );

  return router;
};
