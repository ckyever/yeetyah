import { prisma } from "../lib/prisma";

const getChatUserIdFromUserId = async (chatId: number, userId: number) => {
  const result = await prisma.chat_user.findUnique({
    where: {
      chat_id_user_id: {
        chat_id: chatId,
        user_id: userId,
      },
    },
  });
  if (result) {
    return result.id;
  } else {
    return null;
  }
};

export { getChatUserIdFromUserId };
