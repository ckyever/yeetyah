import { hash } from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";
import { constants as httpConstants } from "http2";
import jwt from "jsonwebtoken";

import { VALIDATION } from "../lib/constants";
import * as usersModel from "../models/usersModel";

interface UserParams {
  username: string;
  password: string;
  display_name: string;
  profile_image: string;
}

const validateUser = [
  validator
    .body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ max: VALIDATION.USERNAME.MAX_LENGTH })
    .withMessage(
      `Username must be ${VALIDATION.USERNAME.MAX_LENGTH} characters or less`
    ),
  validator
    .body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: VALIDATION.PASSWORD.MIN_LENGTH })
    .withMessage(
      `Password must be ${VALIDATION.PASSWORD.MIN_LENGTH} characters or more`
    ),
  validator.body("display_name").trim(),
  validator.body("profile_image").trim(),
];

const createUser = [
  validateUser,
  async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: "Invalid create user body", errors: errors.array() });
    }

    const {
      username,
      password,
      display_name: displayName,
      profile_image: profileImage,
    } = validator.matchedData(req);

    // Check if username already exists
    if (await usersModel.doesUsernameExist(username)) {
      return res
        .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: "This username is not available" });
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
  },
];

export { createUser };
