import type { Request, Response } from "express";
import { constants as httpConstants } from "http2";

import * as usersModel from "../models/usersModel";

interface UserParams {
  username: string;
  password: string;
  display_name: string;
  profile_image: string;
}

const createUser = async (req: Request<UserParams>, res: Response) => {
  const { username, password, display_name, profile_image } = req.body;

  if (!username || !password) {
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: "Invalid create user parameters" });
  }

  const newUser = await usersModel.createUser(
    username,
    password,
    display_name,
    profile_image
  );

  if (newUser) {
    return res
      .status(httpConstants.HTTP_STATUS_CREATED)
      .json({ username, display_name, profile_image });
  } else {
    return res
      .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create a user" });
  }
};

export { createUser };
