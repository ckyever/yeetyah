import { useState } from "react";
import { useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as context from "../context";

import Chat from "./Chat";
import Profile from "./Profile";
import UsersList from "./UsersList";

function Home() {
  const [selectedUser, setSelectedUser] = useState<api.UsersListItem | null>(
    null
  );
  const { currentUser } = useOutletContext<context.OutletContext>();

  const closeChat = () => {
    setSelectedUser(null);
  };
  return (
    <>
      <Profile
        profileImage={(currentUser && currentUser.profile_image) ?? null}
        username={currentUser && currentUser.username}
        displayName={(currentUser && currentUser.display_name) ?? null}
      />
      <UsersList setSelectedUser={setSelectedUser} />
      {selectedUser && (
        <Chat
          selectedUser={selectedUser}
          key={selectedUser.id}
          closeChat={closeChat}
        />
      )}
    </>
  );
}

export default Home;
