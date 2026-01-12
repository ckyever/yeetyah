import { useEffect, useState, type FormEvent } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import Messages from "./Messages";
import UserTitle from "./UserTitle";

import styles from "../styles/Chat.module.css";

interface ChatProps {
  selectedUser: api.UsersListItem | null;
}

function Chat({ selectedUser }: ChatProps) {
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatName, setChatName] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const { currentUser } = useOutletContext<context.OutletContext>();

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
        }
      );

      if (!result.ok) {
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

      if (!result.ok) {
        console.error("Unable to create chat");
      }
    }
  };

  return (
    <form
      className={styles["chat-window"]}
      onSubmit={(event) => handleSubmit(event)}
    >
      {chatName && <h3>{chatName}</h3>}
      <div>
        <span>To: </span>
        {selectedUser && <UserTitle user={selectedUser} />}
      </div>
      <Messages chatId={chatId} />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      ></textarea>
      <button type="submit" disabled={selectedUser && message ? false : true}>
        Send
      </button>
    </form>
  );
}

export default Chat;

/* CKYTODO Websocket earlier attempt
function Chat() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_WEBSOCKET_URI}/api/chat`;
    websocketRef.current = new WebSocket(url);
    websocketRef.current.onopen = (e) => {
      console.log("Connected");
    };

    websocketRef.current.onclose = (e) => {
      console.log("Disconnected");
    };

    websocketRef.current.onmessage = (e) => {
      console.log(`Received: ${e.data}`);
      setChatMessages((prev) => [...prev, e.data]);
    };

    websocketRef.current.onerror = (e) => {
      console.error(`Error: ${e}`);
    };
  }, []);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (websocketRef.current == null) {
      console.error("Connection is not available");
    } else {
      websocketRef.current.send(message);
    }
    setChatMessages((prev) => [...prev, message]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>
      <div id="messages"></div>
      <ul>
        {chatMessages.map((message, index) => (
          // CKYTODO Replace index with message ID
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={(event) => handleSend(event)}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
*/
