import { prisma } from "../lib/prisma";

const createChat = async (
  name: string,
  fromUserId: number,
  toUserId: number,
  message: string
) => {
  const chat = prisma.chat.create({
    data: {
      name: name,
      recipients: { create: [{ user_id: fromUserId }, { user_id: toUserId }] },
      messages: { create: [{ text: message }] },
    },
  });
  return chat;
};

export { createChat };
