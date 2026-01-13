import { Router } from "express";
import expressWs from "express-ws";

import * as chatController from "../controllers/chatController";

const router = Router();
const chatRouter = expressWs(router as any).app;

// Websocket routes
chatRouter.ws("/", chatController.newConnection, chatController.chatResponse);

// HTTP routes
chatRouter.post("/", ...chatController.createNewChat);
chatRouter.get("/", ...chatController.findChatFromUserIds);
chatRouter.get("/:chatId/messages", chatController.getChatMessages);
chatRouter.post("/:chatId/messages", ...chatController.createNewChatMessage);

export default chatRouter;
