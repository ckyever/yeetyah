import type { Request, Response } from "express";
import { constants as httpConstants } from "http2";
import * as validator from "express-validator";
import { type WebsocketRequestHandler } from "express-ws";
import { type WebSocket } from "ws";

import * as chatModel from "../models/chatModel";
import * as chatUserModel from "../models/chatUserModel";
import * as messageModel from "../models/messageModel";

const activeUsers = new Map<number, WebSocket>();

const newConnection: WebsocketRequestHandler = async (ws, req, next) => {
  const { userId } = req.query;
  activeUsers.set(Number(userId), ws);
  next();
};

const chatResponse: WebsocketRequestHandler = async (ws, req) => {
  console.log("Connected User IDs:");
  activeUsers.forEach((ws, userId) => {
    console.log(userId);
  });

  ws.on("message", (message: string) => {
    // If chat ID does not exist
    // Create chat
    // Create message
    // Send message
    // Chat ID does exist
    console.log("Received: " + message);
    ws.send("pong");
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
  chatResponse,
  createNewChat,
  findChatFromUserIds,
  getChatMessages,
  createNewChatMessage,
};
