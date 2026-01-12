import { Router } from "express";
import expressWs from "express-ws";

import * as chatController from "../controllers/chatController";

const router = Router();
const chatRouter = expressWs(router as any).app;
chatRouter.ws("/", chatController.chatResponse);
chatRouter.post("/", ...chatController.createNewChat);
chatRouter.get("/", ...chatController.findChatFromUserIds);
chatRouter.get("/:chatId/messages", chatController.getChatMessages);

export default chatRouter;
