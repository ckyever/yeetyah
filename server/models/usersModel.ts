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

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const updateUser = async (
  id: number,
  displayName: string,
  profileImage: string
) => {
  const user = await prisma.user.update({
    data: {
      display_name: displayName,
      profile_image: profileImage,
    },
    where: {
      id: id,
    },
  });
  return user;
};

export {
  createUser,
  getUserByUsername,
  doesUsernameExist,
  getAllUsers,
  updateUser,
};
