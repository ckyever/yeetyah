import { useOutletContext } from "react-router";

import * as context from "../context";

import Profile from "./Profile";
import UsersList from "./UsersList";

function Home() {
  const { user } = useOutletContext<context.OutletContext>();
  return (
    <>
      <Profile
        username={user && user.username}
        displayName={(user && user.display_name) ?? null}
      />
      <UsersList />
    </>
  );
}

export default Home;
