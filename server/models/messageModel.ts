import { prisma } from "../lib/prisma";

const getMessagesByChatId = async (chatId: number) => {
  const messages = prisma.message.findMany({
    where: {
      chat_id: chatId,
    },
  });
  return messages;
};

export { getMessagesByChatId };
