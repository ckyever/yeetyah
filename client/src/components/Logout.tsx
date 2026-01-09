import { useNavigate, useOutletContext } from "react-router";

import * as api from "../lib/api";
import * as constants from "../constants";
import * as context from "../context";

function Logout() {
  const navigate = useNavigate();
  const { setUserToken, setUser } = useOutletContext<context.OutletContext>();

  const handleLogout = () => {
    setUserToken("");
    setUser({} as api.User);
    localStorage.removeItem(constants.LOCAL_STORAGE_KEY_USER_TOKEN);
    localStorage.removeItem(constants.LOCAL_STORAGE_KEY_USER);
    navigate("/login", { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
