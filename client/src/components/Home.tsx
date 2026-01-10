import { Outlet, useOutletContext } from "react-router";

import * as context from "../context";

import Profile from "./Profile";

function Home() {
  const { user } = useOutletContext<context.OutletContext>();
  return (
    <>
      <Profile
        username={user && user.username}
        displayName={(user && user.display_name) ?? null}
      />
      <Outlet />
    </>
  );
}

export default Home;
