import { useState } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import Chat from "./Chat";
import Profile from "./Profile";
import UsersList from "./UsersList";

import styles from "../styles/Home.module.css";

function Home() {
  const [selectedUser, setSelectedUser] = useState<api.UsersListItem | null>(
    null,
  );
  const { currentUser } = useOutletContext<context.OutletContext>();

  const closeChat = () => {
    setSelectedUser(null);
  };
  return (
    <div className={styles.home}>
      <UsersList setSelectedUser={setSelectedUser} />
      {selectedUser && (
        <Chat
          selectedUser={selectedUser}
          key={selectedUser.id}
          closeChat={closeChat}
        />
      )}
      <Profile
        profileImage={(currentUser && currentUser.profile_image) ?? null}
        username={currentUser && currentUser.username}
        displayName={(currentUser && currentUser.display_name) ?? null}
      />
    </div>
  );
}

export default Home;
