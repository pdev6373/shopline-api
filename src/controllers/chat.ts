import { Response } from 'express';
import { AuthenticatedRequest } from '@src/middlewares/authorizeRoles';
import { Chat, Message } from '@src/models';
import { StatusCodes } from 'http-status-codes';

const getChats = async (req: AuthenticatedRequest, res: Response) => {
  const chats = await Chat.find({ users: req.user?._id })
    .populate('userIds', 'name profilePicture onlineStatus')
    .populate('lastMessage');

  return res.json({
    success: true,
    data: chats,
  });
};

const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.params;
  const { filter } = req.query;

  let filterOptions: any = { chatId };

  switch (filter) {
    case 'read':
      filterOptions.isRead = true;
      break;
    case 'unread':
      filterOptions.isRead = false;
      break;
    case 'unanswered':
      filterOptions.isRead = false;
      break;
    default:
      break;
  }

  const messages = await Message.find(filterOptions)
    .populate('senderId', 'name profilePicture')
    .populate('productId');

  return res.json({
    success: true,
    data: messages,
  });
};

const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId, content, type, productId } = req.body;

  const messageData: any = {
    chatId,
    senderId: req.user?._id,
    content,
    type,
    isRead: false,
  };

  if (type === 'product') messageData.productId = productId;

  const message = new Message(messageData);
  await message.save();

  const chat = await Chat.findById(chatId);

  //   Shouldn't chat be created if there is none after sending a message?
  if (chat) {
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();
    chat.unreadMessagesCount += 1;
    await chat.save();
  }

  // io.to(chatId).emit('receiveMessage', message);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: message,
  });
};

const markMessagesAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.body;

  await Message.updateMany(
    { chatId, senderId: { $ne: req.user?._id }, isRead: false },
    { $set: { isRead: true } },
  );

  const chat = await Chat.findById(chatId);
  if (chat) {
    chat.unreadMessagesCount = 0;
    await chat.save();
  }

  res.json({ message: 'Messages marked as read' });
};

const saveChat = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Chat not found',
    });

  if (req.user?._id) {
    if (chat.archivedBy?.includes(req.user?._id))
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Chat already saved',
      });

    chat.archivedBy = chat.archivedBy
      ? [...chat.archivedBy, req.user._id]
      : [req.user._id];
    await chat.save();
  }

  return res.json({ message: 'Chat saved' });
};

const unsaveChat = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Chat not found',
    });

  if (req.user?._id) {
    if (!chat.archivedBy?.includes(req.user?._id))
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Chat not saved',
      });

    chat.archivedBy = chat.archivedBy?.filter(
      (id) => id.toString() !== req.user!._id.toString(),
    );
    await chat.save();
  }

  return res.json({ message: 'Chat saved' });
};

const getSavedChat = async (req: AuthenticatedRequest, res: Response) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Chat not found',
    });

  if (req.user?._id && !chat.archivedBy?.includes(req.user?._id))
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'No saved chat not found',
    });

  // Rubbish, correct later
  return res.json({
    success: true,
    data: chat.archivedBy.filter(
      (id) => id.toString() === req.user?._id.toString(),
    ),
  });
};

export default {
  getChats,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  saveChat,
  unsaveChat,
  getSavedChat,
};
