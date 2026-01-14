import { type Request, type Response } from "express";
import { constants as httpConstants } from "http2";
import * as validator from "express-validator";
import { type WebsocketRequestHandler } from "express-ws";
import { type WebSocket } from "ws";

import * as chatModel from "../models/chatModel";
import * as chatUserModel from "../models/chatUserModel";
import * as messageModel from "../models/messageModel";

const connections = new Map<number, Map<number, WebSocket>>();

interface ChatData {
  chat_id: number;
  message: Message;
}

interface Message {
  id: number;
  chat_id: number;
  text: string;
  timestamp: string;
  author_id: number;
  author: Author;
}

interface Author {
  id: number | undefined;
  chat_id: number;
  user_id: number;
  user: User;
}

interface User {
  username: string;
  password: string;
  display_name?: string;
  profile_image?: string;
  is_logged_in: boolean;
  id: number;
}

const newConnection: WebsocketRequestHandler = async (ws, req, next) => {
  const { chatId, userId } = req.params;
  const chatIdNumber = Number(chatId);
  const userIdNumber = Number(userId);

  if (connections.has(chatIdNumber)) {
    const websocketList = connections.get(chatIdNumber);
    if (websocketList) {
      websocketList.set(userIdNumber, ws);
    }
  } else {
    connections.set(
      chatIdNumber,
      new Map<number, WebSocket>([[userIdNumber, ws]])
    );
  }
  next();
};

const messageListener: WebsocketRequestHandler = async (ws, req) => {
  ws.on("message", (message: string) => {
    // If chat ID does not exist
    // Create chat
    // Create message
    // Send message
    // Chat ID does exist
    const data: ChatData = JSON.parse(message);

    const recipients = connections.get(data.chat_id);
    recipients?.forEach((ws, userId) => {
      // Ensure we don't send the message back to the same user
      if (data.message.author.user_id !== userId) {
        ws.send(JSON.stringify(data.message));
      }
    });
  });
};

const validateNewChat = [
  validator.body("name").trim(),
  validator
    .body("from_user_id")
    .notEmpty()
    .withMessage("New chat must have a from user")
    .isInt()
    .withMessage("To User ID must be an integer")
    .toInt(),
  validator
    .body("to_user_id")
    .notEmpty()
    .withMessage("New chat must have at least one recipient")
    .isInt()
    .withMessage("To User ID must be an integer")
    .toInt(),
  validator
    .body("message")
    .trim()
    .notEmpty()
    .withMessage("New chat must include a message"),
];

const createNewChat = [
  validateNewChat,
  async (req: Request, res: Response) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).json({
        message: "Invalid create new chat body",
        errors: errors.array(),
      });
    }

    const {
      name,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      message,
    } = validator.matchedData(req);

    try {
      const chat = await chatModel.createChat(name, fromUserId, toUserId);

      if (!chat) {
        return res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .json({
            message: "Failed to create a new chat",
          });
      }

      const newMessage = await messageModel.createMessage(
        chat.id,
        chat.recipients[0]!.id,
        message
      );

      if (!newMessage) {
        return res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .json({
            message: "Failed to create first message for chat",
          });
      }

      return res.status(httpConstants.HTTP_STATUS_CREATED).json({
        chat: chat,
      });
    } catch (error) {
      console.error(error);
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        message: "Failed to create a new chat",
      });
    }
  },
];

const validateUserIds = [
  validator
    .query("user_ids")
    .customSanitizer((value) => value.split(",").map(Number)),
];

const findChatFromUserIds = [
  validateUserIds,
  async (req: Request, res: Response) => {
    const { user_ids } = validator.matchedData(req);

    if (user_ids.length < 2) {
      return res
        .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: "At least two User IDs are required to find a chat" });
    }

    try {
      const chat = await chatModel.getChatFromUserIds(user_ids);
      return res.json({ chat });
    } catch (error) {
      console.error(error);
      return res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .json({ message: "Unable to search for chat" });
    }
  },
];

const getChatMessages = async (req: Request, res: Response) => {
  const { chatId: rawChatId } = req.params;
  const chatId = Number(rawChatId);

  try {
    const messages = await messageModel.getMessagesByChatId(chatId);
    return res.json({ messages });
  } catch (error) {
    console.error(error);
    return res
      .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: "Unable to get messages for chat" });
  }
};

const validateChatMessage = [
  validator
    .body("chat_id")
    .notEmpty()
    .withMessage("Must include chat ID")
    .isInt()
    .withMessage("Chat ID must be an integer")
    .toInt(),
  validator
    .body("user_id")
    .notEmpty()
    .withMessage("Must include user ID")
    .isInt()
    .withMessage("User ID must be an integer")
    .toInt(),
  validator
    .body("message")
    .trim()
    .notEmpty()
    .withMessage("Must include a message"),
];

const createNewChatMessage = [
  validateChatMessage,
  async (req: Request, res: Response) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).json({
        message: "Invalid create new chat message body",
        errors: errors.array(),
      });
    }

    const {
      chat_id: chatId,
      user_id: userId,
      message,
    } = validator.matchedData(req);

    const chatUserId = await chatUserModel.getChatUserIdFromUserId(
      chatId,
      userId
    );

    if (!chatUserId) {
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        message: "Unable to locate user in chat",
      });
    }

    try {
      const newMessage = await messageModel.createMessage(
        chatId,
        chatUserId,
        message
      );
      return res.status(httpConstants.HTTP_STATUS_CREATED).json({
        message: newMessage,
      });
    } catch (error) {
      console.error(error);
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        message: "Failed to create a new chat message",
      });
    }
  },
];

export {
  newConnection,
  messageListener,
  createNewChat,
  findChatFromUserIds,
  getChatMessages,
  createNewChatMessage,
};
