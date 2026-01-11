import { Router } from "express";

import * as usersController from "../controllers/usersController";

const usersRouter = Router();
usersRouter.get("/", usersController.getUserList);
usersRouter.post("/", ...usersController.createUser);
usersRouter.get("/username/:username", usersController.isUsernameAvailable);

// Get user profile - GET /api/users/:userId
// Update profile - PUT /api/users/:userId

export default usersRouter;
