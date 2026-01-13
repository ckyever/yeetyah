import { Router } from "express";

import * as usersController from "../controllers/usersController";

const usersRouter = Router();
usersRouter.get("/", usersController.getUserList);
usersRouter.post("/", ...usersController.createUser);
usersRouter.put("/:userId", ...usersController.updateUser);
usersRouter.get("/username/:username", usersController.isUsernameAvailable);

export default usersRouter;
