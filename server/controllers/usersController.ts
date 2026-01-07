import { hash } from "bcryptjs";
import type { Request, Response } from "express";
import { constants as httpConstants } from "http2";
import jwt from "jsonwebtoken";

import * as usersModel from "../models/usersModel";

interface UserParams {
  username: string;
  password: string;
  display_name: string;
  profile_image: string;
}

const createUser = async (req: Request<UserParams>, res: Response) => {
  const {
    username,
    password,
    display_name: displayName,
    profile_image: profileImage,
  } = req.body;

  if (!username || !password) {
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: "Invalid create user parameters" });
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await hash(password, SALT_ROUNDS);

  const newUser = await usersModel.createUser(
    username,
    hashedPassword,
    displayName,
    profileImage
  );

  if (!newUser) {
    return res
      .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create a user" });
  }

  if (!process.env.SECRET_KEY) {
    throw new Error("Missing secret key environment variable");
  }

  const secret: string = process.env.SECRET_KEY;
  jwt.sign(
    { user: newUser },
    secret,
    { expiresIn: "1 days" },
    (error, token) => {
      if (error) {
        console.error(error);
        return res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to get a token" });
      } else {
        return res
          .status(httpConstants.HTTP_STATUS_CREATED)
          .json({ user_id: newUser.id, token });
      }
    }
  );
};

export { createUser };
