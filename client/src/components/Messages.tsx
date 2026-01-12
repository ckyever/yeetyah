import { useEffect, useState } from "react";

import * as api from "../lib/api";

import UserTitle from "./UserTitle";

interface MessagesProps {
  chatId: number | null;
}

function Messages({ chatId }: MessagesProps) {
  const [messages, setMessages] = useState<api.Message[]>([]);

  useEffect(() => {
    const getMessages = async (chatId: number) => {
      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/api/chat/${chatId}/messages`;
      const result: api.MessagesResult = await api.apiFetch<api.MessagesResult>(
        url
      );
      if (result.data.messages) {
        setMessages(result.data.messages);
      } else {
        setMessages([]);
      }
    };
    const clearMessages = async () => setMessages([]);

    if (chatId) {
      getMessages(chatId);
    } else {
      clearMessages();
    }
  }, [chatId]);

  return (
    <ul>
      {messages &&
        messages.map((message) => {
          const titleInfo = {
            id: message.author.user.id,
            username: message.author.user.username,
            display_name: message.author.user.display_name,
          } as api.UsersListItem;
          return (
            <li key={message.id}>
              <UserTitle user={titleInfo} />
              <div>{message.text}</div>
            </li>
          );
        })}
    </ul>
  );
}

export default Messages;
