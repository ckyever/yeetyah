import { useEffect, useRef, useState, type FormEvent } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import Messages from "./Messages";
import UserTitle from "./UserTitle";

import styles from "../styles/Chat.module.css";
import buttonStyles from "../styles/Buttons.module.css";
import windowStyles from "../styles/Window.module.css";

import closeIcon from "../assets/icons/close.svg";

interface ChatProps {
  selectedUser: api.UsersListItem | null;
  closeChat: () => void;
}

function Chat({ selectedUser, closeChat }: ChatProps) {
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatName, setChatName] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<api.Message[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const { currentUser } = useOutletContext<context.OutletContext>();

  useEffect(() => {
    if (!chatId) return;
    const url = `${
      import.meta.env.VITE_WEBSOCKET_URI
    }/api/chat/${chatId}/user/${currentUser!.id}`;
    websocketRef.current = new WebSocket(url);

    websocketRef.current.onopen = () => {
      console.log("Connected");
    };

    websocketRef.current.onclose = () => {
      console.log("Disconnected");
    };

    websocketRef.current.onmessage = (event: MessageEvent) => {
      const message: api.Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    websocketRef.current.onerror = (event: Event) => {
      console.error(`Error: ${event}`);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [chatId, currentUser]);

  useEffect(() => {
    const getChatId = async (currentUserId: number, selectedUserId: number) => {
      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/api/chat/?user_ids=${currentUserId},${selectedUserId}`;
      const result: api.ChatResult = await api.apiFetch<api.ChatResult>(url);
      if (result.data.chat) {
        setChatId(result.data.chat.id);
        if (result.data.chat.name) {
          setChatName(result.data.chat.name);
        } else {
          setChatName(`Chat with ${selectedUser?.username}`);
        }
      } else {
        setChatId(null);
        setChatName(null);
      }
    };

    if (currentUser?.id && selectedUser?.id) {
      getChatId(currentUser.id, selectedUser.id);
    }
  }, [currentUser, selectedUser]);

  // Submit form when pressing Enter key without Shift instead of new line
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (chatId) {
      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/api/chat/${chatId}/messages`;
      const result: api.MessageResult = await api.apiFetch<api.MessageResult>(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            user_id: currentUser!.id,
            message,
          }),
        },
      );

      if (result.ok) {
        if (websocketRef.current == null) {
          console.error("Connection is not available");
          return;
        }

        const newMessage = {
          chat_id: chatId,
          text: message,
          timestamp: Date(),
          author_id: currentUser!.id,
          author: {
            chat_id: chatId,
            user_id: currentUser!.id,
            user: currentUser,
          },
        } as api.Message;

        const data = { chat_id: chatId, message: newMessage };
        websocketRef.current.send(JSON.stringify(data));

        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
      } else {
        console.error("Unable to create chat message");
      }
    } else {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/chat/`;
      const result: api.ChatResult = await api.apiFetch<api.ChatResult>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: chatName,
          from_user_id: currentUser!.id,
          to_user_id: selectedUser!.id,
          message,
        }),
      });

      if (result.ok) {
        setChatId(result.data.chat.id);
        setMessage("");
      } else {
        console.error("Unable to create chat");
      }
    }
  };

  return (
    <form
      className={`${styles["chat-window"]} ${windowStyles.window}`}
      onSubmit={(event) => handleSubmit(event)}
      ref={formRef}
    >
      <div
        className={`${styles["window-header"]} ${windowStyles["title-bar"]}`}
      >
        {chatName && <h3>{chatName}</h3>}
        <button
          type="button"
          onClick={closeChat}
          className={`${buttonStyles.button} ${buttonStyles.red}`}
        >
          <img src={closeIcon} alt="close icon" className={buttonStyles.icon} />
        </button>
      </div>
      {!chatId && (
        <div className={styles.recipients}>
          <span>To: </span>
          {selectedUser && (
            <UserTitle user={selectedUser} showProfileImage={false} />
          )}
        </div>
      )}
      <Messages
        key={chatId}
        chatId={chatId}
        messages={messages}
        setMessages={setMessages}
      />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
      ></textarea>
      <button type="submit" disabled={selectedUser && message ? false : true}>
        Send
      </button>
    </form>
  );
}

export default Chat;
