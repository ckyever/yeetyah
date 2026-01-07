import { Router } from "express";

import * as usersController from "../controllers/usersController";

const usersRouter = Router();
usersRouter.post("/", usersController.createUser);

// Get users - GET /api/users
// Get user profile - GET /api/users/:userId
// Update profile - PUT /api/users/:userId

export default usersRouter;
