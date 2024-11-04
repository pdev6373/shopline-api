import { Router } from 'express';
import { chatController } from '../controllers';
import { authorizeRoles, validateData } from '../middlewares';
import { chatSchema } from '../schemas';

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
