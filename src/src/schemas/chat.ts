import { nativeEnum, object, string } from 'zod';

enum MessageType {
  Text = 'Text',
  Emoji = 'Emoji',
  File = 'File',
  Product = 'Product',
}

const getMessages = object({
  chatId: string(),
  filter: string().optional(),
});

const sendMessage = object({
  chatId: string(),
  content: string(),
  type: nativeEnum(MessageType),
  productId: string().optional(),
});

const markMessagesAsRead = object({
  chatId: string(),
});

const saveChat = object({
  chatId: string(),
});

const unsaveChat = object({
  chatId: string(),
});

const getSavedChat = object({
  chatId: string(),
});

export default {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  saveChat,
  unsaveChat,
  getSavedChat,
};
