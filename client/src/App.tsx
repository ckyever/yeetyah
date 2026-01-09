import { useState } from "react";
import { Outlet } from "react-router";

import * as api from "./lib/api";
import * as constants from "./constants";
import * as context from "./context";

function App() {
  const [userToken, setUserToken] = useState(
    localStorage.getItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN)
  );
  const [user, setUser] = useState<api.User>(
    JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_KEY_USER) ?? "")
  );

  return (
    <>
      <Outlet
        context={
          {
            userToken,
            setUserToken,
            user,
            setUser,
          } satisfies context.OutletContext
        }
      />
    </>
  );
}

export default App;
