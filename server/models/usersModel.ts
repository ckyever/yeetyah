import { prisma } from "../lib/prisma";

const createUser = async (
  username: string,
  password: string,
  displayName: string,
  profileImage: string
) => {
  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: password,
      display_name: displayName,
      profile_image: profileImage,
    },
  });
  return newUser;
};

const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
};

const doesUsernameExist = async (username: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return existingUser;
};

export { createUser, getUserByUsername, doesUsernameExist };
