import type { Request, Response } from "express";
import * as validator from "express-validator";
import { constants as httpConstants } from "http2";
import { type WebsocketRequestHandler } from "express-ws";

import * as chatModel from "../models/chatModel";

const chatResponse: WebsocketRequestHandler = async (ws, req) => {
  ws.on("message", (message: string) => {
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
      const chat = await chatModel.createChat(
        name,
        fromUserId,
        toUserId,
        message
      );
      return res.json({
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

export { chatResponse, createNewChat };
