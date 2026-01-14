import { Router } from "express";
import multer from "multer";

import * as usersController from "../controllers/usersController";

const upload = multer({ dest: "uploads/" });

const usersRouter = Router();
usersRouter.get("/", usersController.getUserList);
usersRouter.post("/", ...usersController.createUser);
usersRouter.put(
  "/:userId",
  upload.single("profileImage"),
  ...usersController.updateUser
);
usersRouter.get("/username/:username", usersController.isUsernameAvailable);

export default usersRouter;
