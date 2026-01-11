import { useState } from "react";

import * as api from "../lib/api";

import UserTitle from "./UserTitle";

import styles from "../styles/Chat.module.css";

interface ChatProps {
  selectedUser: api.UsersListItem | null;
}

function Chat({ selectedUser }: ChatProps) {
  const [message, setMessage] = useState("");

  return (
    <form className={styles["chat-window"]}>
      <div>
        <span>To: </span>
        {selectedUser && <UserTitle user={selectedUser} />}
      </div>
      <div>Messages go here</div>
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
