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

export { createUser };
