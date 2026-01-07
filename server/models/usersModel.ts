import { prisma } from "../lib/prisma";

const createUser = async (
  username: string,
  password: string,
  displayName: string,
  profileImage: string
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password,
        display_name: displayName,
        profile_image: profileImage,
      },
    });
    return newUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { createUser };
