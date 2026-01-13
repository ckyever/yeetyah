import { useEffect } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import UserTitle from "./UserTitle";

import styles from "../styles/Messages.module.css";

interface MessagesProps {
  chatId: number | null;
  messages: api.Message[];
  setMessages: React.Dispatch<React.SetStateAction<api.Message[]>>;
}

function Messages({ chatId, messages, setMessages }: MessagesProps) {
  const { currentUser } = useOutletContext<context.OutletContext>();

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
  }, [chatId, setMessages]);

  return (
    <ul className={styles["message-list"]}>
      {messages &&
        messages.map((message, index) => {
          const titleInfo = {
            id: message.author.user.id,
            username: message.author.user.username,
            display_name: message.author.user.display_name,
          } as api.UsersListItem;
          let classNameList = `${styles.message}`;
          if (titleInfo.id === currentUser!.id) {
            classNameList += ` ${styles["current-user"]}`;
          }
          // Currently have to use index as key because new messages will not have an ID (CKYTODO: Need to fix)
          return (
            <li key={index} className={classNameList}>
              <UserTitle user={titleInfo} />
              <div>{message.text}</div>
            </li>
          );
        })}
    </ul>
  );
}

export default Messages;
