import * as api from "../lib/api";

import UserTitle from "./UserTitle";

import styles from "../styles/Chat.module.css";

interface ChatProps {
  selectedUser: api.UsersListItem | null;
}

function Chat({ selectedUser }: ChatProps) {
  return (
    <form className={styles["chat-window"]}>
      <div>
        <span>To: </span>
        {selectedUser && <UserTitle user={selectedUser} />}
      </div>
      <div>Messages go here</div>
      <textarea></textarea>
      <button type="submit">Send</button>
    </form>
  );
}

export default Chat;
