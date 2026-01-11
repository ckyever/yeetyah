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
