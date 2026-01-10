import { Router } from "express";
import expressWs from "express-ws";

import * as chatController from "../controllers/chatController";

const router = Router();
const chatRouter = expressWs(router as any).app;
chatRouter.ws("/", chatController.chatResponse);

export default chatRouter;
