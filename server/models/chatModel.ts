import { prisma } from "../lib/prisma";

const createChat = async (
  name: string,
  fromUserId: number,
  toUserId: number
) => {
  const chat = prisma.chat.create({
    data: {
      name: name,
      recipients: { create: [{ user_id: fromUserId }, { user_id: toUserId }] },
    },
    include: {
      recipients: {
        where: {
          user_id: fromUserId,
        },
      },
    },
  });
  return chat;
};

const getChatFromUserIds = async (userIds: number[]) => {
  const chat = prisma.chat.findFirst({
    where: {
      AND: [
        // Chat contains every user from the array
        ...userIds.map((id) => ({
          recipients: {
            some: {
              user_id: id,
            },
          },
        })),
        // Ensure the chat does not contain any other users
        { recipients: { every: { user_id: { in: userIds } } } },
      ],
    },
  });
  return chat;
};

export { createChat, getChatFromUserIds };
