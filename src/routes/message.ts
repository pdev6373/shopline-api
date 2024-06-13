import { Router } from 'express';
import { chatController } from '@src/controllers';
import { authorizeRoles, validateData } from '@src/middlewares';
import { chatSchema } from '@src/schemas';

export const messageRoutes = () => {
  const router = Router();

  router.use(authorizeRoles('User', 'Store'));

  router
    .route('/')
    .get(validateData(chatSchema.getMessages), chatController.getMessages)
    .post(validateData(chatSchema.sendMessage), chatController.sendMessage);

  router.post(
    '/read',
    validateData(chatSchema.markMessagesAsRead),
    chatController.markMessagesAsRead,
  );

  return router;
};
