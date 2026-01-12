import { prisma } from "../lib/prisma";

const getMessagesByChatId = async (chatId: number) => {
  const messages = prisma.message.findMany({
    where: {
      chat_id: chatId,
    },
    include: {
      author: {
        include: { user: true },
      },
    },
  });
  return messages;
};

const createMessage = async (chatId: number, userId: number, text: string) => {
  const message = prisma.message.create({
    data: {
      chat_id: chatId,
      author_id: userId,
      text: text,
    },
  });
  return message;
};

export { getMessagesByChatId, createMessage };
