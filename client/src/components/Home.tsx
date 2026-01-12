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
  return (
    <>
      <Profile
        username={currentUser && currentUser.username}
        displayName={(currentUser && currentUser.display_name) ?? null}
      />
      <UsersList setSelectedUser={setSelectedUser} />
      <Chat selectedUser={selectedUser} />
    </>
  );
}

export default Home;
