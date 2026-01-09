import { compare } from "bcryptjs";
import type { Request, Response } from "express";
import * as validator from "express-validator";
import { constants as httpConstants } from "http2";
import jwt from "jsonwebtoken";

import * as usersModel from "../models/usersModel";

const validateCredentials = [
  validator.body("username"),
  validator.body("password"),
];

const loginUser = [
  validateCredentials,
  async (req: Request, res: Response) => {
    const { username, password } = validator.matchedData(req);

    const user = await usersModel.getUserByUsername(username);

    if (!user) {
      return res
        .status(httpConstants.HTTP_STATUS_UNAUTHORIZED)
        .json({ errors: [{ msg: "Username or password is incorrect" }] });
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(httpConstants.HTTP_STATUS_UNAUTHORIZED)
        .json({ errors: [{ msg: "Username or password is incorrect" }] });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("Missing secret key environment variable");
    }

    const secret: string = process.env.SECRET_KEY;
    jwt.sign({ user }, secret, { expiresIn: "1 days" }, (error, token) => {
      if (error) {
        console.error(error);
        return res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to get token" });
      }
      return res.json({ user_id: user.id, token });
    });
  },
];

export { loginUser };
