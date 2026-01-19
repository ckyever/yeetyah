import { useEffect, useRef } from "react";
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
  const messageListRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const getMessages = async (chatId: number) => {
      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/api/chat/${chatId}/messages`;
      const result: api.MessagesResult =
        await api.apiFetch<api.MessagesResult>(url);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ul className={styles["message-list"]} ref={messageListRef}>
      {chatId && (
        <li className={styles["start-of-chat"]}>
          <i>Start of chat history</i>
        </li>
      )}
      {messages &&
        messages.map((message, index) => {
          const titleInfo = {
            id: message.author.user.id,
            username: message.author.user.username,
            display_name: message.author.user.display_name,
            profile_image: message.author.user.profile_image,
          } as api.UsersListItem;
          const isCurrentUser = titleInfo.id === currentUser!.id;
          // Currently have to use index as key because new messages will not have an ID (CKYTODO: Need to fix)
          return (
            <li
              key={index}
              className={
                isCurrentUser
                  ? `${styles.message} ${styles.right}`
                  : styles.message
              }
            >
              {!isCurrentUser && (
                <>
                  <img
                    className={styles["profile-image"]}
                    src={message.author.user.profile_image}
                    alt={`${message.author.user.display_name}'s profile picture`}
                  />
                  <div className={styles["display-name"]}>
                    <UserTitle
                      user={titleInfo}
                      showDisplayNameOnly={true}
                      showProfileImage={false}
                    />
                    <span> says: </span>
                  </div>
                </>
              )}
              <div className={styles["text"]}>{message.text}</div>
            </li>
          );
        })}
    </ul>
  );
}

export default Messages;
