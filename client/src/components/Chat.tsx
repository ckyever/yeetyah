import { useState, useEffect, useRef } from "react";

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
  );
}

export default Chat;
